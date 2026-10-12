# 到综行业运营工作台（PWA）

## 文件
- `index.html`：页面结构与 PWA 注册入口
- `style.css`：样式
- `app.js`：交互、历史记录、待办、指标、报告和 DeepSeek API
- `config.js`：行业、链路、默认基线、Prompt（公开文件，严禁写 API Key）
- `manifest.json`：PWA 配置
- `service-worker.js`：应用壳缓存与离线回退
- `icon.svg` / `icon-192.png` / `icon-512.png`：占位图标

## 本地运行（macOS）
在此目录打开终端，运行 `python3 -m http.server 8000`，浏览器访问 `http://localhost:8000`。
不要双击 `index.html` 用 `file://` 测试 PWA。

## 安全
API Key 只在工作台设置界面输入并存入浏览器 localStorage。不要写进 `config.js`、HTML、GitHub 仓库或截图。
GitHub Pages 是静态托管，浏览器直接请求 DeepSeek 不会隐藏 Key；公开分享时建议接服务端代理。

## 修改配置
编辑 `config.js` 中 `DEFAULT_INDUSTRIES`、`CHAINS`、`DEFAULT_BASELINES` 和 `DEFAULT_PROMPT`。
如果设备仍加载旧版，请将 `service-worker.js` 中 `CACHE_VERSION` 从 `v1` 改为 `v2` 后重新部署。

## GitHub Pages 部署
1. 将此目录中的所有文件上传到仓库根目录（不要只上传 ZIP）。
2. 仓库 Settings → Pages → Build and deployment → Source 选择 Deploy from a branch。
3. Branch 选择 `main`，目录选择 `/(root)`，保存。
4. 等待 Actions 完成，在 Pages 设置页打开站点链接。
5. PWA 和 Service Worker 必须使用 HTTPS 或 localhost；GitHub Pages 默认提供 HTTPS。

详细步骤见 `DEPLOYMENT.md`。
