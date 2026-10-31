# v0.7.0 分发核验 / Distribution verification

2026-10-31。当前源码、ZCode 插件与 DSH 包使用同一固定运行资源；机器可读身份见 [distribution-manifest.json](distribution-manifest.json)。

## 固定来源 / Fixed source

- 制作仓库对象 / Authoring object: `c36a9f90405b496a97ab450ad76588cbba07aaca:skills/mingzhang-sdd/`。
- Git subtree: `cc9e15454c8a74bf5e01c209f0188f55c33dfa80`。
- 29 份／1,564 行纯文字资源 / 29 text files, 1,564 lines。
- 内容组合 SHA-256: `708df17bc0accae70095a7a2bfb01ea56dc519bedf317e051403a9325d0a2bfc`。算法与逐文件值见清单 / Algorithm and per-file values are in the manifest。

制作仓库对象是来源身份，不属于本公开仓库 Git 历史；使用者应同时固定实际采用的公开提交。The authoring commit identifies provenance; pin the public commit you actually adopt.

## 本次核验 / Checks performed

| 对象 / Object | 结果与覆盖 / Result and scope |
| --- | --- |
| 根技能 / Root skill | 29/29 文件逐字节匹配固定源；旧版脚本未混入 / All 29 files match the fixed source; no legacy scripts |
| ZCode | 29 份技能＋2 份清单；版本均 0.7.0；marketplace 相对路径与完整插件布局核对通过 / 29 skill files + 2 manifests; versions, relative source and layout checked |
| DSH | 29 份技能＋4 份封装；本地 TGZ 与源／封装逐字节核对 / 29 skill files + 4 wrappers; archive contents checked |
| DSH 原生运行库 / Native runtime | DSH 0.2.1-rc.5、Node 24.15.0、pnpm 11.7.0；临时 profile 原生 inspect、安装、Loader 注册、资源读取、禁用／启用／移除，10/10 / Ten checks passed in a temporary profile |
| 运行资源链接 / Runtime links | 229 条包内相对 Markdown 引用存在；另 2 条是制作史包外引用 / 229 internal targets exist; 2 author-history references point outside the distribution |
| 历史对象 / Legacy | 原 v0.4.0 TGZ 字节保持 / Original v0.4.0 TGZ unchanged |

DSH 检查使用本地 TGZ 与离线配置；不覆盖网页按钮、远端来源安装、其他版本或模型行为。ZCode 本次是清单、布局与内容静态检查，未操作宿主安装界面。两条包外制作史引用原样保留，不用于运行时读取。

DSH checks used a local TGZ and offline configuration; UI installation, remote sources, other versions and model behavior were not tested. ZCode checks were static; no host UI installation was performed. The two external author-history references are retained as provenance rather than runtime inputs.

## 行为评价身份 / Behavior-evaluation scope

制作仓库已记录同一固定源的 F05 单案例复核：`gpt-6.1-sol / high`，3/3 次、18/18 断言通过；它是内部协作定向复核，未做人类独立校准，只关闭 F05 整改项。报告身份见清单；完整原始评价证据未复制到本公开仓库。

The authoring repository records F05 at the same fixed source: 3/3 trials and 18/18 assertions passed with `gpt-6.1-sol / high`. This internal collaborative targeted review closes only the F05 remediation item. It has no independent human calibration; full raw evaluation logs are not included here.

旧正式独立评价 `verification_fail` 保持；本次未重跑全量评价，无技能／非技能对照，不能宣称整产品通过或成本／质量改善。The earlier formal independent result remains `verification_fail`; this update does not establish whole-product acceptance or cost/quality improvement.

ZCode 布局依据 / Format references: [Plugin](https://zcode.z.ai/en/docs/plugin), [Skill](https://zcode.z.ai/en/docs/skill)。安装入口见 [README](README.md)、[English README](README.en.md) 与 [DSH 安装说明](README.dsh.md)。
