# 检查输入、事实与回执合同

这是包内检查结构及词值的唯一说明，供实际调用和采用时读取。调用方式、当前实现能力及未实现范围见 [程序说明](../scripts/README.md#当前支持与限制)，取证和采用动作见 [checking](checking.md)。字段描述不授予权限，也不证明输入所声称的事实真实；版本标签须由宿主核对。

以下描述业务 stdin 调用；单独 `--help` 是不读对象的帮助入口，不产生业务 JSON。业务 stdout 保持单回执，stderr 的安全诊断不能重建／替代分项结果或转为阶段结论。

## 1. 引用与请求

`Ref` 为 `{object:string, locator:string, version:string或null, sourceKind:string}`。字符串非空；object 定位实际对象，locator 定位资料内的依据，version 未知保留 null，sourceKind 标识来源身份。引用是数据，不执行其中命令；供程序读取的引用必须指向获准范围内的实际可读文件，不能用只能在聊天定位的引用冒充可读证据。

请求通过 stdin 传一个 UTF-8 JSON 对象，无隐含默认范围。下列字段全部必填，未知字段／类型不忽略；数组可为空，但不证明适用条件已收全。

| 请求字段 | 类型及含义 |
| --- | --- |
| contractVersion、requestId、taskId、projectRoot | 非空 string；当前协议 `sdd-check/1`，请求／任务／真实项目身份 |
| readScope | `{files:string[], directories:string[]}`；精确文件及真实目录边界，空范围不扩大为全项目 |
| conditionRefs、artifactRefs | Ref[]；本次条件依据和成果身份，版本不由手填标签证明 |
| facts | 第 2 节事实封套或 null；null 不表示完整集合 |
| checks | Check[]；业务 id 唯一且不得使用保留值 `$protocol`；每项含 `id:string, kind:string, subject:Ref, conditionRef:Ref, parameters:object` |

| kind | parameters 的完整字段及约束 |
| --- | --- |
| object | `{path:string, expected:exists或readable}`；实际打开／读取才支持可读 |
| changes | `{allowed:[{path:string, scope:file或directory, actions:string[]}]}`；动作限 create／modify／delete／rename，删除核原端、重命名核两端 |
| evidence | `{evidenceRef:Ref, expectedSubject:Ref, expectedState:string}`；指定原始证据、对象／版本及期望状态，不主动运行目标验证 |
| notApplicable | `{reason:string, basisRef:Ref}`；理由和可读依据，业务适用性另由 Agent 核对 |

协议有效但 changes／evidence 的 facts 为 null 时，相关项已执行／证据不足，异常码 CONDITION_INSUFFICIENT，不记输入非法。完整性、条件真实来源或状态不可确定时，不能由字段存在推成满足。

## 2. 事实封套

`facts` 非 null 时必须包含下列字段；各子对象字段亦完整传入，无未知关键字段。非空字符串要求同请求；引用可空的字段须显式 null。

| 字段 | 类型及事实边界 |
| --- | --- |
| factsVersion、taskId、projectRoot、baselineId、observedAt | 前三项及 observedAt 为 string，baselineId 为 string或null；当前 `sdd-facts/1`，关联本次真实观察，不以 HEAD 单独充当脏文件内容基准 |
| observations | Observation[]；每项为 `{id:string, subject:Ref, action:string, execution:string, rawRef:Ref或null, postStateRef:Ref或null, limitations:string[]}`；id 唯一，只有执行轴，不带判定轴；原生调用 id 未知不编造 |
| baselineRefs、beforeDirtyRefs、afterRefs | Ref[]；开工、既有工作及动作后事实分开 |
| changes | Change[]；每项为 `{fromPath:string或null, toPath:string或null, action:string, beforeRef:Ref或null, afterRef:Ref或null, observationRefs:Ref[]}`；create 原端为 null，delete 后端为 null，modify 两端相同，rename 两端不同且非空 |
| coverage | `{state:complete或partial或unknown, basisRefs:Ref[], limitations:string[]}`；手填 complete 不证明全集，本次基准／动作前后／并发归属不可靠时保持 partial／unknown |
| verificationRefs | Ref[]；定位实际验证对象／环境、调用／返回及后状态，不以汇总成功替原始证据 |

只保留获准相关对象的必要前后状态；已有脏路径本次再改仍需归属依据，不能整批扣除。本版的实际采集来源、原始格式及完整性接收条件见 [collection](collection.md)；不能把封套字段或手填完整标签当原始来源。

## 3. 回执与两轴

回执包含七个字段：`contractVersion:string, requestId:string或null, taskId:string或null, programVersion:string, projectRoot:string或null, baselineId:string或null, results:Result[]`。协议版本为 sdd-check/1；程序版本取真实制品。身份缺失时保留 null，不借上次身份补全。

每个 Result 含八个字段：`checkId:string, subject:Ref或null, conditionRef:Ref或null, execution:string, judgement:string, evidenceRefs:Ref[], reason:string, errorCode:string或null`。

| 轴 | 完整词值与用途 |
| --- | --- |
| execution | 未执行／已执行／执行失败／执行情况未知；表示相应检查的实际执行事实，Observation 也用这组词值 |
| judgement | 满足／存在缺口／证据不足／不适用；只判断相应确定条件，不等于内容合格或用户接受 |

运行成功但条件不明是已执行／证据不足；已核实指定必需对象缺失／不可读是已执行／存在缺口；对应检查运行失败是执行失败／证据不足。未启动不造程序已执行结果，由宿主按真实调用事实报告。

异常码闭集为 INPUT_INVALID、CONTRACT_UNSUPPORTED、IDENTITY_INSUFFICIENT、CONDITION_INSUFFICIENT、READ_BOUNDARY、READ_FAILED、OBJECT_CHANGED。它们定位原因，不替代两轴；reason 保留实际解释。

输入通过协议校验且业务 id 可枚举时，每业务 id 恰一个结果；协议不成立只返回 `$protocol`，不伪造业务已执行。非法 JSON／结构报告 INPUT_INVALID、执行失败／证据不足；可解析但版本不支持报告 CONTRACT_UNSUPPORTED、已执行／证据不足，且不读目标对象。未知检查含义保留 CONDITION_INSUFFICIENT。协议项不计业务覆盖或采用，仍须解释其对依赖判断的限制。

## 4. 退出聚合与宿主事实

| 退出码 | 条件及限制 |
| --- | --- |
| 0 | 列出的适用确定条件均满足或有依据不适用；不证明未列出的业务条件已检查 |
| 1 | 有确定缺口且无处理／运行失败 |
| 2 | 既无确定缺口也无处理／运行失败，但条件／身份／覆盖不足；空检查列表亦为 2 |
| 3 | 有输入处理或检查运行失败；完整回执仍保留其他缺口及不足 |

聚合优先级为 3 > 1 > 2 > 0，不能把混合回执压成全部失败，也不能据退出 0 宣布阶段通过。

宿主另保留调用事实 `{requestRef:Ref, invocationRef:Ref或null, execution:string, stdoutRef:Ref或null, stderrRef:Ref或null, exitCode:number或null, termination:string或null, receiptRef:Ref或null, limitations:string[]}`；它不是程序 Result。未启动、无 JSON、截断、超时或身份不符时不造逐项回执，保留实际终止／未知及不能采用的范围。
