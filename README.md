<p align="center">
  <a href="README.md"><img alt="简体中文（当前）" src="https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-2563eb?style=for-the-badge"></a>
  <a href="README.en.md"><img alt="English" src="https://img.shields.io/badge/English-475569?style=for-the-badge"></a>
</p>

<p align="center">
  <img src="assets/readme/banner.svg" alt="mingzhang-sdd — From intent to verified delivery" width="100%">
</p>

<h1 align="center">mingzhang-sdd</h1>

<p align="center"><strong>把想法说清楚，把规格接起来，把结果验明白。</strong></p>
<p align="center">面向 AI 编程协作的 SDD 技能 · 从需求澄清到开发、联调与迭代</p>

<p align="center">
  <img alt="版本 v0.4" src="https://img.shields.io/badge/version-v0.4-2563eb?style=flat-square">
  <img alt="十阶段方法" src="https://img.shields.io/badge/workflow-10_stages-0f766e?style=flat-square">
  <img alt="本地程序 Node.js 24.x" src="https://img.shields.io/badge/local_tools-Node.js_24.x-334155?style=flat-square">
</p>

<p align="center">
  <a href="#quick-start">快速开始</a> ·
  <a href="#workflow">十阶段流程</a> ·
  <a href="#inside">资源导航</a> ·
  <a href="#validation">版本与验证</a>
</p>

---

当你把产品开发交给 AI，真正需要接续的是：**为什么做、具体做什么、怎样实现，以及如何确认做对了。**

mingzhang-sdd 将这些工作组织为可按需读取的阶段方法，帮助 Agent 围绕当前目标协作：澄清需求、承接已有决定、形成成果、检查结果，再由用户确认关键取舍。新项目可以从准备开始，已有项目可以从当前节点接续。

## 它能帮你做什么

| 你正在处理的事 | 技能提供的协作方式 |
| :--- | :--- |
| **想法还没讲清楚** | 澄清问题、目标、价值与范围；确认的需求及时暂存，再形成 MRD／PRD。 |
| **规格需要落到设计** | 连接架构、模块、组件与交互，说明职责、接口、异常和验收关系。 |
| **已有项目继续推进** | 先核对有效成果、当前状态与本次允许范围，选择对应阶段方法。 |
| **实现需要检查和验收** | 按获准功能开发，记录实际验证；将程序结果、用户验收和发布决定分别说明。 |
| **反馈需要变成下一步** | 分析来源与影响，提出取舍建议，按确认后的范围回到相应阶段。 |

每个阶段都回答三个问题：**是什么 · 做什么 · 怎么做**。按当前任务选择方法，关键决定由用户确认。

<a id="quick-start"></a>
## 快速开始

### 1. 获取技能

```bash
git clone https://github.com/liuchao1314lc-debug/mingzhang-sdd.git
```

也可以通过仓库的 **Code → Download ZIP** 下载。保留完整目录结构，入口是 [SKILL.md](SKILL.md)。

### 2. 在目标项目中使用

将下面的路径换成真实**绝对路径**，发送给能读取本地文件的 Agent：

```text
请读取并使用 <技能仓库绝对路径>/SKILL.md。
目标项目：<目标项目绝对路径>。
当前任务：先只读核对项目现状、有效成果和当前阶段，
说明缺口及下一步建议。
允许范围：只读，不修改文件、不安装、不运行测试、不调用外部服务。
```

技能目录保存方法，目标项目目录保存你的产品成果。已有项目从实际阶段接续，后续动作沿用目标项目的有效授权。

若使用宿主的原生技能发现，将完整目录放到该宿主支持的技能位置，并核对实际发现与加载情况。**本页的显式读取方式可用于先核对入口；不同宿主的安装与行为支持须分别确认。**

<details>
<summary><strong>示例：已经有 PRD，想检查设计承接</strong></summary>

```text
请使用 mingzhang-sdd，读取已确认的 PRD 和现有架构文档。
本次只读评审：核对主流程、关键异常与验收要求是否被设计承接。
请列出具体缺口、依据和影响，不修改文档，不开始开发。
```

</details>

<details>
<summary><strong>示例：已经明确功能，准备实施</strong></summary>

```text
请使用 mingzhang-sdd，接续当前已批准的功能任务。
先核对有效规格、现有实现和允许修改的范围，说明实施步骤与验证方式。
在当前授权范围内完成实现、必要验证及结果说明；
遇到新增范围或关键取舍时交由我决定。
```

示例需结合目标项目的实际任务与权限使用；示例本身不授予文件写入或外部操作许可。

</details>

<a id="workflow"></a>
## 十阶段流程

