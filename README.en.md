<p align="center">
  <a href="README.md"><img alt="简体中文" src="https://img.shields.io/badge/%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87-475569?style=for-the-badge"></a>
  <a href="README.en.md"><img alt="English (current)" src="https://img.shields.io/badge/English-2563eb?style=for-the-badge"></a>
</p>

<p align="center">
  <img src="assets/readme/banner.svg" alt="mingzhang-sdd — From intent to verified delivery" width="100%">
</p>

<h1 align="center">mingzhang-sdd</h1>

<p align="center"><strong>Clarify the idea. Connect the specifications. Verify the result.</strong></p>
<p align="center">An SDD skill for working with AI coding agents · From requirements to development, integration testing, and iteration</p>

<p align="center">
  <img alt="v0.7.0 skill source" src="https://img.shields.io/badge/source-v0.7.0-2563eb?style=flat-square">
  <img alt="Ten-stage workflow" src="https://img.shields.io/badge/workflow-10_stages-0f766e?style=flat-square">
  <img alt="29 text resources" src="https://img.shields.io/badge/resources-29_text_files-334155?style=flat-square">
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#zcode-plugin">ZCode plugin</a> ·
  <a href="#dsh-plugin">DSH plugin</a> ·
  <a href="#workflow">Ten-stage workflow</a> ·
  <a href="#inside">Resources</a> ·
  <a href="#validation">Version &amp; validation</a>
</p>

---

When you work with AI on a product, the decisions need to stay connected: **why you are building it, what it should do, how to implement it, and how to know it works.**

mingzhang-sdd organizes this work into stage-specific methods that an agent can read as needed. It helps the agent clarify requirements, carry forward existing decisions, produce deliverables, and check results, while the user confirms important tradeoffs. A new project can start with preparation; an existing project can resume from its current stage.

This overview is available in English. The linked skill instructions and supporting resources are currently in Chinese.

## What it helps you do

| Your current task | How the skill supports it |
| :--- | :--- |
| **Clarify an idea** | Explore the problem, goals, value, and scope. Record confirmed requirements as they emerge, then prepare an MRD or PRD. |
| **Turn specifications into design** | Connect architecture, modules, components, and interaction design, including responsibilities, interfaces, exceptions, and acceptance criteria. |
| **Continue an existing project** | Check the effective deliverables, current state, and permitted scope, then select the appropriate stage method. |
| **Organize development packages** | Define package boundaries, dependency routes, and concurrency conditions; use sequential interleaving when the host cannot run in parallel. |
| **Carry files and versions forward** | Identify document responsibilities, authoritative information, superseded history, cross-stage baselines, and source/artifact identities. |
| **Check and accept an implementation** | Develop authorized features and record actual verification. Report program results, user acceptance, and release decisions separately. |
| **Turn feedback into next steps** | Analyze the source and impact, propose tradeoffs, and return to the relevant stage within the confirmed scope. |

Every stage answers three questions: **What is this stage? What does it do? How should it be done?** Methods are selected for the current task, and the user confirms key decisions.

<a id="quick-start"></a>
## Quick start

### 1. Get the skill

```bash
git clone https://github.com/liuchao1314lc-debug/mingzhang-sdd.git
```

You can also use **Code → Download ZIP** on this repository. Keep the full directory structure. The entry point is [SKILL.md](SKILL.md).

### 2. Use it in your project

Replace the placeholders below with real **absolute paths**, then send this request to an agent that can read local files:

```text
Read and use <absolute-path-to-skill-repository>/SKILL.md.
Target project: <absolute-path-to-target-project>.
Current task: perform a read-only review of the project state,
effective deliverables, and current stage. Explain gaps and suggest next steps.
Permitted scope: read-only. Do not modify files, install anything,
run tests, or call external services.
```

The skill directory contains methods; the target project directory contains your product deliverables. Existing projects resume from their actual stage, and subsequent actions follow the target project's valid authorization.

For native skill discovery, place the full skill directory in a location supported by your host and check that it is actually discovered and loaded. **The explicit reading approach above lets you check the entry point first. Installation and behavior support must be verified for each host.**

<a id="zcode-plugin"></a>
## ZCode plugin installation

Open a workspace in ZCode, then choose **Settings → Plugins → Create → Add marketplace** and enter:

```text
https://github.com/liuchao1314lc-debug/mingzhang-sdd.git
```

