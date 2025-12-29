// 配置文件 - 英语版
export const CONFIG = {
    // API配置
    API_BASE_URL: 'https://api.kie.ai/api/v1/jobs',
    MODEL_NAME: 'nano-banana-pro',

    // 轮询配置
    POLL_INTERVAL: 2000,        // 每2秒查询一次
    MAX_POLL_ATTEMPTS: 150,     // 最多查询5分钟
    POLL_TIMEOUT: 300000,       // 5分钟超时

    // 图像生成参数
    DEFAULT_ASPECT_RATIO: '3:4', // 竖版A4比例
    DEFAULT_RESOLUTION: '2K',
    DEFAULT_OUTPUT_FORMAT: 'png',

    // 本地存储键名 - 英语版使用不同的键名
    STORAGE_KEYS: {
        API_KEY: 'english_szlb_api_key',
        LAST_SCENE: 'english_szlb_last_scene',
        HISTORY: 'english_szlb_history'
    },

    // 应用设置
    MAX_HISTORY_ITEMS: 10,
    ENABLE_HISTORY: true
};
