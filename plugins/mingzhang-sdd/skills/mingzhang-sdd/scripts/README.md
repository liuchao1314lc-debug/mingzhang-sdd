# 本地只读检查程序

`check-task.mjs` 是已实现的确定性检查入口，程序版本 `mingzhang-check/0.2.2`。使用 Node.js 24.x 标准库，无需安装依赖或构建。本包已形成十阶段文字方法；程序范围仍是局部确定性检查，宿主安装入口未制作。方法文本不证明十阶段行为已验收。

该版本已记录的局部实测环境为 macOS／Node v24.15.0；此说明不表示其他操作系统或五工具已验收，也不是每次运行时自动探测的环境。

调用：`node /实际实现目录/skills/mingzhang-sdd/scripts/check-task.mjs < /获准位置/request.json`。程序也可由宿主执行工具把同一个 UTF-8 JSON 对象送入 stdin，不必为调用另保存输入文件。业务调用的 stdout 只返回一个 JSON 回执；非零退出的 stderr 只给类别、退出码及原因码，不复制路径、请求身份或私有正文。人读结果由 Agent 在消息中解释。请求不能携带命令，程序不执行数据中的指令。

帮助：`node /实际实现目录/skills/mingzhang-sdd/scripts/check-task.mjs --help`，stdout 给简短用法、环境／协议及退出说明，退出 0，不读取 stdin 或项目文件；帮助不属于业务检查回执，不证明执行了检查。

仅单独、准确的 `--help` 被解释为帮助选项；`--version`、`--helpp` 等其他参数不作为选项处理，程序仍按普通 stdin 模式读请求，不据这些参数自动拒绝或显示帮助。调用时使用上列准确命令。

## 最小对象检查请求

下例是结构示例，`projectRoot` 要替换成真实获准目录；`condition.md` 须是当前请求／决定的可读依据，`PRD.md` 须对应本次对象。示例不是用户许可、已执行事实或已存在文件声明。

填入示例 r1／r2 前，按 [实际版本取证](../references/checking.md#version-evidence)取得本次有效条件与成果版本，并保持列表及单项引用一致。若必需 PRD 确实不存在，artifactRefs／subject 的 version 可为 null，但条件版本须从真实依据取得；条件版本未知会得到证据不足，不能据此宣称已经检查出缺失。

```json
{
  "contractVersion": "sdd-check/1",
  "requestId": "request-1",
  "taskId": "task-1",
  "projectRoot": "/实际项目根",
  "readScope": {"files": ["condition.md", "PRD.md"], "directories": []},
  "conditionRefs": [{"object": "condition.md", "locator": "当前决定", "version": "r1", "sourceKind": "user"}],
  "artifactRefs": [{"object": "PRD.md", "locator": "正文", "version": "r2", "sourceKind": "artifact"}],
  "facts": null,
  "checks": [{
    "id": "prd-readable",
    "kind": "object",
    "subject": {"object": "PRD.md", "locator": "正文", "version": "r2", "sourceKind": "artifact"},
    "conditionRef": {"object": "condition.md", "locator": "当前决定", "version": "r1", "sourceKind": "user"},
    "parameters": {"path": "PRD.md", "expected": "readable"}
  }]
}
```

## 当前支持与限制

- `object`：实际核存在或完整读取可读条件。不会从文件可读判断 PRD 内容合格，也不会验证 Ref 中自行填写的版本真实性；Agent 仍要核当前成果身份。
- `changes`：校验事实结构与任务／项目关联，逐已观察动作核允许路径与动作；删除核原路径、重命名核两端。发现明确界外项保留具体路径；支持从本包采集入口的原始基准／逐动作／收尾来源独立重建，在完整观察边界内判满足。缺原件、并发、断链、部分目录、当前版本变化或手填 `complete` 仍不足。
- `evidence`：facts 为 null 时返回不足；有事实时实际读指定证据，缺失／不可读可定位缺口；当前支持 Codex 完成／续读返回与 Node 24 单文件 TAP 的对象／版本／基准／原始状态核验。其他格式、汇总成功、截断、跳过、未知和矛盾均不推成通过。
- `notApplicable`：必要理由及可读依据均存在才给独立“不适用”判定。理由与引用的业务适用性由 Agent 评审，不适用不算业务通过。

完整 `sdd-facts/1`、请求／回执字段、两轴词值及协议结果沿 [包内检查合同](../references/check-contract.md)，程序按该结构接收；使用者无需取得制作项目的组件文档。

退出聚合和宿主未取得可采用回执时的处理沿 [合同第 4 节](../references/check-contract.md#4-退出聚合与宿主事实)，此处不维护第二份词值／优先级说明。程序存在不证明 Agent 正确采用。

路径先核显式范围及真实根，目录使用实际边界，不按字符串前缀；链接的显式列项、经目录命中及目标访问的实际范围见[链接读写边界](../references/collection.md#link-read-boundary)；Agent 据有效许可核链接路径及解析目标后传参。普通对象探测分块读取并丢弃内容，原始 JSON 仅在进程内部解析；句柄在成功／失败时释放；读取前后核对象身份，发现变化返回 OBJECT_CHANGED。此机制未证明所有操作系统的硬隔离，也不能排除所有恶意并发路径替换；该风险保留到平台／宿主验证，不用于签写操作权限或全系统安全通过。没有自定模型预算、目标验证重试或后台进程。

制作期局部测试使用独立临时目录和真实 Node 子进程，变化／IO 故障分支另用可恢复的局部注入。测试文件未随当前包提供，不是使用者运行程序的前置；这些局部证据不能冒充真实宿主故障或五工具验收。


## 采集入口与依赖

[collect-task.mjs](collect-task.mjs) 的 capture／finish 只观察或读取原件，action 会执行已获准的固定文件动作；完整输入、原始格式、步骤及限制唯一见[collection](../references/collection.md)。有观察限制返回退出 2，失败回执和 stderr 给明确原因码；退出 0 不代替核范围／limitations 或阶段判断。不要把 action 当只读检查，不把参数当写许可。采集器可调用固定的只读 Git 观察；check-task 及其只读解析依赖不调用 Git、不写目标或运行验证。

需要 changes 结论时，在相关写入前按 [修改前到检查请求](../references/collection.md#collection-steps)连接 capture、实际 action、收尾 capture、finish 和检查请求；选择及逐项采用沿 [checking](../references/checking.md#check-selection)，不只保存一个前件副本便认定来源完整。

[file-access.mjs](file-access.mjs) 维护实际读取边界／句柄及内容指纹；[facts-evidence.mjs](facts-evidence.mjs) 维护来源重建和已选原始格式解析。分文件便于采集入口复用同一读取机制，未增加服务、状态库或第三方依赖。使用本包时须保留这些实际依赖。
