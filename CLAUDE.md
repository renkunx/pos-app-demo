# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

POS 收银台模拟器 — 模拟实体 POS 终端的移动端优先 React SPA，用于展示收款、退款、订单管理、终端设备状态等收银场景。

## 常用命令

```bash
npm run dev        # 启动 Vite 开发服务器 (localhost:3000)
npm run build      # TypeScript 类型检查 + Vite 构建
npm run lint       # ESLint 检查
npm run preview    # 预览生产构建
```

## 技术栈

| 类别 | 选择 |
|------|------|
| 框架 | React 19 + TypeScript (strict mode) |
| 构建 | Vite 7 (Babel-based React plugin) |
| 样式 | Tailwind CSS 3.4 + shadcn/ui (New York style) |
| 图标 | Lucide React |
| 状态管理 | React Context + `useReducer` (全局单 store) |
| 路由 | React Router 7 (已安装但未使用导航，采用状态驱动的屏幕切换) |
| 表单 | React Hook Form + Zod |
| 动画 | Framer Motion |
| 组件库 | Radix UI (完整套件) + shadcn/ui 组件封装 |
| 图表 | Recharts |
| 路径别名 | `@/` → `src/` |

## 架构

### 全局状态管理 (`src/hooks/useAppState.tsx`)

单一 `AppContext` 通过 `useReducer` 管理所有应用状态。`App.tsx` 在最外层包裹 `<AppProvider>`。

- **`AppState`** 包含：当前屏幕 (`currentScreen`)、金额输入 (`amount`)、支付方式、交易记录列表、终端设备状态、ActionSheet 显隐、Toast 消息等
- **`AppAction`** 是 discriminated union，通过 `dispatch(action)` 修改状态
- 修改状态前**必须先阅读** `src/types/index.ts` 了解 `AppState` 和 `AppAction` 的完整类型定义

### 屏幕导航

不使用 React Router 进行页面切换。`currentScreen` 状态驱动渲染：

```
home → payment_loading → payment_result → home
  └── orders (底部导航)
  └── profile (底部导航)
```

全屏页面（`payment_loading`, `payment_result`）不显示 Header + BottomNav 布局。

### 支付流程

```
HomeScreen: 输入金额 → 选择支付方式 → 点击「收款」
  → START_PAYMENT action → PaymentLoadingScreen (2秒模拟)
  → SET_PAYMENT_STATUS → PaymentResultScreen (成功/失败)
  → 成功后5秒自动 RESET_HOME 或手动返回
```

### 目录结构

```
src/
├── main.tsx              # ReactDOM 入口，包裹 BrowserRouter
├── App.tsx               # 根组件，AppProvider + 屏幕路由 + 布局壳
├── App.css               # 全局样式 (防选中、防滚动 bounce、html/body 固定)
├── index.css             # Tailwind 指令 + shadcn CSS 变量 + --pos-* 主题变量
├── components/
│   ├── ui/               # shadcn/ui 组件 (40+) — 通过 components.json 配置生成
│   └── pos/              # POS 专用组件
│       ├── Header.tsx          # 顶部栏 (商户名 + 签到/设备/网络状态胶囊)
│       ├── BottomNav.tsx       # 底部三 Tab 导航 (首页/订单/我的)
│       ├── AmountDisplay.tsx   # 金额展示 (含 ghost 动画)
│       ├── CustomKeypad.tsx    # 数字键盘 (4x4 网格)
│       ├── ActionSheet.tsx     # 底部弹出抽屉 (订单详情/退款/补打/日期筛选等)
│       └── Toast.tsx           # 全局 Toast 提示
├── pages/
│   ├── Home.tsx               # Vite 模板残留页 (未使用)
│   └── pos/
│       ├── HomeScreen.tsx           # 首页: 快捷金额 + 支付方式选择 + 金额 + 键盘
│       ├── OrdersScreen.tsx         # 订单列表: 搜索 + 筛选 + 统计卡片 + 交易列表
│       ├── ProfileScreen.tsx        # 我的: 终端信息 + 交易准备状态 + 设备状态 + 管理操作
│       ├── PaymentLoadingScreen.tsx  # 支付中 loading (2s 模拟)
│       └── PaymentResultScreen.tsx   # 支付结果 (成功/失败 + 5s 自动返回)
├── hooks/
│   ├── useAppState.tsx    # AppContext + useReducer + AppProvider
│   └── use-mobile.ts      # 移动端断点检测 (768px)
├── types/
│   └── index.ts           # 所有 TS 类型定义
└── lib/
    └── utils.ts           # cn() — clsx + tailwind-merge 合并 className
```

### CSS 主题变量

`src/index.css` 定义了两套变量：
- **shadcn/ui 标准变量** (`--background`, `--primary` 等) — 用于 `components/ui/`
- **POS 专用变量** (`--pos-bg-primary`, `--pos-accent-primary`, `--pos-text-primary` 等) — 用于 `components/pos/` 和 `pages/pos/`

POS 组件使用 `bg-[var(--pos-bg-primary)]` 这类任意值语法，而非 Tailwind 的语义类名。

### 金额输入逻辑

`APPEND_DIGIT` action 处理以下规则：
- 初始 `"0"` 时输入数字会替换
- 小数点只能输入一次
- 最多 2 位小数
- 最多 8 位整数
- 最大金额限制在 `CustomKeypad.tsx` 的 `canPay` 中检查 `> 0`

### ActionSheet 模式

`ActionSheet.tsx` 是底部弹出抽屉的通用容器，通过 `actionSheetType` 切换内容：
- `order_options` — 订单详情 + 退款/补打按钮
- `refund_confirm` — 退款确认面板
- `reprint_options` — 补打小票方式选择
- `date_filter` — 日期范围选择
- `payment_methods` — 支付方式选择
- `manage_confirm` — 管理员操作确认

添加新的 ActionSheet 类型：在 `ActionSheet.tsx` 的 `renderContent()` switch 中添加 case，创建对应的子组件。

## 编码规范

- 优先使用现有的 shadcn/ui 组件 (`@/components/ui/*`)，不要自己重新实现
- POS 专用 UI 使用 `--pos-*` CSS 变量保持视觉一致性
- 状态变更必须通过 dispatch action，不要在组件内直接修改 state
- 新组件放在 `src/components/pos/`，新页面放在 `src/pages/pos/`
- 使用 `@/` 路径别名导入，不要用相对路径跨多级目录
- 项目禁用文本选择 (`user-select: none`)，输入框除外
- 所有组件使用 React 函数组件 + Hooks，不使用 class 组件
- 遵循已配置的 ESLint 规则 (`eslint.config.js`)
