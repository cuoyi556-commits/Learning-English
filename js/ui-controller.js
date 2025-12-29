// UI 控制器

export class UIController {
    constructor() {
        this.elements = this.initElements();
    }

    // 初始化DOM元素引用
    initElements() {
        return {
            // 输入元素
            sceneSelect: document.getElementById('sceneSelect'),
            sceneInput: document.getElementById('sceneInput'),
            titleInput: document.getElementById('titleInput'),
            apiKeyInput: document.getElementById('apiKey'),
            saveApiKeyBtn: document.getElementById('saveApiKey'),

            // 按钮元素
            generateBtn: document.getElementById('generateBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            regenerateBtn: document.getElementById('regenerateBtn'),

            // 进度显示元素
            progressSection: document.getElementById('progressSection'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),

            // 结果显示元素
            resultSection: document.getElementById('resultSection'),
            resultImage: document.getElementById('resultImage'),
        };
    }

    // 填充场景选项
    populateScenes(scenes) {
        const select = this.elements.sceneSelect;
        select.innerHTML = '<option value="">选择场景...</option>';

        scenes.forEach(scene => {
            const option = document.createElement('option');
            option.value = scene;
            option.textContent = scene;
            select.appendChild(option);
        });
    }

    // 获取用户输入
    getInput() {
        const scene = this.elements.sceneSelect.value || this.elements.sceneInput.value.trim();
        const title = this.elements.titleInput.value.trim();

        if (!scene) {
            throw new Error('请选择或输入场景');
        }

        if (!title) {
            throw new Error('请输入小报标题');
        }

        return { scene, title };
    }

    // 显示/隐藏进度区域
    showProgress(show = true) {
        this.elements.progressSection.style.display = show ? 'block' : 'none';
        if (show) {
            this.elements.resultSection.style.display = 'none';
            this.elements.progressFill.style.width = '0%';
        }
    }

    // 更新进度
    updateProgress(message, percentage = null) {
        this.elements.progressText.textContent = message;
        if (percentage !== null) {
            this.elements.progressFill.style.width = `${percentage}%`;
        }
    }

    // 显示生成结果
    showResult(imageUrl) {
        this.elements.progressSection.style.display = 'none';
        this.elements.resultSection.style.display = 'block';
        this.elements.resultImage.src = imageUrl;
    }

    // 显示错误消息
    showError(message) {
        alert(message);
    }

    // 显示成功消息
    showSuccess(message) {
        alert(message);
    }

    // 下载图片
    downloadImage(url, filename) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || '英语单词小报.png';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // 重置表单
    resetForm() {
        this.elements.resultSection.style.display = 'none';
        this.elements.progressSection.style.display = 'none';
    }

    // 设置生成按钮状态
    setGenerateButtonEnabled(enabled) {
        this.elements.generateBtn.disabled = !enabled;
        this.elements.generateBtn.textContent = enabled ? '生成小报' : '生成中...';
    }

    // 加载保存的API Key
    loadSavedApiKey(apiKey) {
        if (apiKey) {
            this.elements.apiKeyInput.value = apiKey;
        }
    }
}
