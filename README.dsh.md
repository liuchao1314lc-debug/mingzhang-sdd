# DSH 插件安装 / DSH plugin installation

下载 [v0.7.0 TGZ](https://github.com/liuchao1314lc-debug/mingzhang-sdd/raw/refs/heads/main/dist/mingzhang-sdd-dsh-0.7.0.tgz)，在 DSH 的 **插件 → 添加** 中填入该文件在 DSH 运行机器上的绝对路径，按提示重启 profile，使用 `/mingzhang-sdd`。不要填写 WorkBuddy ZIP 或技能源目录。

```bash
dsh plugin --profile web add /absolute/path/mingzhang-sdd-dsh-0.7.0.tgz
```

Use the absolute path of the local v0.7.0 TGZ in **Plugins → Add**. The bundle name remains `mingzhang-sdd-dsh`; its provider is `mingzhang-sdd-bundle`. The 29 runtime files match source commit `c36a9f90405b496a97ab450ad76588cbba07aaca`, plus four DSH wrapper files. The package contains the text-only skill; no legacy scripts are included.

v0.4、v0.6.0 与 v0.7.0 的 package name 和 provider id 相同，须在同一 profile 互斥安装：保留旧 TGZ，先移除旧组合包，再安装新版。回退同理；不要同时加载两份目录。项目／用户同名手动技能可覆盖组合包，须核实际来源。

The versions share the package name and provider id. Keep the old archive for rollback; remove the installed bundle before adding the other version. Do not register both directories in one profile. Manually installed local skills may override the bundle.

## 旧版固定入口 / Pinned legacy source

旧 v0.4 来源固定为：

```text
github:liuchao1314lc-debug/mingzhang-sdd#d85ebcb73b3f79fd25d0201c210266e602598395
```

[旧 v0.4 TGZ](https://github.com/liuchao1314lc-debug/mingzhang-sdd/raw/d85ebcb73b3f79fd25d0201c210266e602598395/dist/mingzhang-sdd-dsh-0.4.0.tgz)保留独立入口。公开 main 为更新后的技能源，不作为旧版组合包安装地址；新版制品使用带版本的独立文件名，不覆盖旧 TGZ。Legacy v0.4 remains at the pinned source and versioned archive; use neither `#main` nor a WorkBuddy ZIP to install that legacy bundle.

## 包身份与验证 / Artifact identity and verification

- TGZ: `mingzhang-sdd-dsh-0.7.0.tgz`，91,954 bytes；SHA-256：`7bdf6dd1622fa33f97aa4d6fee1be84b7f95addf6a9b3cf78756f8fb40fd0751`。
- 2026-10-31：DSH `0.2.1-rc.5`、Node `24.15.0`、pnpm `11.7.0`，临时 profile 按离线配置完成本地 TGZ 的原生 inspect、安装、Loader 注册、29 份资源逐字节核对、禁用／启用／移除，共 10 项检查。

组合包无第三方运行依赖或安装脚本，需要 Node.js 24 及宿主提供 `skills`。上述结果仅覆盖该本地 TGZ 与原生运行库；未操作用户现行 profile、网页按钮，未测其他 DSH 版本或模型行为，不改变原独立评价 `verification_fail`。Native checks cover an isolated temporary profile only; they do not establish UI installation, broader compatibility, model behavior, or whole-product evaluation success.
