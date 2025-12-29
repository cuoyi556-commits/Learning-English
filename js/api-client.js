// Nano Banana Pro API 客户端

import { CONFIG } from './config.js';

export class ApiClient {
    constructor() {
        this.apiKey = this.getApiKey();
    }

    // 从本地存储获取API Key
    getApiKey() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY) || '';
    }

    // 设置API Key
    setApiKey(apiKey) {
        localStorage.setItem(CONFIG.STORAGE_KEYS.API_KEY, apiKey);
        this.apiKey = apiKey;
    }

    // 获取请求头
    getHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
        };
    }

    /**
     * 创建图像生成任务
     * @param {string} prompt - AI提示词
     * @param {object} options - 可选参数
     * @returns {Promise<string>} 任务ID
     */
    async createTask(prompt, options = {}) {
        const {
            aspectRatio = CONFIG.DEFAULT_ASPECT_RATIO,
            resolution = CONFIG.DEFAULT_RESOLUTION,
            outputFormat = CONFIG.DEFAULT_OUTPUT_FORMAT
        } = options;

        const payload = {
            model: CONFIG.MODEL_NAME,
            input: {
                prompt: prompt,
                image_input: [],
                aspect_ratio: aspectRatio,
                resolution: resolution,
                output_format: outputFormat
            }
        };

        try {
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/createTask`,
                {
                    method: 'POST',
                    headers: this.getHeaders(),
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API Key 无效，请检查后重试');
                } else if (response.status === 402) {
                    throw new Error('账户余额不足，请充值后重试');
                } else if (response.status === 429) {
                    throw new Error('请求过于频繁，请稍后重试');
                }
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();

            if (data.code !== 200) {
                throw new Error(data.msg || '创建任务失败');
            }

            return data.data.taskId;
        } catch (error) {
            console.error('创建任务错误:', error);
            throw error;
        }
    }

    /**
     * 查询任务状态
     * @param {string} taskId - 任务ID
     * @returns {Promise<object>} 任务状态信息
     */
    async queryTaskStatus(taskId) {
        try {
            const response = await fetch(
                `${CONFIG.API_BASE_URL}/recordInfo?taskId=${taskId}`,
                {
                    method: 'GET',
                    headers: this.getHeaders()
                }
            );

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();

            if (data.code !== 200) {
                throw new Error(data.msg || '查询任务失败');
            }

            return {
                taskId: data.data.taskId,
                state: data.data.state,
                resultJson: data.data.resultJson,
                failCode: data.data.failCode,
                failMsg: data.data.failMsg
            };
        } catch (error) {
            console.error('查询任务错误:', error);
            throw error;
        }
    }

    /**
     * 轮询等待任务完成
     * @param {string} taskId - 任务ID
     * @param {function} onProgress - 进度回调函数
     * @returns {Promise<string>} 生成的图片URL
     */
    async pollTaskCompletion(taskId, onProgress) {
        const startTime = Date.now();
        let attempts = 0;

        while (attempts < CONFIG.MAX_POLL_ATTEMPTS) {
            // 检查超时
            if (Date.now() - startTime > CONFIG.POLL_TIMEOUT) {
                throw new Error('任务超时，请稍后重试');
            }

            // 查询状态
            const status = await this.queryTaskStatus(taskId);

            // 报告进度
            if (onProgress) {
                onProgress({
                    state: status.state,
                    attempts: attempts + 1
                });
            }

            // 检查状态
            if (status.state === 'success') {
                // 解析结果
                const result = JSON.parse(status.resultJson);
                return result.resultUrls[0];
            }

            if (status.state === 'fail') {
                throw new Error(status.failMsg || '图像生成失败');
            }

            // 等待后重试
            await this.sleep(CONFIG.POLL_INTERVAL);
            attempts++;
        }

        throw new Error('任务处理时间过长，请稍后查看历史记录');
    }

    // 延迟函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
