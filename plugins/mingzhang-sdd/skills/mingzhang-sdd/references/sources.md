# 来源、适用取舍与开发身份

内容身份及适用范围统一见[技能入口](../SKILL.md)，评价结果绑定其实际固定对象；目标项目采用与当前状态沿该项目已有权威记录，检查结果沿对应证据。本说明维护来源和取舍，不复述提交、核验、安装或发布的当前状态；形成、文档核对、真实采用、用户接受和发布分别判断。

## 采用依据

基础是经核对的 sdd-project-guide 2026-10-10 十阶段方法及本产品有效行为／设计；方法重新组织为独立资源，保留阶段差异和真实成果判据，不复制作者历史决定、固定业务或机器路径。产品的工具约束与目标项目治理分开，运行不要求访问开发仓库。

execution 第 1—7 节依据已确认的主动呈现产品行为，由制作期原 execution v0.3 第 5 节转化，原第 1—4 节未选入。第 8—10 节、requirements 和阶段细化来自之后独立确认的根因、检查、需求记录、方法及返修补充。来源记录不提供目标项目授权，运行只需包内正文；消息组织是已确认大白话／SCQR 设计的运行转化，包内完整操作唯一在 messages。

execution 第 11 节来自用户提出并确认的“先理清任务再规划执行、依据证据形成结论”及“上下文压缩不得削减生效工具约束”两项要求，用户随后明确要求纳入技能包。2026-10-24 用户转交的最终评审同意按收敛方案先行修订：任务理解保留总则并引用第 2／4／9 节，避免另建操作清单；上下文保全覆盖本包生效规则与目标项目已采用的工具约束，权威定位沿 core，明确“上下文中缺失或未被完整保留”后的完整重读及读取受阻处理。本节来源说明不改变目标项目既有采用对象，也不宣称技能文字能控制宿主自动压缩机制或保全效果已经验证。

制作项目的检查／根因正文与包内 execution §9／§8 属同步来源和交付副本；来源改变时制作维护者须逐段核对两边，其他行为转化按有效规格及采用关系逐项核对。终端使用者只执行本包版本，不需读取制作项目文件。设计层要求与包内操作不是两个并列的产品权威，不能用实现反改已批准行为。

