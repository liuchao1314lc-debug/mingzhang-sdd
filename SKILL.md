---
name: mingzhang-sdd
description: 协助用户按 SDD 流程启动或接续项目，澄清并暂存需求，形成、修订或评审 MRD、PRD、架构、模块、组件、UI，逐功能开发、联调测试和迭代。用于需要按阶段协作并核对成果的产品开发任务；按当前请求选择方法，不自动推进全部阶段。
---

# SDD 产品开发协作

项目内运行源 v0.6.0，规则职责与开发前交接候选；具体内容身份由本文件所在固定提交及包内文件 blob 确定，不代替原 v0.4 分发对象或目标项目采用决定。v0.5.0 开发方法第 2 节的历史指定对象为 blob d1501c5a2196ac4c581e1f920dd0a9abc37abe58；核验、内容确认与采用分别判断，文字方法指导宿主，程序只核确定条件、不代用户批准。本文件的核验结论与采用身份只绑其固定提交，见目标项目的既有采用登记与 STATUS 末节；本文件不声明核验是否已执行。

先完整读 [动作与事实边界](rules/core.md)及[共用执行规则](rules/execution.md)，核目标项目当前请求、有效资料／决定、实际工作区、模式和许可，再选当前完整方法及其[阶段结构与沟通](references/stage-methods.md)。涉及需求收集／变更／正式起草时再读[需求记录](rules/requirements.md)，不要求所有任务先加载需求细节。没有同名 MRD 或 STATUS 不代表重建项目；只读评审不改稿，正式 MRD／PRD 起草依需求收全确认。

整理或接续项目资料、形成阶段交接基线、处理版本变更或交付构件时，按[项目资料与版本治理](references/stage-methods.md#project-material-version-governance)核文件职责、唯一权威、上下游固定对象及源码／制品对应关系；沿目标项目已有载体维护，不照搬制作项目目录、登记结构或历史授权。

首次或变化后的对应实质动作前，沿[共用执行规则第1—5节](rules/execution.md)，将上述核对所得按当前任务分别填明阶段定位、项目归属、来源标识和范围确认，并实际发给用户；未知项写明未知及依据缺口，任务模式不替代实际阶段。

| 当前任务 | 完整方法 |
| --- | --- |
| 新建准备／已有项目接续 | [启动准备](skills/startup.md) |
| 明确问题、价值和首版 | [MRD](skills/mrd.md) |
| 展开产品行为与验收 | [PRD](skills/prd.md) |
| 系统链路及技术取舍 | [架构](skills/architecture.md) |
| 职责、状态与协作 | [模块](skills/module.md) |
| 当前单元接口、异常与用例 | [组件](skills/component.md) |
| 用户流程、提示与演示 | [UI](skills/ui.md) |
| 获准功能实现／根因修复 | [开发](skills/development.md) |
| 系统验证、用户验收及获准交付 | [联调测试](skills/integration-testing.md) |
| 从反馈选择变更及接续层 | [迭代](skills/iteration.md) |

按当前方法有依赖的步骤推进，在关键理解／方案／裁决处主动呈现；消息用 [大白话与 SCQR](references/messages.md)。每个目标项目的阶段成果依实际条件逐步形成，不能一口气产出十份文档代替沟通。完成后交真实成果、实际检查和限制，停止在当前许可；指定版通过与下一阶段许可分别核对，已有明确许可沿用。

使用程序前读 [取证、调用与采用](references/checking.md)、[调用与当前能力](scripts/README.md)及[检查合同](references/check-contract.md)，确定性检查调用本包 scripts/check-task.mjs；需要采集时读 [原始采集与解析](references/collection.md)，分别核只读观察和实际文件动作的权限。条件和范围来自当前项目；宿主可执行且获准时实际调用并逐项采用，缺能力按程序说明的唯一状态入口报告，不由文字方法或可读回执推定通过。

需要判断本次改动集合时，在首次相关修改前读 [检查选择](references/checking.md#check-selection)及 [原始采集步骤](references/collection.md#collection-steps)，准备真实前状态；条件版本按 [实际版本取证](references/checking.md#version-evidence)取得。收尾分别采用所需对象、改动和验证项，不以一种检查的满足关闭其他未完成项。

PRD 完整产物交阶段确认前读[独立测试规则第 5 节](rules/independent-testing.md#5-prd-阶段完整产物的独立评价)，按 PRD 方法落实；开发—迭代明确安排独立评价时读该规则，不把作者／开发者自检当独立测试。其余阶段需要独立测试按[第 4 节：其他阶段提议条款](rules/independent-testing.md#其他阶段独立测试提议)先报告并交用户裁决；本入口不提供实际评价方、委派或外部调用许可。

模板按需选用：[需求记录组织提示](assets/templates/requirements-record.md)、[PRD 组织提示](assets/templates/prd.md)，已有载体可沿用；来源与适用取舍见 [来源说明](references/sources.md)。运行不依赖作者项目、机器路径或历史聊天；本文件与来源说明不提供目标项目批准。
