# AI 在金融风控领域的应用研究报告

这是一个面向金融风控/产品从业者的中文研究报告单页应用。页面用产品视角解释 AI、机器学习、大语言模型、Agent、特征工程与 MLOps 在金融风控中的应用边界，帮助读者在方案评审和项目立项时判断技术方案是否合理。

## 技术栈

- React 19
- Vite 8
- Chart.js
- Tailwind CSS CDN
- JavaScript + JSX

项目当前是纯前端静态页面，无后端、无数据库、无 API 层。

## 目录结构

```text
.
├── CLAUDE.md          # AI 协作与内容维护约定
├── index.html         # HTML 入口与 Tailwind CDN 配置
├── src/
│   ├── App.jsx        # 报告内容、渲染器、图表配置与页面布局
│   ├── App.css        # 图表容器样式
│   ├── index.css      # 全局基础样式
│   └── main.jsx       # React 入口
└── package.json       # 脚本与依赖
```

## 本地开发

```bash
npm install
npm run dev
```

Vite 开发服务默认通常运行在 `http://localhost:5173`。

## 常用命令

```bash
npm run dev      # 启动开发服务
npm run build    # 构建静态产物到 dist/
npm run preview  # 预览生产构建
npm run lint     # 运行 ESLint
```

如需用 Python 手动托管构建产物：

```bash
npm run build
cd dist
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

## 内容维护

报告主体集中在 `src/App.jsx`：

- `chapters`：章节、小节与正文内容。
- `chartConfigs`：Chart.js 图表配置。
- `ContentBlock`：不同内容块类型的渲染逻辑。
- `App`：页面导航、滚动追踪和整体布局。

更详细的内容原则、字段约定、图表 ID 规则和 AI 协作注意事项见 `CLAUDE.md`。

## 部署说明

构建后将 `dist/` 目录作为静态资源托管即可。需要注意：当前 Tailwind 通过 CDN 加载，如果部署到内网、离线环境或严格 CSP 环境，建议改成本地 Tailwind 构建方案。
