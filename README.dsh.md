# DSH 插件安装 / DSH plugin installation

[简体中文](README.md#dsh-plugin) · [English](README.en.md#dsh-plugin)

在 DSH 的 **插件 → 添加** 中，将以下内容填入包地址／安装来源：

```text
github:liuchao1314lc-debug/mingzhang-sdd#main
```

插件组合包名称为 `mingzhang-sdd-dsh`，技能名称仍为 `mingzhang-sdd`。按提示重启对应 profile 后，在会话中使用 `/mingzhang-sdd`。需要本机可用的 Git、DSH 及其包管理器；技能加载依赖 DSH 的 `skills` 服务。

也可[下载独立 TGZ 安装包](https://github.com/liuchao1314lc-debug/mingzhang-sdd/raw/refs/heads/main/dist/mingzhang-sdd-dsh-0.4.0.tgz)，在插件添加处填入下载文件在 DSH 运行机器上的真实绝对路径。不要填 WorkBuddy 的 ZIP。

Equivalent CLI:

```bash
dsh plugin --profile web add github:liuchao1314lc-debug/mingzhang-sdd#main
```

Open **Plugins → Add**, enter the package source above, and restart the relevant profile if prompted. The bundle is named `mingzhang-sdd-dsh`; invoke the skill as `/mingzhang-sdd`. Alternatively, download the TGZ and use its absolute path on the machine running DSH.

禁用／卸载只管理本组合包贡献的技能，不删除手动安装的同名技能。项目／用户同名技能优先，本包来源 provider 为 `mingzhang-sdd-bundle`。The bundle does not remove manually installed copies; local skills can override this bundled provider.

本包通过 `dsh.bundle.patch` 声明与配置层加载入口注册技能，没有运行依赖或安装脚本。28份技能运行文件保持冻结版本。已在 DSH `0.2.0-rc.2`、Node `v24.15.0` 的隔离 profile 验证原生管理器安装／加载／启停／卸载；实际网页按钮、其他版本和技能模型行为未在该验证中覆盖。The isolated native-manager checks do not establish UI installation, compatibility with other DSH versions, or model behavior.
