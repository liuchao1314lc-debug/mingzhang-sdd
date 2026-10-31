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
  <img alt="v0.7.0 技能源" src="https://img.shields.io/badge/source-v0.7.0-2563eb?style=flat-square">
  <img alt="十阶段方法" src="https://img.shields.io/badge/workflow-10_stages-0f766e?style=flat-square">
  <img alt="29 份文字资源" src="https://img.shields.io/badge/resources-29_text_files-334155?style=flat-square">
</p>

<p align="center">
  <a href="#quick-start">快速开始</a> ·
  <a href="#zcode-plugin">ZCode 插件安装</a> ·
  <a href="#dsh-plugin">DSH 插件安装</a> ·
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
| **按开发包组织实施** | 划分开发包、依赖路线及可并行条件；宿主不支持并行时按路线串行交错，不冒充并行。 |
| **资料与版本需要接续** | 明确文件职责、信息权威、历史取代、跨阶段基线及源码与制品身份。 |
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

<a id="zcode-plugin"></a>
## ZCode 插件安装

在 ZCode 打开工作区，进入 **设置 → 插件 → 创建 → 添加市场**，填写：

```text
https://github.com/liuchao1314lc-debug/mingzhang-sdd.git
```

添加后，在个人市场 **mingzhang-sdd-marketplace** 中安装并启用 **mingzhang-sdd（v0.7.0）**。打开 **设置 → Skills → 插件技能** 核对来源，在聊天中输入 `$mingzhang-sdd`，或从 `/` 的 Skills 分组选择。

若之前提示 `Marketplace manifest not found`，刷新市场来源或移除失败条目后重新添加上述地址。用户级同名技能可能与插件技能并存，使用时核对来源。此入口使用 ZCode 的 marketplace/plugin 格式；DSH 的 TGZ 安装入口见下一节。

<a id="dsh-plugin"></a>
## DSH 插件安装