独立测试正文来自使用者提供的另一项目评价规则及吸收要求：保留固定要求、独立设计、首次覆盖、因果重测、命令／证据保全和权限分离，改用目标项目现有任务／证据载体。用户随后明确在 PRD 阶段仅对完整产物增设，第 5 节适配为固定需求到规格的文档语义评价，人工操作在正式首项评价前保全；不改成技能行为试验、模型调用或七阶段常设测试。评价结论不混入程序协议，普通自检不套独立评价的保全流程；其余阶段须按[第 4 节：其他阶段提议条款](../rules/independent-testing.md#其他阶段独立测试提议)先报告由用户裁决，不自动扩大适用面。

首次完整覆盖和原件保全来自用户决定；无已确认来源／超范围的内容冒充有效要求时失败，来自本项目已确认范围约束及评审细化。[独立规则第 3 节](../rules/independent-testing.md#3-执行事实结果与评价有效性)错误评价依据导致误判的撤销条款，是固定依据／评价有效性边界经用户“五条提示”采纳请求形成的执行细化，保留原记录和其他有效失败，不以撤销误判推定产品通过。上述具体判据不宣称是外部标准的统一条款，也不为 Agent 评价套组织独立性档位。

## 分析优点后按条件吸收

以下为制作时已查阅的来源与取舍，不是运行必读资料或全部标准采用声明。先确定它解决什么缺口，分析条件，再转成当前方法并检查；外部优秀实践不替目标项目需求／许可。没有适用关联就不吸收。

| 来源 | 提炼优点及适用条件 | 本包吸收位置／核对方式 | 不移入的内容 |
| --- | --- | --- | --- |
| 本地项目治理模板：00治理原则、01入口、02长期红线、03状态、04地图、05项目说明、06主线推进、07兼容分类、08专题及09使用指南 | 文件分层与更新触发、唯一权威、历史隔离、版本基线／制品身份和兼容责任；适用于实际资料交接、版本变更及获准交付 | 2026-10-24 用户确认合并方案并要求实施第二批；stage-methods 的“项目资料与版本治理”为共用方法，core维护身份／冲突与许可边界，SKILL单一入口，startup／iteration接续；按实际文件、基线、受测及交付对象对账 | 不搬模板按文件名裁决的刚性排名、固定六根文件、唯一物理候选包、每轮clean commit／自建检查器、固定发布口令／刷包流程、安装器及blockmap细则；不借作者历史或外部反馈代替当前事实与授权 |
| [GOV.UK discovery](https://www.gov.uk/service-manual/agile-delivery/how-the-discovery-phase-works)及 [agile principles](https://www.gov.uk/service-manual/agile-delivery/core-principles-agile) | 先理解问题／约束，早且持续取得用户反馈；适用于启动、需求与有重要理解取舍的设计 | startup／MRD 和阶段沟通表：核分批展示与阶段职责；PRD—UI 有具体反馈节点 | 不套政府组织、固定阶段周数、人数或采购审批；发现阶段不提前构建产品 |
| [IIBA elicitation confirmation](https://www.iiba.org/contentassets/4630faa7d92e46e2a4beda5314d393a5/task-card-confirm-elicitation-results.pdf) | 核沟通结果的准确／一致及遗漏冲突，适用于信息整理和需求确认 | requirements、MRD／PRD：确认后保存、变更记录、收全及逐项落点核对 | 不采用整套认证体系；收全起草门槛来自用户决定 |
| [NASA requirement appendix](https://www.nasa.gov/reference/system-engineering-handbook-appendix/) | 清楚、可验证、可追踪；适用于需求和验收及受影响关系 | PRD、组件和检查规则：核主体、条件／结果与验证依据 | 不采用航天流程、全部表单或为未知指标编数值 |
| [arc42 building blocks](https://docs.arc42.org/section-5/)、[runtime](https://docs.arc42.org/section-6/)及 [decisions](https://docs.arc42.org/section-9/) | 静态责任与实际运行场景结合，有依据记录重要决定；适用于架构／模块协作和技术取舍 | architecture／module：走正常／重要失败链路，核责任和唯一决定依据 | 不强制十二节模板、固定图数、全量未来设计或重复决定全文 |
| [C4 component guidance](https://c4model.com/diagrams/component) | 按读者需要选择有价值的分解和表达，适用于结构沟通 | module／component：核当前责任分解是否帮助实现和走查 | 不强制每组件一张图，不把其进程／容器语境等同技能工作步骤 |
| [GOV.UK usability testing](https://www.gov.uk/service-manual/user-research/using-moderated-usability-testing) | 用清楚、中立、可信的任务观察困难，适用于有可见样例／原型的 UI | ui：真实文本理解与操作演示分开，反馈落点及影响核对 | 不套固定参加人数、时长或要求真实私密数据；纸面走查不冒充用户测试 |
| [VS Code contributing](https://github.com/microsoft/vscode/blob/main/CONTRIBUTING.md)及 [contribution guide](https://github.com/microsoft/vscode/wiki/How-to-Contribute) | 可复现问题、预期／实际／环境，大改先讨论、相关变更保持聚焦；适用于开发及反馈修复 | development／iteration 和根因规则：核原因、最小完整范围与验证 | 不搬其 CLA、fork／PR 流程、产品目录、角色审批或依赖安装 |
| [Django contribution tutorial](https://docs.djangoproject.com/en/6.0/intro/contributing/) | 回归能识别原错误并支持修复结论，适用于实际缺陷 | development／integration：核测试命中问题、保留失败结果和有效标准 | 不要求每种文字修改先写测试，也不机械每次全量测试；按改动范围取证 |
| [GOV.UK iterate and improve](https://www.gov.uk/service-manual/service-standard/point-8-iterate-and-improve-frequently) | 持续依据真实反馈改善，并处理用户问题；适用于已知问题和后续真实观察 | iteration：反馈身份、取舍、接续层和效果观察分开核 | 不凭编码测试推定价值改善，不自动建立监控或发布节奏 |

标准化结构和沟通节点以用户本次确认的方案为直接依据；上表是优点／适用条件／转化／核对的说明，不以来源数量判方法质量。

2026-10-13 用户授权外部实践对照后的四项方法优化，以下仅吸收适用原则；来源短片段与抓取身份保存在制作期资料，运行不要求读取制作项目或外部网页。下列来源不是本包的验收权威。

| 来源 | 理解后的用途与适配落点 | 不移入的要求 |
| --- | --- | --- |
| Kubernetes [KEP生产就绪模板](https://github.com/kubernetes/enhancements/blob/8659e382efab7340d70de52432ee8f3d9979b797/keps/NNNN-kep-template/README.md)及[KEP-5307](https://github.com/kubernetes/enhancements/blob/8659e382efab7340d70de52432ee8f3d9979b797/keps/sig-node/5307-container-restart-policy/README.md) | 模板把运行判断与停止／恢复联系起来，案例说明升级／降级及版本混用需考虑具体后果。architecture §4维护适用机制，integration-testing §2／§4引用实际条件与结果；只在当前交付需要时展开 | 不套集群、SIG审批、Alpha／Beta／GA、固定SLO或全套发布测试；提案不是本包真实运行证据 |
| [Google AIP-180](https://google.aip.dev/180) | 说明语义兼容，并提醒有限接口按自身使用条件考虑兼容要求。component §3先找消费者／旧对象与承诺，再定新旧组合和预期，§4用例引用；不是只比较字段名 | 不预设protobuf／JSON或所有旧版本永久兼容；冲突回有效架构与用户决定 |
| [Google Cloud EvalTask](https://docs.cloud.google.com/python/docs/reference/vertexai/latest/vertexai.evaluation) | 把输入、参考结果、真实响应及基线响应对应到任务材料。development §2计划时定预期，§4绑定实际对象与样例、获准执行后逐项判断；版本／权限／证据细化沿本包已有要求 | 不采用SDK、云服务、厂商评分或模型裁判，不把编程Agent使用自动算模型产品评测 |
| [GitLab Product Development Flow：Improve](https://handbook.gitlab.com/handbook/product-development/how-we-work/product-development-flow/#build-phase-4-improve) | 用使用证据和用户反馈支持后续改进。iteration §2／§4从有效MRD接本轮观察安排、实际结果及后续取舍；允许未发布项目和未获观察许可时保留未验证 | 不套指标平台、企业角色、固定发布周期或自动跟进；不能凭测试通过宣称价值改善 |


2026-10-12 制作时核对 [Agent Skills 格式规范](https://agentskills.io/specification)及[脚本接口指导](https://agentskills.io/skill-creation/using-scripts)：只吸收按需加载、直接模板导航、帮助入口和结构输出／诊断分流；不据此自动添加可选字段、改业务协议、下载工具或宣称所有宿主兼容。程序帮助与安全诊断对应实际当前入口，独立测试要求来自用户，不冒称源于该规范。

2026-10-15 用户要求测试方案结合项目实际并参考官方成熟实践，已在 development §2、integration-testing §2、iteration §4 及 independent-testing §1 加入制定要求。此次查阅 [Anthropic：Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)，吸收按实际任务及成功条件选择评测与判定方式、核实际结果的思路，适用于模型／Agent 行为；查阅 [Google：SMURF: Beyond the Test Pyramid](https://testing.googleblog.com/2024/10/smurf-beyond-test-pyramid.html)，吸收按速度、维护成本、资源、可靠性和真实条件保真度权衡测试组合的思路。具体方案仍按目标项目需求、风险、技术和预算选择适用建议并注明理由；不强制每个项目同时采用两家方法、固定比例、平台或新增模型调用，不以文章示例替代有效验收。

2026-10-23 开发包规划候选增补：用户要求参考谷歌、Anthropic 等成熟实践；制作 Agent 选择官方资料。此前方案中的“已实际查阅”说法未独立取证，精确时刻未保留、项目内无阅读登记，无法由本项目记录核实当轮读取通道，不声称原文已独立复核。参考 [DP-01 Google Small CLs](https://google.github.io/eng-practices/review/developer/small-cls.html)、[DP-02 DORA 小批量](https://dora.dev/capabilities/working-in-small-batches/)、[DP-03 DORA 松耦合](https://dora.dev/capabilities/loosely-coupled-teams/)、[DP-04 Anthropic 工作流](https://www.anthropic.com/research/building-effective-agents)、[DP-05 Anthropic 多智能体实践](https://www.anthropic.com/research/multi-agent-research-system)，分别吸收完整目标内小步反馈、可验证粒度、契约隔离、独立任务并行及明确委派边界，落在 development 第 2 节与阶段沟通表。不搬固定规模、人数、框架、自动调用或发布制度；这些来源不替有效要求和验收，不宣称必然提效。

## 程序与发布限制

输入／回执转化在[包内检查合同](check-contract.md)，当前程序能力唯一见[程序说明](../scripts/README.md#当前支持与限制)；本说明不另登记同一算法状态。对外再分发许可、正式名称及安装环境仍须发布前核对，不含许可已核定声明，也不授权安装／发布。
