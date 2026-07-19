# 部署指南

## 本地运行

```bash
# 安装依赖
npm install

# 配置环境变量（复制 .env.example 为 .env 并填入你的 API Key）
cp .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173

## 部署到 Netlify

### 方式一：Netlify CLI（推荐）

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 初始化项目
netlify init

# 设置环境变量
netlify env:set DEEPSEEK_API_KEY sk-your-key

# 部署
netlify deploy --build --prod
```

### 方式二：拖拽部署

1. 构建项目：`npm run build`
2. 打开 https://app.netlify.com/drop
3. 把 `dist` 文件夹拖进去
4. 在 Site settings → Environment variables 里添加 `DEEPSEEK_API_KEY`
5. 在 Functions 里添加 `netlify/functions/generate.ts`

## 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel

# 设置环境变量
vercel env add DEEPSEEK_API_KEY

# 重新部署
vercel --prod
```

注意：Vercel 需要把 Netlify Functions 改成 Vercel Functions（放在 `api/` 目录下）。

## 环境变量

| 变量名 | 说明 | 必填 |
|---|---|---|
| DEEPSEEK_API_KEY | DeepSeek API Key | 是 |

获取地址：https://platform.deepseek.com/api_keys