[下载 v0.7.0 插件包](https://github.com/liuchao1314lc-debug/mingzhang-sdd/raw/refs/heads/main/dist/mingzhang-sdd-dsh-0.7.0.tgz)，在 DSH **插件 → 添加** 中填写下载文件在 DSH 运行机器上的真实绝对路径。按提示重启对应 profile 后，用 `/mingzhang-sdd` 调用。

组合包名为 `mingzhang-sdd-dsh`，内含技能仍叫 `mingzhang-sdd`。已安装旧版时，先移除同一 profile 中的旧组合包再添加新版；手工安装的同名技能需单独核对来源。main 是技能源和 ZCode 市场入口，DSH 使用上述 TGZ。

[详细安装说明](README.dsh.md) · [版本与验证记录](VERIFICATION.md)。[旧 v0.4.0 TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz) 保留供回退。

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
├── rules/               共用行为、执行、需求与独立评价规则
├── references/          阶段组织、项目治理、检查与来源说明
├── assets/
│   ├── templates/       需求记录、MRD、PRD 与交接组织提示
│   └── readme/          本页展示素材
├── marketplace.json     ZCode 市场入口
├── plugins/             ZCode 插件与技能副本
└── dist/                DSH 安装包（含保留旧版）
```

| 需要了解 | 阅读入口 |
| :--- | :--- |
| 技能怎样选择方法与控制范围 | [技能入口](SKILL.md) · [动作与事实边界](rules/core.md) |
| 需求怎样记录、确认和变更 | [需求记录规则](rules/requirements.md) |
| 工具供给、真实返回与检查 | [工具使用与检查](references/checking.md) |
| 阶段接续与日常／正式交接 | [阶段方法](references/stage-methods.md) |
| 需求与成果关系怎样贯通 | [需求贯通方法](references/traceability.md) |
| 项目文件、信息与版本怎样治理 | [项目治理](references/project-governance.md) |
| 独立评价何时接续、怎样组织 | [独立测试规则](rules/independent-testing.md) |
| 文档怎样组织 | [需求记录](assets/templates/requirements-record.md) · [MRD](assets/templates/mrd.md) · [PRD](assets/templates/prd.md) · [交接](assets/templates/handoff.md) |
| 方法从哪里来、采用了什么 | [来源说明](references/sources.md) |

### 运行方式

当前 v0.7.0 包含 **29 份文字方法、规则、参考和模板**，通过宿主 Agent 的现有文件、工具与权限能力工作；技能源不附带本地采集／检查脚本，也不要求 Node.js。DSH 插件适配层运行在 DSH 自身环境中。旧版程序与安装包仍可从历史提交／旧 TGZ 恢复。

<a id="validation"></a>
## 版本与验证

当前技能源为 **v0.7.0，29 份／1,564 行**，逐字节取自制作仓库固定对象 `c36a9f90405b496a97ab450ad76588cbba07aaca:skills/mingzhang-sdd/`。根技能、ZCode 技能副本与 DSH 包使用同一来源；制作仓库提交号不是本公开仓库的提交号，采用时应固定实际公开提交。

本版包含契约与交接修正、按影响条件化的检查、入口去重，以及治理／示例／历史的按任务读取。F05 最新内部协作定向复核为 **3/3、18/18**，只关闭该固定对象的 F05 整改项；旧正式独立评价 **`verification_fail` 保持**。无对照组，不能据此宣称整产品通过或成本／质量改善。

| 对象 | 取得方式与检查范围 |
| :--- | :--- |
| 技能源 | [SKILL.md](SKILL.md) 及完整资源，29 份；与固定来源逐字节核对 |
| ZCode 插件 | 根 [marketplace.json](marketplace.json) → `plugins/mingzhang-sdd`，v0.7.0；清单、路径与副本静态核对，未作为实际界面安装验证 |
| DSH 插件 | [v0.7.0 TGZ](dist/mingzhang-sdd-dsh-0.7.0.tgz)；DSH `0.2.1-rc.5` 临时 profile 的原生安装、加载、资源读取、启停和移除检查通过，未覆盖网页按钮或模型效果 |
| 历史版本 | [原 v0.4.0 TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz) 与 Git 历史保留，旧成绩仍绑定原对象 |
| 已有本机安装 | GitHub 更新后仍需在宿主中更新并核对实际来源 |

固定对象及检查详情见[版本与验证记录](VERIFICATION.md)。

<details>
<summary><strong>历史 v0.4 验证范围与保留限制</strong></summary>

旧 v0.4 的28份运行文件取自制作仓库冻结提交 `9ba51578cc3e56a80f95a49332ba52588ae64bdb`。原 DSH TGZ 保留83,615字节的既有对象；这条冻结一致性不再用于描述新版 main 正文。旧版完整公开树仍可在[固定提交](https://github.com/liuchao1314lc-debug/mingzhang-sdd/tree/d85ebcb73b3f79fd25d0201c210266e602598395)读取。

制作项目用户曾确认开发阶段和联调测试阶段通过；历史 `verification_pass` 证据限一个连续模拟案例，不自动扩展到本次新正文。保留三项限制原文：

- runs_per_configuration=1 且无对照不代稳定性
- D-03 中途失败/回滚/断电未验证
- CLI 默认权限分支与非字符串 text/无效 API 路径分支本轮未执行

其中 D-03 指模拟便签案例的直接覆盖方案。真实用户便利效果、制作项目 MRD 第6.2节量化达标、整包、跨工具和稳定性仍未验证。历史程序局部实测环境为 macOS／Node v24.15.0。

</details>

## 来源与许可

方法来源、采用取舍及适用范围见 [来源说明](references/sources.md)。本仓库尚未指定统一开源许可证，保留原有来源与许可状态说明。

---

<p align="center"><strong>从当前任务出发，让每一步都有依据、有成果、有检查。</strong><br>
<a href="SKILL.md">阅读技能入口 →</a></p>
