# 部署指南：到综行业运营工作台

## 1. 本地测试（macOS + Chrome）

1. 下载并解压 `daozong_ops_workbench_pwa.zip`。
2. 打开「终端」，输入 `cd `（末尾留一个空格），把解压出来的 `daozong-pwa` 文件夹拖到终端窗口，按回车。
3. 执行：
   ```bash
   python3 -m http.server 8000
   ```
4. Chrome 打开 `http://localhost:8000`。
5. 语音输入：点「开始语音输入」，允许麦克风权限后说话，再点停止。语音识别依赖 Chrome 和系统麦克风权限；离线时不保证识别可用。
6. API 测试：打开右上角「设置与 API」，填写 DeepSeek API Key，保持 Base URL 为 `https://api.deepseek.com`、模型为 `deepseek-chat`，点「测试 API」。
7. 生成报告：输入一条测试工作内容后点「生成报告」。没有 Key 时会提示是否使用本地规则；网络/API 调用失败也会提示，并可选择本地规则回退。

停止本地服务器：回到终端按 `Control + C`。

## 2. 创建 GitHub 仓库

1. 登录 GitHub，点右上角 `+` → `New repository`。
2. 建议仓库名：`daozong-ops-workbench`。
3. 个人工作台若含有真实工作记录或内部业务信息，仓库建议 **Private**；但请注意，GitHub Pages 发布的网站本身会公开可访问（即使某些付费方案允许私有仓库）。
4. 不要把 API Key、真实客户信息、内部数据导出文件提交到仓库。
5. 可勾选 Add a README，创建仓库。

## 3. 上传代码（两种方式）

### 方法 A：GitHub 网页上传（适合初学者）

1. 解压 ZIP。
2. 进入仓库主页 → `Add file` → `Upload files`。
3. 把 `daozong-pwa` 文件夹里的文件全部拖进上传区域。上传的是文件夹内的内容，不是外层文件夹本身。
4. 确认仓库根目录能看到 `index.html`、`style.css`、`app.js`、`config.js`、`manifest.json`、`service-worker.js` 和图标。
5. 填写提交说明，例如 `Initial PWA version`，点 `Commit changes`。

### 方法 B：Git 命令行

在终端进入解压后的 `daozong-pwa` 目录，依次执行（把 `<你的 GitHub 用户名>` 替换为自己的用户名）：

```bash
git init
git add .
git status
git commit -m "Initial PWA version"
git branch -M main
git remote add origin https://github.com/<你的 GitHub 用户名>/daozong-ops-workbench.git
git push -u origin main
```

`git status` 会显示将提交的文件。提交前确认没有 `.env`、含 Key 的文件、真实业务数据或备份 JSON。

## 4. 开启 GitHub Pages

1. 打开仓库 → `Settings`。
2. 左侧找到 `Pages`。
3. 在 `Build and deployment` 的 `Source` 选择 `Deploy from a branch`。
4. `Branch` 选择 `main`，文件夹选择 `/(root)`，点击 `Save`。
5. 等待部署完成；回到 `Settings → Pages`，点击显示的网站链接。

项目站点地址通常是：

`https://<你的 GitHub 用户名>.github.io/daozong-ops-workbench/`

如果仓库名是 `<用户名>.github.io`，则通常是 `https://<用户名>.github.io/`。

GitHub Pages 发布可能需要数分钟。也可以到 `Actions` 标签页查看构建是否成功。

## 5. 验证 PWA 并添加到主屏幕

1. 用 HTTPS 的 GitHub Pages 地址打开网站。
2. Chrome 桌面端按 `Option + Command + I` 打开开发者工具。
3. 在 `Application` → `Manifest` 查看应用名称、颜色、display 和图标。
4. 在 `Application` → `Service Workers` 查看 Service Worker 是否已注册且状态正常。
5. 断网测试：先在线打开一次，确保文件已缓存；再在 DevTools 的 Network 勾选 Offline 并刷新。页面壳应能打开，但 DeepSeek API、语音识别等在线服务不保证可用。

### Android
用 Chrome 打开 HTTPS 网站 → 菜单 `⋮` → `安装应用` 或 `添加到主屏幕` → 确认。

### iPhone / iPad（iOS）
用 Safari 打开 HTTPS 网站 → 分享按钮 → `添加到主屏幕` → `添加`。iOS 通常需通过 Safari 添加；具体菜单文案随系统版本变化。

## 6. 后续更新

网页上传：再次上传修改后的文件并提交即可。

Git 命令行：
```bash
git add .
git commit -m "Update workbench"
git push
```

多数更新几分钟内生效，GitHub 官方提示发布有时可能需要最多约 10 分钟。若旧版本仍出现：
1. 在 `service-worker.js` 修改 `CACHE_VERSION`，例如 `daozong-workbench-v1` 改为 `daozong-workbench-v2`。
2. 重新提交并等待部署成功。
3. Chrome 开发者工具 → Application → Service Workers → `Unregister`，再到 Storage 清理站点数据，重新加载页面。
4. 手机上关闭已安装应用后重新打开；必要时清除浏览器该站点数据。
5. 只有在完成数据备份后才清除站点数据，因为工作记录和设置存放在 localStorage。

## 7. 图标替换

替换 `icon.svg`、`icon-192.png`、`icon-512.png` 三个文件。建议 PNG 尺寸分别为 192×192 和 512×512，正方形、边缘留白、避免过小文字。然后更新 `manifest.json` 的图标路径（如果文件名变了），再更新 Service Worker 的 `CACHE_VERSION` 并重新部署。

## 8. 安全与常见问题

- **不要提交 Key**：Key 只在网页设置区输入。不要把 Key 写进 `config.js`、`app.js`、HTML、README、截图、Issues 或 Git 提交记录。
- **`.gitignore`**：仓库已附 `.gitignore`，忽略 `.env`、`*.key`、`*.pem`、`config.local.js` 等；它不能阻止你把 Key 手动写进已跟踪的文件。
- **如果 Key 泄露**：立即到 DeepSeek 控制台撤销/删除旧 Key，创建新 Key；检查用量与账单；如果曾提交到 GitHub，即使删掉文件也要视为已泄露，仍需撤销 Key。不要只依赖删除提交或改仓库私有。
- **API 401/403**：检查 Key 是否正确、账户权限/余额、模型是否可用。
- **API 404**：检查 Base URL，不要重复追加 `/chat/completions`；本应用会自动追加该路径。
- **Failed to fetch / CORS**：可能是网络、服务商跨域策略、DNS 或 API 服务不可达。即使不需要 VPN，也不能保证所有网络都可直连。需要稳定公开使用时，将 API 请求放到服务端代理。
- **语音按钮不可用**：Chrome 中检查麦克风权限与系统隐私设置。语音识别支持情况受浏览器/系统影响。
- **页面 404**：确认 `index.html` 在发布目录根部；项目站点路径带仓库名，所有静态资源都使用相对路径 `./...`。
- **离线无法生成 AI 报告**：Service Worker 只缓存应用壳，不缓存 DeepSeek API；离线时可查看页面并使用本地已保存数据，在线 AI 调用仍需网络。

## 9. 单文件 HTML 与 PWA

单文件 HTML 可以包含内联 CSS/JS，但 PWA 仍建议保留独立 `manifest.json` 和 `service-worker.js`。Service Worker 必须从独立 URL 加载，不能只写在 HTML 的内联脚本里。单文件页面可以继续内联样式和业务脚本，再额外放置 manifest、service worker 和图标文件。
