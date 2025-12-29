# 儿童学英语单词小报生成器

基于 AI 的儿童英语单词学习小报生成工具。

## 功能特点

- 预设 8 种常见场景
- 支持自定义场景
- 自动生成英语单词标签（英语 + 音标 + 中文）
- 只需一次 API 调用，快速生成

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

然后在浏览器打开 http://localhost:5173/

## 部署到 GitHub Pages

### 第一次部署

1. **创建 GitHub 仓库**
   - 仓库名：`shi-zi-xiao-bao-english`
   - 创建后复制仓库地址

2. **初始化 Git 并推送**
   ```bash
   cd "D:\vs code\shi zi xiao bao(english)"
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/你的用户名/shi-zi-xiao-bao-english.git
   git push -u origin main
   ```

3. **部署到 GitHub Pages**
   ```bash
   npm run deploy
   ```

4. **启用 GitHub Pages**
   - 打开仓库 Settings → Pages
   - Source 选择 `gh-pages` 分支
   - 保存后访问 `https://你的用户名.github.io/shi-zi-xiao-bao-english/`

### 后续更新部署

修改代码后，只需运行：
```bash
npm run deploy
```

## 技术栈

- HTML + CSS + JavaScript
- Vite（开发服务器）
- Nano Banana Pro API（图像生成）

## API Key

使用前需要配置 Nano Banana Pro API Key：
1. 访问 https://kie.ai/api-key 获取
2. 在页面中输入并保存