Under the personal **mingzhang-sdd-marketplace** source, install and enable **mingzhang-sdd (v0.7.0)**. Check its source under **Settings → Skills → Plugin skills**, then invoke `$mingzhang-sdd` or select it from the slash menu's Skills group.

If an earlier attempt reported `Marketplace manifest not found`, refresh the source or remove the failed entry and add the URL again. Check the selected source if a user-level skill shares the same name. This source uses ZCode marketplace/plugin manifests; the DSH TGZ uses the separate entry below.

<a id="dsh-plugin"></a>
## DSH plugin installation

[Download the v0.7.0 package](https://github.com/liuchao1314lc-debug/mingzhang-sdd/raw/refs/heads/main/dist/mingzhang-sdd-dsh-0.7.0.tgz) and enter the file's actual absolute path on the DSH machine under **Plugins → Add**. Restart the relevant profile if prompted, then invoke `/mingzhang-sdd`.

The bundle is `mingzhang-sdd-dsh`; the skill remains `mingzhang-sdd`. Remove an older bundle from the same profile before adding this version, and check the source of any manually installed skill with the same name. Main is the skill-source and ZCode-marketplace entry; use the TGZ above for DSH.

[Installation details](README.dsh.md) · [Version and verification record](VERIFICATION.md). The [legacy v0.4.0 TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz) remains available for rollback.

<details>
<summary><strong>Example: review whether the design covers an existing PRD</strong></summary>

```text
Use mingzhang-sdd to read the confirmed PRD and existing architecture documents.
This is a read-only review: check whether the design covers the main workflow,
key exceptions, and acceptance requirements.
List specific gaps, supporting evidence, and their impact.
Do not modify documents or begin development.
```

</details>

<details>
<summary><strong>Example: implement an already defined feature</strong></summary>

```text
Use mingzhang-sdd to continue the currently approved feature task.
First check the effective specifications, existing implementation,
and permitted changes. Explain the implementation and verification steps.
Complete the implementation, necessary verification, and results report
within the current authorization. Bring new scope or key tradeoffs to me.
```

Adapt these examples to the target project's actual task and permissions. The examples themselves do not authorize file writes or external actions.

</details>

<a id="workflow"></a>
## Ten-stage workflow

**Preparation &amp; requirements → Design &amp; decomposition → Implementation &amp; verification → Feedback &amp; iteration**

| Stage | Core question | Method |
| :--- | :--- | :--- |
| 01 · Preparation | Where are we, and what is the current task? | [Start or resume](skills/startup.md) |
| 02 · MRD | Why build this, and whose problem does it solve? | [Market and requirements](skills/mrd.md) |
| 03 · PRD | How should the product behave, and what counts as meeting requirements? | [Product specifications](skills/prd.md) |
| 04 · Architecture | How is the system organized, and what are the key tradeoffs? | [System architecture](skills/architecture.md) |
| 05 · Modules | What does each part own, and how do the parts work together? | [Module design](skills/module.md) |
| 06 · Components | What are the unit's interfaces, states, and exceptions? | [Component design](skills/component.md) |
| 07 · UI | How does the user act, and how does the system respond? | [Interaction design](skills/ui.md) |
| 08 · Development | How do we implement approved specifications and verify locally? | [Feature development](skills/development.md) |
| 09 · Integration testing | What evidence supports system behavior and user acceptance? | [Integration and delivery](skills/integration-testing.md) |
| 10 · Iteration | What does the feedback mean, and what should change next? | [Feedback and iteration](skills/iteration.md) |

The steps depend on the current task, effective inputs, and user decisions. Projects do not have to repeat all ten stages from the beginning.

<a id="inside"></a>
## Resources

```text
mingzhang-sdd/
├── SKILL.md             Entry point and method selection
├── skills/              Complete methods for ten stages
├── rules/               Shared execution, requirements and evaluation rules
├── references/          Stage organization, governance, checking and sources
├── assets/
│   ├── templates/       Requirement record, MRD, PRD and handoff outlines
│   └── readme/          Images for this overview
├── marketplace.json     ZCode marketplace entry
├── plugins/             ZCode plugin and skill copy
└── dist/                DSH packages, including the retained legacy version
```

| To learn about | Read |
| :--- | :--- |
| Method selection and scope | [Skill entry point](SKILL.md) · [Action and fact boundaries](rules/core.md) |
| Recording, confirming and changing requirements | [Requirement rules](rules/requirements.md) |
| Tools, actual returns and checks | [Tool use and checking](references/checking.md) |
| Stage transitions and concise/formal handoffs | [Stage methods](references/stage-methods.md) |
| Connecting requirements and deliverables | [Requirement traceability](references/traceability.md) |
| Project files, information and versions | [Project governance](references/project-governance.md) |
| Arranging an independent evaluation | [Independent testing rules](rules/independent-testing.md) |
| Organizing documents | [Requirement record](assets/templates/requirements-record.md) · [MRD](assets/templates/mrd.md) · [PRD](assets/templates/prd.md) · [Handoff](assets/templates/handoff.md) |
| Method origins and adaptation choices | [Sources](references/sources.md) |

### Runtime

Version 0.7.0 contains **29 text resources: methods, rules, references and templates**. It uses the host agent's existing file, tool and permission capabilities. The skill source contains no local collection/checking scripts and does not require Node.js. The DSH adapter runs in DSH's environment. Legacy programs and packages remain recoverable through Git history and the old TGZ.

<a id="validation"></a>
## Version and validation

The current source is **v0.7.0, 29 files / 1,564 lines**, copied byte for byte from the development repository's fixed object `c36a9f90405b496a97ab450ad76588cbba07aaca:skills/mingzhang-sdd/`. The root skill, ZCode skill copy and DSH package share this source. The development commit is not a commit in this public repository; pin the public commit you adopt.

This version includes contract and handoff corrections, checks selected by impact, entry-point deduplication and task-based reading of governance, examples and history. The latest internal collaborative F05 targeted review passed **3/3 trials and 18/18 assertions**, closing only that fixed object's F05 remediation item. The earlier formal independent result remains **`verification_fail`**. With no control group, these results do not establish whole-product acceptance or cost/quality improvement.

| Object | Access and checks |
| :--- | :--- |
| Skill source | [SKILL.md](SKILL.md) and its resources, 29 files; checked byte for byte against the fixed source |
| ZCode plugin | Root [marketplace.json](marketplace.json) → `plugins/mingzhang-sdd`, v0.7.0; static manifest, path and copy checks, without a UI installation test |
| DSH plugin | [v0.7.0 TGZ](dist/mingzhang-sdd-dsh-0.7.0.tgz); native installation, loading, resource reading, toggling and removal passed in a temporary DSH `0.2.1-rc.5` profile, without testing the web button or model behavior |
| Historical versions | [Original v0.4.0 TGZ](dist/mingzhang-sdd-dsh-0.4.0.tgz) and Git history retained; old results stay bound to their original objects |
| Existing installations | Update through the host and check the actual selected source after this GitHub update |

See the [version and verification record](VERIFICATION.md) for fixed identities and check details.

<details>
<summary><strong>Historical v0.4 verification scope and retained limitations</strong></summary>

The old v0.4 runtime files came from development freeze `9ba51578cc3e56a80f95a49332ba52588ae64bdb`. The existing DSH TGZ remains the original 83,615-byte object. That frozen-byte claim does not describe the updated source on main. The complete old public tree remains available at its [fixed commit](https://github.com/liuchao1314lc-debug/mingzhang-sdd/tree/d85ebcb73b3f79fd25d0201c210266e602598395).

The project owner previously approved the development and integration testing stages. Historical `verification_pass` evidence covers one continuous simulated case and does not extend automatically to these new instructions. Three limitations remain:

- `runs_per_configuration=1`; a single run without a control does not demonstrate stability.
- D-03 failures midway through execution, rollback and power loss were not verified.
- The CLI default-permission branch, non-string `text` and invalid API path branches were not executed in that round.

D-03 refers to direct overwrite in the simulated note-taking case. Real convenience benefits, MRD section 6.2 quantitative targets, complete-package acceptance, cross-tool support and stability remain unverified. The recorded historical local program environment was macOS with Node v24.15.0.

</details>

## Sources and licensing

See [Sources](references/sources.md) for method origins, adaptation choices, and scope. This repository has not adopted a unified open-source license; existing source and licensing notes are retained.

---

<p align="center"><strong>Start with the current task. Give every step a basis, a deliverable, and a check.</strong><br>
<a href="SKILL.md">Read the skill entry point →</a></p>
