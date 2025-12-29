// 主程序入口

import { CONFIG } from './config.js';
import { getSceneList } from './vocabularies.js';
import { PromptGenerator } from './prompt-generator.js';
import { ApiClient } from './api-client.js';
import { UIController } from './ui-controller.js';

class App {
    constructor() {
        this.ui = new UIController();
        this.promptGenerator = new PromptGenerator();
        this.apiClient = new ApiClient();
        this.isGenerating = false;
        this.currentScene = null;
        this.currentTitle = null;

        this.init();
    }

    // 初始化应用
    init() {
        // 填充场景选项（作为快捷选项）
        const scenes = getSceneList();
        this.ui.populateScenes(scenes);

        // 加载保存的API Key
        const savedKey = localStorage.getItem(CONFIG.STORAGE_KEYS.API_KEY);
        if (savedKey) {
            this.ui.loadSavedApiKey(savedKey);
        }

        // 绑定事件
        this.bindEvents();
    }

    // 绑定事件监听器
    bindEvents() {
        // 保存API Key
        this.ui.elements.saveApiKeyBtn.addEventListener('click', () => {
            this.handleSaveApiKey();
        });

        // 生成小报按钮
        this.ui.elements.generateBtn.addEventListener('click', () => {
            this.handleGenerate();
        });

        // 下载按钮
        this.ui.elements.downloadBtn.addEventListener('click', () => {
            const url = this.ui.elements.resultImage.src;
            const title = this.currentTitle || '英语单词小报';
            this.ui.downloadImage(url, `${title}.png`);
        });

        // 重新生成
        this.ui.elements.regenerateBtn.addEventListener('click', () => {
            this.ui.resetForm();
        });

        // 场景选择联动
        this.ui.elements.sceneSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.ui.elements.sceneInput.value = '';
            }
        });

        this.ui.elements.sceneInput.addEventListener('input', (e) => {
            if (e.target.value) {
                this.ui.elements.sceneSelect.value = '';
            }
        });
    }

    // 处理保存API Key
    handleSaveApiKey() {
        const apiKey = this.ui.elements.apiKeyInput.value.trim();
        if (!apiKey) {
            this.ui.showError('请输入API Key');
            return;
        }
        this.apiClient.setApiKey(apiKey);
        this.ui.showSuccess('API Key已保存');
    }

    // 处理生成小报
    async handleGenerate() {
        if (this.isGenerating) return;

        try {
            // 验证API Key
            if (!this.apiClient.apiKey) {
                throw new Error('请先设置API Key');
            }

            // 获取输入
            const { scene, title } = this.ui.getInput();

            // 保存当前场景和标题
            this.currentScene = scene;
            this.currentTitle = title;

            // 开始生成
            this.isGenerating = true;
            this.ui.setGenerateButtonEnabled(false);
            this.ui.showProgress(true);
            this.ui.updateProgress('正在生成提示词...');

            // 生成提示词（不再指定具体词汇，让 AI 自己决定）
            const prompt = this.promptGenerator.generate(scene, title);
            console.log('生成的提示词:', prompt);

            // 创建任务
            this.ui.updateProgress('正在创建生成任务...');
            const taskId = await this.apiClient.createTask(prompt);
            console.log('任务ID:', taskId);

            // 轮询等待结果
            this.ui.updateProgress('正在生成图像，请稍候...');
            const imageUrl = await this.apiClient.pollTaskCompletion(
                taskId,
                (progress) => {
                    console.log('进度:', progress);
                }
            );

            // 显示结果
            this.ui.showResult(imageUrl);

            // 保存到历史记录
            this.saveHistory(scene, title, imageUrl);

        } catch (error) {
            console.error('生成错误:', error);
            this.ui.showError(error.message);
            this.ui.showProgress(false);
        } finally {
            this.isGenerating = false;
            this.ui.setGenerateButtonEnabled(true);
        }
    }

    // 保存到历史记录
    saveHistory(scene, title, imageUrl) {
        if (!CONFIG.ENABLE_HISTORY) return;

        try {
            const history = JSON.parse(
                localStorage.getItem(CONFIG.STORAGE_KEYS.HISTORY) || '[]'
            );

            history.unshift({
                scene,
                title,
                imageUrl,
                timestamp: Date.now()
            });

            // 保留最近N条记录
            if (history.length > CONFIG.MAX_HISTORY_ITEMS) {
                history.pop();
            }

            localStorage.setItem(CONFIG.STORAGE_KEYS.HISTORY, JSON.stringify(history));
        } catch (error) {
            console.error('保存历史记录失败:', error);
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new App();
});
