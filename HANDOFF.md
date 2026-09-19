# 陈悦作品集网站｜源码交接说明

## 工程概览

这是一个无前端框架的静态作品集网站。页面由 Node.js CommonJS 脚本生成，浏览器端使用原生 HTML、CSS 和 JavaScript。

- 推荐环境：Node.js 18+
- 第三方 npm 依赖：无
- 构建入口：`build.cjs`
- 本地预览：`serve.cjs`
- 预览地址：`http://127.0.0.1:4173/`
- 素材体积：约 506 MB

```text
chen-yue-portfolio-source/
├─ index.html / 陈悦作品集.html
├─ build.cjs / serve.cjs / package.cjs
├─ package.json / package-lock.json
├─ data/                 项目内容数据
├─ assets/               全部图片、视频、PDF 素材
├─ work/                 四个已生成项目页面
├─ *.cjs                 页面模板、模块、接口及校验脚本
├─ *.css / *.js          页面样式、交互和动画
└─ local-fonts.json      本地字体引用信息
```

## 安装、构建与预览

项目当前没有第三方 npm 包。迁移后可执行：

```bash
npm install
npm run build
npm run preview
```

对应原生命令为 `node build.cjs` 和 `node serve.cjs`。首次接手无需立即 build，当前生成页面已经保留。注意：build 会覆盖 `index.html`、`陈悦作品集.html` 及 `work/*/index.html`。

## 页面入口与源码

| 页面 | 本地入口 | 主要源码 |
|---|---|---|
| 首页 | `/` | `build.cjs`、`home-cards.cjs`、`opening.css`、`opening.js`、公共 CSS/JS |
| AI Education | `/work/ai-education/` | `ai-page.cjs`、`ai-page.css`、`ai-page.js` |
| MAZOO | `/work/mazoo/` | `mazoo-page.cjs`、`mazoo-page.css`、`mazoo-page.js` |
| Museum | `/work/museum/` | `build.cjs`、`exhibits.*`、`installation.*`、`data/projects.cjs` |
| 瓷厝听潮 | `/work/cichutingchao/` | `build.cjs`、`installation.*`、`data/projects.cjs` |

所有页面完整地址都以 `http://127.0.0.1:4173` 为前缀。已生成页面分别位于 `index.html` 和对应的 `work/<id>/index.html`。

其他源码：
- 公共样式与动画：`autumn.*`、`styles.css`、`warm-theme.css`、`warm-motion.js`、`script.js`
- 展示模块：`folders.*`、`portrait-book.*`、`skills-panel.cjs`
- 字体编辑：`type-editor.*`、`local-fonts.json`
- 本地模型编辑：`gpt-api.cjs`、`gpt-editor.*`
- 校验：`validate-exhibits.cjs`、`test-gpt-api.cjs`
- 历史排查源码：`mazoo-page.broken-0909.*`、`mazoo-page.recovered.js`

## 素材

`assets/` 必须完整保留：JPG 308 个、PNG 127 个、JPEG 52 个、PDF 2 个、MP4 1 个，总计约 506 MB。字体信息位于 `local-fonts.json`，字体栈和引用也分布在 CSS 中。

## 当前已知问题

1. `build.cjs` 会覆盖生成页面；修改前先确认目标属于模板、数据还是生成结果。
2. `serve.cjs` 会加载 `gpt-api.cjs`。没有 `OPENAI_API_KEY` 时静态页面仍可预览，但模型请求功能不可用。
3. `package.cjs` 输出到项目父目录的 `publish-2026/`，并会向父级 `work/` 写校验结果；运行前确认父目录可写。
4. `mazoo-page.js` 当前文件很小，历史完整脚本保存在 `mazoo-page.recovered.js`；不要未经回归测试直接替换入口。
5. 带 `broken`、`recovered`、`validation` 的文件不是当前入口，但作为源码历史已保留。
6. 素材较大，普通 GitHub 上传可能受网络或仓库限制影响；源码交接包本身不依赖 GitHub。
7. 当前没有自动化视觉回归测试，改动后需检查首页和四个项目的桌面端及移动端。

## 必须保留

- 根目录全部 `*.html`、`*.css`、`*.js`、`*.cjs`、`*.json`
- `package.json`、`package-lock.json`、`HANDOFF.md`
- `assets/`、`data/`、`work/`
- `build.cjs`、`serve.cjs`、`package.cjs`
- 历史恢复和验证源码文件

## 可以不打包

- `node_modules/`
- `artifacts/`（截图、录屏、GitHub 上传过程文件）
- `deployment/`（静态部署副本）
- `backups/`（已有压缩备份，可另行留档）
- 外层 `handoff/`、`.git/`
- `*.log`、`Thumbs.db`、`.DS_Store`

## 可整体打包目录

```text
E:\Codex\portfolio\site\handoff\chen-yue-portfolio-source
```

该目录是当前源码、生成页面和全部素材的迁移快照，不含部署副本、备份压缩包、Git 元数据、缓存或日志。
