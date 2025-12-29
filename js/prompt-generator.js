// AI提示词生成器 - 英语版

export class PromptGenerator {
    constructor() {
        this.template = this.getTemplate();
    }

    // 获取提示词模板
    getTemplate() {
        return `请生成一张儿童学英语小报《{{scene}}》，竖版 A4，学习小报版式，适合 5–9 岁孩子学英语与看图识物。

# 一、小报标题区（顶部）

**顶部居中大标题**：《{{title}}》
* **风格**：学英语小报 / 儿童学习报感
* **文本要求**：大字、醒目、卡通手写体、彩色描边
* **装饰**：周围添加与 {{scene}} 相关的贴纸风装饰，颜色鲜艳

# 二、小报主体（中间主画面）

画面中心是一幅 **卡通插画风的「{{scene}}」场景**：
* **整体气氛**：明亮、温暖、积极
* **构图**：物体边界清晰，方便对应文字，不要过于拥挤。

请根据场景自动绘制 15-20 个该场景下最典型的物体，包括：
* 人物角色（如工作人员、顾客、参与者等）
* 常见物品和工具
* 环境元素和设施

**主题人物**
* **角色**：1 位可爱卡通人物（职业/身份：与 {{scene}} 匹配）。
* **动作**：正在进行与场景相关的自然互动。

# 三、学英语标注规则

对画面中的主要物体，贴上英语单词标签：
* **格式**：三行制（第一行英语单词，第二行拼读音标，第三行简体中文）。
* **样式**：彩色小贴纸风格，白底黑字或深色字，清晰可读。
* **排版**：标签靠近对应的物体，不遮挡主体。
* **示例**：apple [ˈæpl] 苹果

# 四、画风参数
* **风格**：儿童绘本风 + 识字小报风
* **色彩**：高饱和、明快、温暖 (High Saturation, Warm Tone)
* **质量**：8k resolution, high detail, vector illustration style, clean lines.`;
    }

    /**
     * 生成完整的AI提示词
     * @param {string} scene - 场景名称
     * @param {string} title - 小报标题
     * @returns {string} 完整的AI提示词
     */
    generate(scene, title) {
        // 替换模板中的占位符
        let prompt = this.template;
        prompt = prompt.replace(/\{\{scene\}\}/g, scene);
        prompt = prompt.replace(/\{\{title\}\}/g, title);

        return prompt;
    }
}
