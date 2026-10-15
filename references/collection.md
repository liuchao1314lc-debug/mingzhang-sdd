# 本次改动采集与 Codex 原始证据

本页定义 `mingzhang-collect/0.1.2` 的原始来源格式及使用方法，供 `sdd-facts/1` 使用；检查请求仍沿 [check-contract](check-contract.md)。宿主 Agent 核本次用户许可、观察／写入对象及证据保存位置；采集参数不是授权。检查程序仍只读，采集入口的 `action` 会实际写文件，二者不可混称。

## 1. 采集什么、怎样取得

采集限本次相关文件或明确目录。需要程序判断改动集合时，在修改前按下列步骤准备原始来源；`finish` 只读原件并生成事实，不替用户签完整性。

### 从修改前到检查请求

<a id="collection-steps"></a>

本流程供已获准的相关文件动作使用，Agent 负责核许可、保存原件及把事实交给检查；各模式字段唯一沿 [第 2 节](#2-输入与原始格式)。先沿 [检查选择](checking.md#check-selection)判断是否需要这条链，已有完整、仍适用的来源不重做。

1. **固定范围并保存开工原件。**核实际 projectRoot、taskId、允许对象／动作及相关观察 scope。对所需文件或明确目录调用 capture，完整保存真实 stdout、stderr 和退出事实。证据文件存入获准的项目根内、观察范围外位置，例如相关文档在 docs 内、原件在 .evidence 内；原件供程序读取时还须在 readScope。不能为读取根外证据擅自扩大 projectRoot，也不能默认观察全仓。没有证据写许可时只保留宿主实际输出及可定位引用，无法提供所需可读原件就报告限制。
2. **从实际前状态取得动作参数，再执行一次。**modify／delete／rename 的 expectedBefore 取最近一次实际快照 objects 中原路径的 version；create 先核目标不存在，expectedBefore 为 null。填已获准的 writeScope、operation 和相同观察 scope，再调用 action。逐动作立即保存未重排、未改写的原始 stdout；核真实执行、限制及后状态后再接下一个获准动作。动作失败或退出 2 不表示没有写入，不能盲目重试。普通编辑器／其他宿主写入口不能冒充这个 action 原件；任务要求该入口时保留实际证据及覆盖不足，不改造事实来签完整。
3. **保存收尾观察及原件引用。**在相同实际根、任务和观察范围下再调用 capture，保留真实 stdout。对开工、每次 action、收尾原件分别取完整字节指纹，按第 2 节的原始 Ref 定位实际文件；operationRefs 按发生顺序列入。scope 中未收全的必要对象或无法核实的并发归属要报告，不能缩小范围换取 complete。
4. **重建，不手填事实。**调用 finish：baselineRef 指开工原件，operationRefs 指真实动作原件，afterRef 指收尾原件，verificationRefs 只列已取得的实际验证来源，没有则传空数组。readScope 覆盖本次必要原件和被观察对象。保存真实 finish stdout；从中读取整个 sdd-facts/1 对象，保持字段及键顺序作为检查请求的 facts，不只复制 changes、不手改 coverage。finish 满足来源重建条件仍不说明动作符合用户允许范围，也不说明验证通过。
5. **连接到 changes 并采用。**检查请求沿 [检查合同](check-contract.md#1-引用与请求)：projectRoot／taskId 与事实相同；当前 subject、artifactRefs 和有效条件按 [实际版本](checking.md#version-evidence)取得；readScope 同时覆盖所需原件、当前对象和条件。changes.parameters.allowed 从有效许可转成 path／scope／actions，不能用事实中“已经发生的动作”反向授予许可。把步骤 4 的 facts 送入 check-task；需要对象检查时可同请求列 object，但各项分别采用。原件缺失或链不全保留证据不足，不能因 object 满足宣称改动集合通过。

**链未接通时逐步登记。**capture／action 的真实 stdout 不自动成为 finish 的事实封套，也不会自动传入检查请求。已取得哪些原件、是否有收尾观察、是否实际调用 finish、该次检查收到的 facts 是什么，分别按原始回执和请求核对；未调用的步骤记未执行，不以“采集已执行”概括整条链。缺可用原件引用或保存许可时，保留实际动作／独立后状态核对与未接通环节，按 [逐项采用](checking.md#3-逐项采用)报告影响。能否复用原件或补做只读重建先核当前许可及来源适用性，不为补齐链默认新建证据文件，不重做已经发生的动作。

修改前未取得所需原始观察时，正文前件副本或事后 diff 可支持部分事实，但不能补造 capture／action 时间链。保留实际已发生动作与缺口，必要补证交回当前许可和影响范围；不重复业务写入来制造一条成功日志。只读核旧改动来源时只做获准读取及检查，不调用 action。

Git 观察使用固定的只读命令，保留当前 HEAD、相关路径的 porcelain v1／索引原始输出；禁用 fsmonitor，禁用可选锁，不执行输入中的命令。不做提交、暂存或全仓内容快照。非 Git 项目保留实际对象前后状态，不初始化 Git。porcelain 及 NUL 路径处理依据 [Git 官方说明](https://git-scm.com/docs/git-status)；文件操作／句柄依据 [Node 24 文件系统说明](https://nodejs.org/docs/latest-v24.x/api/fs.html)，实际平台能力仍以本轮验证为限。

每个相关普通文件记录内容 SHA-256 和对象身份；目录记录成员及身份。只递归明确列出的相关目录，不以默认根或 `files` 中的目录触发全仓采集。能通过下列读取边界核对的链接，以及范围内特殊对象，保留观察限制；断链、目标无法定位或越过上述边界的链接拒绝其读取／采集；capture／finish 均不跳过边界检查，边界拒绝报告执行失败、退出 3／READ_BOUNDARY，不降为 unsupported。收尾先核读取边界，再用同采集时的 lexical lstat 核对象自身身份，不读取其内容。已取得观察的受限对象未变时生成 partial，实际身份变化仍拒绝旧观察。读取变化及其他不足分别报告。文件指纹用 64 KiB 分块计算，不将整个普通文件加载到内存；原始 JSON 依据文件解析容量为 4 MiB，读取前或读取期间超限均给 CONDITION_INSUFFICIENT，句柄释放。容量是本版解析能力边界，不是产品质量阈值或进程硬内存保证；stdin 请求容量未在本修订改变。超限保留原件及不足，不截短、覆盖原件制造通过。遇到链接边界拒绝，Agent 报告受影响对象，先核目标及有效许可，不能为取得成功退出码擅自缩小本次必需范围；确需调整时核范围决定并保留未观察部分，原要求不据缩小后的 complete 推定已满足。内容不抄入回执；指纹用于验证来源文件和目标版本，不是来源真实性的数字签名。

命令：`node /技能目录/scripts/collect-task.mjs < /获准位置/input.json`。stdout 是一个 JSON；单独 `--help` 不读 stdin 或项目。capture 有 limitations，或 action 的顶层／before／after 任一处有 limitations，或 finish 的 coverage 非 complete 时退出 2；处理／文件动作失败退出 3并给 errorCode、category、reason，stderr 同时给原因码与类别。action 写入成功但观察受限时仍记“已执行”，退出 2 不表示写入失败。失败回执及非零退出不能证明没有发生动作，先核后状态，不重跑。退出 0 也不代表阶段通过，观察范围和限制仍须核对。三种输出格式的退出判据统一由 collectionExitCode 维护，CLI 只按其结果报告；新增受限来源时核对应格式判据和调用链，不在调用方另写一套判断。

### 链接的读写边界

<a id="link-read-boundary"></a>

程序分别核请求路径与解析后的真实路径，两者都须命中已登记的范围，真实路径始终不得越过项目根。具体含义如下：

- `files` 显式列出一个仓内链接时，登记该链接路径及其解析目标，允许经该链接读取目标；不因此允许直接使用未被其他文件条目或目录边界覆盖的目标路径，也不授予目标的相邻文件。
- `directories` 按列出的目录路径及其解析目录核后代；显式列出链接目录时适用同一规则。仅因链接位于已列目录内，不会自动授予目录外目标；目标还须命中已登记的真实文件／目录边界。
- 断链、无法定位或根外目标仍拒绝，显式列出链接也不能解除这些拒绝。Agent 填参前须核链接路径及实际解析目标均在有效读取许可内；参数只能描述程序范围，不能替用户授权。采集器即使准许访问链接，仍将链接本身记为 unsupported＋限制，不据此签改动集合完整。

以上登记只定义读取边界，不产生写入许可。Agent 先核有效写许可，`action` 再核 writeScope 和实际动作前基准；已观察为符号链接的端点不接受修改、删除或作为重命名源，create／rename 也不覆盖作为目标端点的已有符号链接，均在写操作前拒绝。这不等于拒绝任何父目录含链接的路径：经明确 writeScope 核边界的链接目录下，普通文件端点仍按对应文件动作条件处理。

## 2. 输入与原始格式

所有模式拒绝未知字段；传入绝对 `projectRoot`，封套保存真实项目根。范围结构均为 `{files:string[], directories:string[]}`，相对路径按项目根解析；空范围不扩大为全项目。

| mode | 除 mode 外的完整字段 | 动作与责任 |
| --- | --- | --- |
| capture | taskId、projectRoot、scope | 只读本次范围，返回 `sdd-snapshot/1` 原始观察；Agent 保存实际 stdout |
| action | taskId、projectRoot、scope、writeScope、operation | 核动作前实际版本及两端边界，然后执行一种明确文件动作，再取得后状态；Agent 先核真实写许可 |
| finish | taskId、projectRoot、readScope、baselineRef、operationRefs、afterRef、verificationRefs | 原件按版本／范围读取，重建本次集合；baselineRef／afterRef 单个，其他为数组，不从手填清单签完整 |

`operation` 为 `{action, fromPath, toPath, content, expectedBefore}`。action 为 create／modify／delete／rename；路径对应检查合同的两端规则。create 的 expectedBefore 为 null，modify／delete／rename 必须是本次动作前实际普通文件的 `sha256:…`；create／modify 的 content 为待写字符串，其他为 null。数据不求值。create／rename 拒绝覆盖已有新端点；rename 采用 link 后 unlink，只支持普通文件，任一步失败保留实际部分结果，不宣称原子移动或自动回滚。目录创建／移动、索引动作和其他宿主写入口不属于这个记录器的动作闭集。

以下示例只创建已存在的获准 `drafts` 目录内一个新文件；用户未给写许可时不能调用 action。

```json
{
  "mode": "action",
  "taskId": "task-current",
  "projectRoot": "/实际项目根",
  "scope": {"files": [], "directories": ["drafts"]},
  "writeScope": {"files": ["drafts/PRD.md"], "directories": []},
  "operation": {"action": "create", "fromPath": null, "toPath": "drafts/PRD.md", "content": "已获准的正文", "expectedBefore": null}
}
```

`sdd-snapshot/1` 固定字段为 format、collectorVersion、captureId、taskId、projectRoot、observedAt、scope、objects、git、limitations。objects 按相对路径保存 absent／file／directory／unsupported；file 含 version 及 stat，directory 含 entries 及 stat；stat 为 dev、ino、mode、size、mtimeMs、ctimeMs。git 为 state（git／notGit）、head（提交标识或 null）、status、index，后两项保存原始字符串。captureId 是本次生成的本地基准关联键，不冒称宿主调用 ID。

`sdd-local-action/1` 的共用字段为 format、collectorVersion、taskId、projectRoot、operation、before、after、execution、limitations。0.1.1／0.1.2 另含 errorCode、category、reason：成功时为 null，动作失败时给明确诊断；错误码沿检查合同闭集。before／after 是上述实际快照；operation 为 action、fromPath、toPath、contentVersion（写入内容指纹或 null），不复制待写正文。此文件必须来自实际采集进程返回，不能由 Agent 把拟议动作改写成已执行回执。

原始 Ref 沿检查合同四字段，object 指向实际文件，locator 标明正文或其中位置，version 必须是该原件**完整实际字节**的 `sha256:…`，sourceKind 为 tool。先保存原始文件再取得指纹；不得先自行编造 JSON 来源或重新排版原件来通过核对。不同保存格式只有实际绑定的字节与指纹相符才可读取。

## 3. 什么时候能判集合完整

`finish` 依开工 → 动作前／后 → 收尾逐段核身份、时序、范围、对象／目录成员、内容和 Git 状态。只有所有动作成功、链条连续、实际变化与动作一致且无观察限制时，才生成限定范围的 complete。finish 只收录 verificationRefs，不解析 Codex 验证封套；其退出 0只说明改动来源链重建完成，不说明指定验证通过。封套内 limitations 和实际验证状态由后续 kind=evidence 检查核定，采用前须取得该检查回执。保留逐动作变化，创建后删除等瞬时动作不会因最终状态恢复而丢失；既有脏文件未变不归本次，同路径再改按新前后状态进入集合。

当前 facts 比较对对象键序敏感：仅改变缩进／空白不影响解析，但重新排序键会报结构不一致。这是传输结构不匹配，不据此认定恶意篡改；保留原件及原有字段顺序，不为了消除不足重写原件。

检查程序重新读取原件并独立重建，核传入 facts 与原始结果一致、允许边界被观察范围完整覆盖、当前对象仍适用，才给 changes 满足。基准丢失、并发／断链、未记录动作、索引／提交变化、部分目录观察、空观察范围、未知原始格式或版本不符分别保留不足；已观察界外项仍可定位。失败动作只按实际后状态保留变化，不把请求动作当实际执行。

完整性限定在所列任务观察范围及原始操作来源。Agent 仍须对照有效任务核范围和动作是否收全；此算法不保证未观察路径没有动作、不证明模型没有遗漏，也不对抗伪造整套宿主证据。其他写入口、目录／索引动作及不支持的来源不能被这个 complete 标签覆盖；要么保留 partial／unknown，要么先明确其原始适配方案。恶意并发路径替换及跨平台硬隔离仍未验收。

## 4. 首个宿主证据格式

用户已选择先实现当前 Codex，本版支持本会话 `exec_command`／`write_stdin` 的完成返回及 Node 24 **单文件、明确 TAP reporter** 的验证。不把本会话字段扩成所有 Codex 版本的公开统一协议，也不猜其他四工具日志或普通命令的成功含义。Node 原始测试输出依据 [官方 test runner 文档](https://nodejs.org/docs/latest-v24.x/api/test.html)；原始 tool 返回字段来自本会话实际工具接口及执行回执。

### 验证来源与绑定

<a id="verification-binding"></a>

Agent 按以下顺序准备已有或获准的必要验证，不因检查需要自行新增验证：

1. **先核支持格式和实际对象。**取得真实命令、工作目录、环境及直接运行的测试入口；区分它与业务成果，按下表取得各自当前版本及必要依赖。获准验证执行前须有相应前观察，执行后保留后观察；已有验证缺前观察则报告缺口，不重跑来补造原件。其他命令或来源格式未支持时保留实际结果，不能换标签使其看似受支持。
2. **保存真实返回，再形成封套。**按原顺序保存完整 exec／续读返回、实际命令及终止事实；逐字段对应可回读的原件和事件位置，保留实际存在的字段。未暴露的可选 chunk_id／original_token_count 不填；session_id 按原件保存，并核下述序列要求，不把中间返回所需的字段当作可省略项。不用本地计时、示例值或本地 ID 充作原生元数据。output／wall_time_seconds 等当前必需字段没有真实来源时，保存实际原件并记录 limitations，不能构造无来源值来填满本格式。Codex CLI JSONL 的命令事件不是本格式的 exec 返回；只有聚合输出及退出，也不能补造其余字段转成完整封套。
3. **核序列和引用后才采用。**按下述当前格式的序列及引用关系核对，保存可读原件后取得其完整字节指纹，将对应 Ref 列入 verificationRefs，再交 kind=evidence。来源不能完整回读或序列不支持时保持采用不足；真实测试结果可另行报告，不能由它补签程序采用。不能通过删除原生字段、重排片段、换对象或补跑目标验证制造成功。

`sdd-codex-exec/1` 是关联封套，完整字段如下；它不改变原始返回，也不证明来源真实性。

| 字段 | 结构及核对 |
| --- | --- |
| format、taskId、projectRoot、subject | format 固定；任务／真实根与请求一致；subject:Ref 指命令直接运行的测试入口文件，version 为其实际内容指纹，不能填业务成果文件来替代 |
| environment | `{nodeVersion, platform}`，记录实际环境；当前解析范围为 Node 24 |
| request | `{cmd, workdir}`，保存实际调用参数；本版仅接受 `node --test --test-reporter=tap <单个测试入口路径>`，该路径须与 subject.object 解析到同一对象，可用单／双引号包裹；命令只作资料，不执行 |
| beforeRef、afterRef | 定位验证前后原始快照，包含测试入口及 PRD 等本次必要依赖；版本／范围未变且当前仍匹配才采用 |
| returns | 按实际顺序保留 exec／续读原始返回数组；output、wall_time_seconds 是当前必需字段，最后返回须有真实整数 exit_code；其余字段按原件保留，缺来源不猜值 |
| limitations | 未终止、未知、截断等真实限制；有这些限制不能给完整通过 |

evidenceRef 必须在 facts.verificationRefs 中；evidence 检查的 subject、parameters.expectedSubject 与封套 subject 为同一测试入口 Ref，并在本次 artifactRefs 中，不能因同一任务而沿用 object／changes 的业务成果 Ref。例如命令实际运行 tests/task.test.mjs、其中验证 docs/product/PRD.md 时，object／changes 仍对应 PRD，evidence 对应测试入口；artifactRefs 分别列入两者，前后快照包含入口及 PRD 依赖。所需 facts 仍来自第 1 节的受支持真实采集，不手填 complete。

当前解析器要求中间返回没有整数 exit_code 且带连续一致的整数 session_id，最后返回有整数 exit_code 且不带整数 session_id；chunk_id 存在时不得重复。这是本版支持形态，不是所有 Codex 宿主的共同协议。真实完成返回若仍带整数 session_id 或实际序列不符合上述要求，保留原件、报告格式不足，不能删字段迎合判据；来源适配须另核真实形态后实现。当前封套内 limitations 非空不能得到完整通过。

expectedState 本版支持通过／存在偏差／已执行。解析逐项 TAP、计划与最终计数，核退出及会话序列；失败原文保留，跳过／取消／空用例／截断／重复统计／退出矛盾不得报完整通过。缺失或不可读的指定证据仍按检查合同报告。形状及指纹核对不能代宿主核真实来源；没有可回读的字段出处时，Agent 不能把程序的肯定结果签成可采用。

肯定结果只表示“指定对象／版本的该次验证状态符合期望”，不代替语义质量、独立评价、五工具支持、阶段通过或用户接受。宿主原始来源真实性、运行环境与依赖选择仍由 Agent 用实际回执核对；JSON 标签和指纹不签发用户许可或宿主证明。


## 5. 来源版本兼容

当前解码器明确支持 mingzhang-collect/0.1.0、0.1.1 与 0.1.2：快照共用字段及事实含义保持，动作按生产者版本选择旧九字段或新版诊断扩展。旧 0.1.0 的原件不迁移、不覆盖，原始身份／范围／当前状态仍适用时继续重建；旧 capture 退出 0 本来不保证 limitations 为空，采用旧证据仍须读该字段。0.1.1 增加受限 capture 退出与动作诊断，0.1.2 补齐 action 前后观察限制的退出判据；各版行为不倒写成旧轮执行事实。

collectorVersion 用于选择已支持的来源格式；同一版本标签不证明两份制品／源码相同。采用历史验证结果时还须核其绑定的制品指纹、测试身份及对象／条件；标签相同而制品指纹不同，不能直接复用通过结论，应保留差异并核受影响项。格式兼容与历史验证适用分别判断。

不按主／次版本字符串猜测未来兼容性。未知生产者版本继续不足；增添新版本须先核来源格式和语义差异、明确适配及相关回归，再加入支持集合。重新构建目录只有同样内容而无原始项目根／基准／stat 身份时，仅支持全文回读，不能据此重放旧观察或伪造当前通过。
