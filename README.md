# 战地6 枪械随机改装生成器 (BF6 Gunsmith Randomizer)

一款本地桌面软件，用于战地6枪械的随机改装方案生成。支持 7 类枪械、11 个改装槽位、100 点点数预算系统。

## 功能特性

- 🎲 **三种生成模式**：完全随机 / 按分类随机 / 指定枪械随机
  - 未选择分类/武器时自动随机兜底，任意模式下点「随机生成」都能出结果
  - 切换模式会保留当前结果与已选分类/武器，可随时切换重新生成
- 🔒 **槽位锁定**：锁定特定改装部位，随机时保持不变
- 🎯 **必填槽位保障**：瞄具 / 弹匣 / 枪管 / 弹药类型 四个槽位永不落空（VSSM 特例为 枪口 / 弹匣 / 瞄具 / 弹药类型）
- 💾 **历史记录**：保存最多 50 条方案，随时回看与加载
- 📋 **一键复制**：将改装方案复制为可读文本格式
- 🔍 **搜索功能**：支持中英文搜索枪械
- ⌨️ **键盘快捷键**：按 `R` 快速随机，`Ctrl+C` 复制方案

## 技术栈

- **前端**：React 19 + TypeScript + Vite 6
- **桌面**：Electron 35
- **状态管理**：React Context + useReducer
- **样式**：CSS Variables（扁平化 + 科技感暗色主题，白色/绿色高亮）

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# 方式1：完整 Electron 桌面应用
npm run dev

# 方式2：仅浏览器（更轻量）
npm run dev:renderer
# 然后打开 http://localhost:5173
```

> **注意**：如果 Electron 启动失败，请检查系统是否设置了 `ELECTRON_RUN_AS_NODE` 环境变量。
> 如果存在，请先执行 `unset ELECTRON_RUN_AS_NODE` (Git Bash) 或 `set ELECTRON_RUN_AS_NODE=` (CMD)。

### 生产构建

```bash
npm run build
```

构建产物在 `dist/renderer/` 目录。

### 打包

```bash
# 打包为解压版目录（无需联网，推荐）
npm run package:dir

# 打包为单文件便携版 .exe（需联网下载 NSIS）
npm run package
```

打包产物输出到 `release/`。Windows 便携版可执行文件为 `release/BF6-Gunsmith-Randomizer-${version}.exe`。

## 项目结构

```
bf6-gunsmith-randomizer/
├── electron-main/              # Electron 主进程
│   ├── main.js                 # 窗口创建与应用生命周期
│   └── preload.js              # 暴露 clipboard API
├── src/
│   ├── types/                  # TypeScript 类型定义
│   │   ├── weapon.ts           # 武器与分类
│   │   ├── attachment.ts       # 配件与槽位
│   │   ├── loadout.ts          # 改装方案
│   │   └── app.ts              # 应用状态
│   ├── data/                   # 数据文件（JSON，易于编辑）
│   │   ├── categories.json     # 7 个枪械分类
│   │   ├── weapons/            # 7 个武器 JSON（按分类）
│   │   └── attachments/        # 11 个配件 JSON（按槽位）
│   ├── engine/                 # 核心算法
│   │   ├── randomizer.ts       # 6 阶段随机生成算法
│   │   ├── budget.ts           # 点数计算
│   │   ├── slotWeights.ts      # 加权随机
│   │   └── formatter.ts        # 文本格式化
│   ├── store/                  # 状态管理
│   │   ├── AppContext.tsx      # Context Provider
│   │   ├── appReducer.ts       # Reducer
│   │   └── actions.ts          # Action 创建函数
│   ├── hooks/                  # React Hooks
│   │   ├── useRandomizer.ts
│   │   ├── useHistory.ts
│   │   └── useClipboard.ts
│   ├── components/             # React 组件
│   │   ├── layout/             # 布局组件
│   │   ├── weapon/             # 武器选择组件
│   │   ├── loadout/            # 方案展示组件
│   │   ├── actions/            # 操作按钮组件
│   │   └── history/            # 历史记录组件
│   └── styles/                 # 样式文件（theme/global/components）
├── _generate_data.py           # Excel → JSON 数据生成脚本
├── _verify_data.py             # Excel/JSON 数据一致性校验
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 改装槽位（11 种）

枪口 · 枪管 · 下握把 · 弹匣 · 弹药类型 · 瞄具 · 瞄准镜附件 · 顶部配件 · 右侧配件 · 左侧配件 · 人体工学

其中 **瞄具 / 弹匣 / 枪管 / 弹药类型** 为必填槽位（生成时永不落空）；VSSM 无枪管，其必填槽位为 **枪口 / 弹匣 / 瞄具 / 弹药类型**。其余槽位可留空。

## 自定义数据

所有枪械与配件数据存放在 `src/data/` 下的 JSON 文件中，可直接编辑：

- **添加武器**：编辑 `src/data/weapons/` 下对应分类的 JSON 文件
- **添加配件**：编辑 `src/data/attachments/` 下对应槽位的 JSON 文件

每个配件的 `cost` 字段表示其点数，修改后随机算法会自动遵守新的点数约束。槽位的 `defaultEmpty` 字段控制该槽位是否允许留空（`true` = 可选，`false` = 必填）。

> 原始数据由外部 Excel 表格经 `_generate_data.py` 生成，`_verify_data.py` 用于比对 Excel 与 JSON 的一致性。Excel 源文件未随仓库提交。

## 随机算法说明

算法采用 6 阶段流程：

1. **固定点数计算**：锁定槽位的点数求和
2. **槽位排序**：优先填充必填槽位
3. **逐槽加权随机**：预算紧张时偏向便宜配件，充裕时增加多样性（必填槽位永不跳过）
4. **预算修复**：总点数不足时尝试升级，超出时降级（必填槽位永不清空）
5. **多样性检查**：避免连续生成相同方案
6. **组装返回**：构建完整 Loadout 对象

## License

MIT