**准备与需求 → 设计与拆解 → 实现与验证 → 反馈与迭代**

| 阶段 | 核心问题 | 方法入口 |
| :--- | :--- | :--- |
| 01 · 启动准备 | 现在在哪里，本次要做什么？ | [启动／接续](skills/startup.md) |
| 02 · MRD | 为什么做，解决谁的什么问题？ | [市场与需求](skills/mrd.md) |
| 03 · PRD | 产品怎样工作，怎样算满足要求？ | [产品规格](skills/prd.md) |
| 04 · 架构 | 系统如何组织，关键取舍是什么？ | [系统架构](skills/architecture.md) |
| 05 · 模块 | 各部分负责什么，怎样协作？ | [模块设计](skills/module.md) |
| 06 · 组件 | 当前单元的接口、状态和异常是什么？ | [组件设计](skills/component.md) |
| 07 · UI | 用户怎样操作，系统怎样反馈？ | [交互设计](skills/ui.md) |
| 08 · 开发 | 如何按获准规格实现并局部验证？ | [逐功能开发](skills/development.md) |
| 09 · 联调测试 | 系统链路与用户验收有哪些实际证据？ | [联调与交付](skills/integration-testing.md) |
| 10 · 迭代 | 反馈意味着什么，下一步改哪里？ | [反馈与迭代](skills/iteration.md) |

具体步骤依赖当前任务、有效输入和用户决定，不要求每个项目从头重走十个阶段。

<a id="inside"></a>
## 资源导航

```text
mingzhang-sdd/
├── SKILL.md             技能入口与方法选择
├── skills/              十阶段完整方法
├── rules/               共用行为、执行与需求规则
├── references/          检查合同、采集与来源说明
├── scripts/             本地检查与采集程序
└── assets/
    ├── templates/       需求记录与 PRD 组织提示
    └── readme/          本页展示素材
```

| 需要了解 | 阅读入口 |
| :--- | :--- |
| 技能怎样选择方法与控制范围 | [技能入口](SKILL.md) · [动作与事实边界](rules/core.md) |
| 需求怎样记录、确认和变更 | [需求记录规则](rules/requirements.md) |
| 本地程序怎样调用 | [程序说明](scripts/README.md) · [检查合同](references/check-contract.md) |
| 文件动作与证据怎样采集 | [采集说明](references/collection.md) |
| 方法从哪里来、采用了什么 | [来源说明](references/sources.md) |

### 本地辅助程序

文字指导需要宿主 Agent 能读取技能与项目材料。本地程序使用 **Node.js 24.x 标准库，无第三方 npm 依赖**；采集器另需 Git。

```bash
node /你的路径/mingzhang-sdd/scripts/check-task.mjs --help
```

`check-task.mjs` 检查对象、改动集合及证据中的确定性条件。`collect-task.mjs` 提供观察与固定文件动作采集，其中 `action` **会实际写入文件**，使用前须核对目标项目的写入许可。详细协议、支持格式与限制见程序说明。

本技能通过文字指导 Agent，不能替代宿主的权限控制；程序检查结果也须结合实际业务要求判断。

<a id="validation"></a>
## 版本与验证

当前公开快照为 **v0.4**。制作项目用户已确认开发阶段和联调测试阶段通过；现有 **`verification_pass` 证据限一个连续模拟案例**，不代表整包、跨工具、长期稳定性或真实用户收益已经验证。

<details>
<summary><strong>查看冻结身份、环境与保留限制</strong></summary>

28 份运行文件逐字节取自制作仓库冻结提交：

```text
9ba51578cc3e56a80f95a49332ba52588ae64bdb
```

该提交号是制作仓库的来源身份，不是本分发仓库的提交号。本次公开整理新增 README 和横幅，运行正文保持冻结原样。正文中的“未发布”等状态保留打包时的历史身份；本页说明当前公开快照。

保留的三项限制：

- runs_per_configuration=1 且无对照不代稳定性
- D-03 中途失败/回滚/断电未验证
- CLI 默认权限分支与非字符串 text/无效 API 路径分支本轮未执行

其中 D-03 指模拟便签案例的直接覆盖方案。真实用户便利效果、制作项目 MRD 第 6.2 节量化达标仍未验证。已记录的程序局部实测环境为 macOS／Node v24.15.0，其他宿主与平台须分别核对。

</details>

## 来源与许可

方法来源、采用取舍及适用范围见 [来源说明](references/sources.md)。本仓库尚未指定统一开源许可证，保留原有来源与许可状态说明。

---

<p align="center"><strong>从当前任务出发，让每一步都有依据、有成果、有检查。</strong><br>
<a href="SKILL.md">阅读技能入口 →</a></p>
