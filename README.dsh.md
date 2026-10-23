# DSH 插件安装 / DSH plugin installation

[简体中文](README.md#dsh-plugin) · [English](README.en.md#dsh-plugin)

## 版本选择 / Version selection

main 是新版技能源入口，不再声明 DSH 组合包。本次不重建或验证新版 DSH 插件。已有 v0.4 插件保持原对象，不包含新版任务理解、上下文保全及治理规则。

Main is the updated skill-source entry point and no longer declares a DSH bundle. This update does not rebuild or test a new DSH plugin. The original v0.4 plugin remains unchanged and does not include the new task-understanding, context-preservation or governance rules.

## 安装旧版 v0.4 / Install legacy v0.4

优先[下载原 TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz)，在 DSH **插件 → 添加** 中填写下载文件在 DSH 运行机器上的真实绝对路径。该文件仍为原83,615字节对象，不要填 WorkBuddy ZIP。

Prefer the [original TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz) and enter its actual absolute path on the machine running DSH under **Plugins → Add**.

需要 GitHub 来源时，固定到旧公开提交，勿用 main：

For a GitHub source, pin the old public commit rather than main:

```text
github:liuchao1314lc-debug/mingzhang-sdd#d85ebcb73b3f79fd25d0201c210266e602598395
```

```bash
dsh plugin --profile web add github:liuchao1314lc-debug/mingzhang-sdd#d85ebcb73b3f79fd25d0201c210266e602598395
```

组合包名为 `mingzhang-sdd-dsh`，技能名为 `mingzhang-sdd`。按实际提示重启 profile 后使用 `/mingzhang-sdd`。本机需有 Git、DSH和包管理器，加载依赖 DSH 的 `skills` 服务。禁用／卸载不删除手动安装的同名技能，本地同名来源可优先于本包 provider `mingzhang-sdd-bundle`。

The bundle is `mingzhang-sdd-dsh`; invoke `/mingzhang-sdd` after any requested profile restart. Local skills may override the bundled provider. Disabling or uninstalling the bundle does not remove manually installed skills.

## 原验证范围 / Historical verification scope

原 v0.4 的28份运行文件保持制作仓库冻结版本。历史验证在 DSH `0.2.0-rc.2`、Node `v24.15.0` 隔离 profile 覆盖原生管理器安装／加载／启停／卸载；不覆盖实际网页按钮、其他版本、模型行为或新版正文。旧 GitHub 来源检查曾超时，未进入安装，所以不把上述固定来源写成已复验通过。TGZ路径保留原本地包验证身份。

The original v0.4 package was checked through native-manager installation, loading, toggling and removal in an isolated DSH `0.2.0-rc.2` profile with Node `v24.15.0`. Those checks did not cover the web button, other versions, model behavior or the updated source. Historical GitHub-source checks timed out before installation; this pinned source has not been revalidated. The TGZ retains its original local-package verification scope.
