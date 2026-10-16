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
  <img alt="Version v0.4" src="https://img.shields.io/badge/version-v0.4-2563eb?style=flat-square">
  <img alt="Ten-stage workflow" src="https://img.shields.io/badge/workflow-10_stages-0f766e?style=flat-square">
  <img alt="Local tools require Node.js 24.x" src="https://img.shields.io/badge/local_tools-Node.js_24.x-334155?style=flat-square">
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
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
├── rules/               Shared behavior, execution, and requirement rules
├── references/          Check contracts, collection, and sources
├── scripts/             Local checking and collection programs
└── assets/
    ├── templates/       Requirement record and PRD outlines
    └── readme/          Images for this overview
```

| To learn about | Read |
| :--- | :--- |
| Method selection and scope | [Skill entry point](SKILL.md) · [Action and fact boundaries](rules/core.md) |
| Recording, confirming, and changing requirements | [Requirement rules](rules/requirements.md) |
| Running local programs | [Program guide](scripts/README.md) · [Check contract](references/check-contract.md) |
| Collecting file actions and evidence | [Collection guide](references/collection.md) |
| Method origins and adaptation choices | [Sources](references/sources.md) |

### Local helper programs

The written guidance requires a host agent that can read the skill and project materials. Local programs use the **Node.js 24.x standard library, with no third-party npm dependencies**. The collector also requires Git.

```bash
node /your/path/mingzhang-sdd/scripts/check-task.mjs --help
```

`check-task.mjs` checks deterministic conditions for objects, sets of changes, and evidence. `collect-task.mjs` supports observation and collection of fixed file actions. Its `action` mode **actually writes files**, so check the target project's write authorization before using it. See the program guide for protocols, supported formats, and limitations.

This skill guides an agent through instructions. It cannot replace host permission controls, and program results must be assessed against the actual business requirements.

<a id="validation"></a>
## Version and validation

The current public snapshot is **v0.4**. The development project owner has approved the development and integration testing stages. Existing **`verification_pass` evidence is limited to one continuous simulated case**. It does not establish validation of the complete package, cross-tool support, long-term stability, or real user benefits.

<details>
<summary><strong>Frozen source, environment, and retained limitations</strong></summary>

The 28 runtime files were copied byte for byte from this frozen commit in the development repository:

```text
9ba51578cc3e56a80f95a49332ba52588ae64bdb
```

This hash identifies the source in the development repository; it is not a commit in this distribution repository. Public-facing additions include the README files and banner. Runtime instructions remain frozen. Statements such as “not published” in those instructions retain their historical meaning at packaging time; this overview describes the public snapshot.

Three limitations remain:

- `runs_per_configuration=1`; a single run without a control does not demonstrate stability.
- D-03 failures midway through execution, rollback, and power loss were not verified.
- The CLI default-permission branch, non-string `text`, and invalid API path branches were not executed in this round.

Here, D-03 refers to the direct-overwrite approach in the simulated note-taking case. Real user convenience benefits and the quantitative targets in Section 6.2 of the development project's MRD remain unverified. The recorded local program test environment was macOS with Node v24.15.0. Other hosts and platforms require separate verification.

</details>

## Sources and licensing

See [Sources](references/sources.md) for method origins, adaptation choices, and scope. This repository has not adopted a unified open-source license; existing source and licensing notes are retained.

---

<p align="center"><strong>Start with the current task. Give every step a basis, a deliverable, and a check.</strong><br>
<a href="SKILL.md">Read the skill entry point →</a></p>
