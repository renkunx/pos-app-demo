# POS 收银台Demo

移动端优先的 React 单页应用，模拟实体 POS 终端的收款、退款、订单管理与终端运维场景。适合用于产品演示、UI 原型验证或前端技术栈参考。

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)

## 在线预览

> 部署到 GitHub Pages 后，将预览地址补充在此处。

## 功能特性

### 收银收款

- 数字键盘输入金额，支持快捷金额、小数与退格
- 三种支付方式：刷卡 / 扫码 / 自动识别
- 模拟支付流程：收款 → 处理中（2s）→ 成功 / 失败结果页
- 首页展示今日收款笔数与金额统计

### 订单管理

- 交易列表：收款、退款、失败状态一目了然
- 搜索订单号、参考号
- 日期筛选：今天 / 昨天 / 近 7 天 / 近 30 天 / 自定义范围
- 筛选激活时按钮高亮并显示当前条件
- 统计卡片：总笔数、总金额、退款笔数、失败笔数
- 订单详情、退款确认、补打小票（ActionSheet 抽屉）

### 退款与权限

- 管理员可直接发起退款；操作员需先验证退货密码
- 支持按订单号查询退款
- 管理员可设置退货密码

### 终端与运维（我的）

- 商户 / 终端信息、签到与密钥状态
- 外设状态：打印机、读卡器、PINPad、扫码器、网络
- 角色分级管理操作：
  - **系统管理员**：日志上报、参数下载、重新签到、商户设置
  - **管理员**：参数下载、重新签到、商户设置、新增用户、退货密码
  - **操作员**：仅收银与订单相关功能

### 其他

- 三种角色登录，按权限控制页面与 Tab 可见性
- 登录状态与交易数据本地持久化（localStorage）
- 页面刷新后自动恢复正确的 Tab 与底部导航
- 桌面端以手机壳样式居中展示，移动端全屏适配

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript（strict） |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS 3.4 + shadcn/ui（New York） |
| 状态管理 | Zustand（含 persist 中间件） |
| 图标 | Lucide React |
| 动画 | Framer Motion |
| 组件基础 | Radix UI |
| 路径别名 | `@/` → `src/` |

> 项目采用状态驱动的屏幕切换（`currentScreen`），未使用 React Router 做页面导航。

## 快速开始

### 环境要求

- Node.js 18+
- npm / pnpm / yarn

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/<your-username>/pos-app-demo.git
cd pos-app-demo

# 安装依赖
npm install

# 启动开发服务器 → http://localhost:3000
npm run dev

# 生产构建
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

## 演示账号

所有账号默认密码均为 `123456`。

| 用户名 | 角色 | 权限说明 |
|--------|------|----------|
| `super` | 系统管理员 | 仅「我的」页，专注终端运维 |
| `admin` | 管理员 | 首页 + 订单 + 我的，完整收银与管理 |
| `zhangsan` | 操作员 | 首页 + 订单 + 我的，退款需退货密码 |

默认退货密码：`000000`（管理员可在「我的 → 退货密码」中修改）

## 项目结构

```
src/
├── App.tsx                    # 根布局、屏幕路由、权限控制
├── main.tsx                   # 应用入口
├── components/
│   ├── ui/                    # shadcn/ui 通用组件
│   └── pos/                   # POS 业务组件
│       ├── Header.tsx         # 顶栏（商户名、签到/设备/网络状态）
│       ├── BottomNav.tsx      # 底部 Tab 导航
│       ├── AmountDisplay.tsx  # 金额展示
│       ├── CustomKeypad.tsx   # 数字键盘
│       ├── ActionSheet.tsx    # 底部抽屉（订单/退款/筛选等）
│       └── Toast.tsx          # 全局提示
├── pages/
│   ├── LoginScreen.tsx        # 登录页
│   └── pos/
│       ├── HomeScreen.tsx     # 收银首页
│       ├── OrdersScreen.tsx   # 订单列表
│       ├── ProfileScreen.tsx  # 我的 / 终端管理
│       ├── PaymentLoadingScreen.tsx
│       └── PaymentResultScreen.tsx
├── stores/
│   ├── authStore.ts           # 登录、角色、退货密码
│   ├── posStore.ts            # 金额、交易、终端、快捷金额
│   └── uiStore.ts             # 屏幕导航、ActionSheet、筛选状态
├── lib/
│   ├── orderFilter.ts         # 订单日期筛选逻辑
│   └── utils.ts               # 工具函数
└── types/
    └── index.ts               # TypeScript 类型定义
```

## 屏幕流转

```
登录
  ↓
home ──收款──→ payment_loading ──→ payment_result ──→ home
  ├── orders（底部 Tab）
  └── profile（底部 Tab）
```

支付处理中与结果页为全屏模式，隐藏底部 Tab 栏。

## 状态管理

| Store | 职责 | 持久化 |
|-------|------|--------|
| `authStore` | 登录态、用户信息、退货密码 | ✅ localStorage |
| `posStore` | 交易记录、终端信息、快捷金额 | ✅ localStorage |
| `uiStore` | 当前屏幕、Tab、筛选、弹层 | ❌ 刷新后按角色恢复默认页 |

## 部署

项目 `base` 已配置为 `./`，可直接部署到 GitHub Pages 等静态托管：

```bash
npm run build
# 将 dist/ 目录内容上传至静态服务器
```

GitHub Pages 示例（`gh-pages` 分支或 Actions）：

```yaml
# .github/workflows/deploy.yml 示例
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

## 说明

- 本项目为**前端模拟器**，所有支付、退款、设备状态均为本地 Mock，不连接真实支付网关。
- 交易数据保存在浏览器 localStorage，清除站点数据会重置记录。

## License

本项目采用 **[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh)**（署名 - 非商业性使用 - 相同方式共享 4.0 国际）协议。

| 你可以 | 你不可以 |
|--------|----------|
| 自由学习、研究、修改代码 | 将本项目用于任何商业目的（含收费产品、SaaS、内部商用系统等） |
| 分享给他人，需保留原作者署名 | 闭源后商用，或更换为允许商用的协议后再商用 |
| 基于本项目二次开发，衍生作品须以相同协议开源 | |

> 这不是 OSI 认定的「宽松开源」协议（如 MIT），而是带**非商业限制**的共享协议，更符合「供交流学习、禁止商用」的诉求。完整条款见 [LICENSE](./LICENSE)。

如需允许他人商用，可改用 [MIT](https://opensource.org/licenses/MIT) 或 [Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)；若希望更严格地限定「仅非商业软件使用」，可考虑 [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/)。
