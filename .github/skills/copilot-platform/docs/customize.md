
# Customization

AI models have broad general knowledge but don't know your codebase or team practices. Think of the AI as a skilled new team member: it writes great code, but doesn't know your conventions, architecture decisions, or preferred libraries. Customization is how you share that context, so responses match your coding standards, project structure, and workflows.

This article explains the different customization options and when to use each one. For step-by-step configuration, see the individual guides linked from each section.

<div class="docs-action" data-show-in-doc="false" data-show-in-sidebar="true" title="Get started with customizations">
Follow a hands-on tutorial to discover the customization options and configure them for your project.

* [Customization concepts](/docs/copilot/concepts/customization.md)

</div>

## Customization options at a glance

| Goal | Use | Example | When it activates |
|------|-----|---------|-------------------|
| Apply coding standards everywhere | [Always-on instructions](#custom-instructions) | Enforce ESLint rules, require JSDoc comments | Automatically included in every request |
| Different rules for different file types | [File-based instructions](#custom-instructions) | React patterns for `.tsx` files | When files match a pattern or description |
| Reusable task I run repeatedly | [Prompt files](#prompt-files) | Scaffold a React component | When you invoke a slash command |
| Package multi-step workflow with scripts | [Agent skills](#agent-skills) | Test, lint, and deploy pipeline | When the task matches the skill description |
| Specialized AI persona with tool restrictions | [Custom agents](#custom-agents) | Security reviewer, database admin | When you select it or another agent delegates to it |
| Connect to external APIs or databases | [MCP](#mcp) | Query a PostgreSQL database | When the task matches a tool description |
| Automate tasks at agent lifecycle points | [Hooks](#hooks) | Run formatter after every file edit | When the agent reaches a matching lifecycle event |
| Install pre-packaged customizations | [Agent plugins](#agent-plugins) | Install a community testing plugin | When you install a plugin |

Start with custom instructions for project-wide standards. Add prompt files when you have repeatable tasks. Use MCP when you need external data. Create custom agents for specialized personas. You can combine multiple customization types as your needs grow.

## Custom instructions

Custom instructions are Markdown files that define coding standards and project context. The AI includes them automatically in chat requests, so you don't need to repeat rules in every prompt. Instructions are the simplest customization to set up and the best place to start.

There are two types:

* **Always-on instructions**: project-wide rules defined in `.github/copilot-instructions.md` that apply to every request. Use these for conventions the whole team follows, like code style, naming patterns, or preferred libraries.
* **File-based instructions**: guidelines in `.instructions.md` files that apply based on file path patterns or task descriptions. Use these when different parts of your codebase need different rules, such as React patterns for `.tsx` files or API conventions for your backend.

Learn more about [creating custom instructions](/docs/copilot/customization/custom-instructions.md).

## Prompt files

Prompt files are reusable Markdown files that encode a specific task and appear as slash commands in chat. When you find yourself typing the same kind of prompt repeatedly, a prompt file turns it into a one-step command. Each prompt file can reference specific files, tools, and context to give the AI everything it needs for that task.

Prompt files are useful for tasks like scaffolding a new component, generating test cases for a module, or preparing a pull request description.

Learn more about [creating prompt files](/docs/copilot/customization/prompt-files.md).

## Agent skills

Agent skills package multi-step capabilities as folders containing instructions, scripts, and resources. Unlike prompt files, which provide a single prompt, skills give the AI a complete toolkit for a domain-specific task such as generating API documentation, running security audits, or performing database migrations.

Skills load on demand when the task matches their description. They are built on an [open standard](https://agentskills.io), so the same skill works across different agent types.

Learn more about [creating agent skills](/docs/copilot/customization/agent-skills.md).

## Custom agents

Custom agents give the AI a specific persona and constrained set of tools for a particular role. For example, a security reviewer agent only has access to code analysis tools and follows security-focused instructions, while a database admin agent connects to your database through MCP and follows your schema conventions.

Each agent is defined in a `.agent.md` file that specifies its behavior, available tools, and language model preferences. Agents can also delegate to other agents, which enables multi-step workflows where different specialists handle different parts of a task.

Learn more about [creating custom agents](/docs/copilot/customization/custom-agents.md).

## MCP

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/) is an open standard for connecting the AI to external tools and data sources. Without MCP, the AI can only work with code and the terminal. MCP servers extend its reach by providing [tools](/docs/copilot/concepts/tools.md) that query databases, call APIs, interact with cloud services, or access any other external system.

MCP servers run locally or remotely and can also provide resources, prompts, and interactive apps.

Learn more about [adding and managing MCP servers](/docs/copilot/customization/mcp-servers.md).

## Hooks

Hooks run custom shell commands at specific points during an agent session. While instructions and prompts guide what the AI does, hooks guarantee that your code runs at defined lifecycle points. This makes hooks the right choice when you need deterministic outcomes, such as running a formatter after every file edit, blocking commits that fail a lint check, or logging every tool invocation for an audit trail.

Learn more about [configuring hooks](/docs/copilot/customization/hooks.md).

## Agent plugins

Agent plugins are pre-packaged bundles of customizations you discover and install from plugin marketplaces. Instead of building everything yourself, you can install a plugin that provides a ready-made combination of slash commands, skills, custom agents, hooks, and MCP servers. Plugins are useful for adopting community best practices or sharing internal tooling across teams.

> [!NOTE]
> Agent plugins are currently in preview.

Learn more about [agent plugins](/docs/copilot/customization/agent-plugins.md).

## Related resources

* [Get started with customization](/docs/copilot/customization/overview.md)
* [Agents](/docs/copilot/concepts/agents.md)
* [Tools](/docs/copilot/concepts/tools.md)


# Customize AI in Visual Studio Code

Visual Studio Code gives you several ways to teach the AI about your codebase, coding standards, and workflows. This article introduces the customization options and helps you get started.

<div class="docs-action" data-show-in-doc="true" data-show-in-sidebar="true" title="Core concepts">
Learn about the different customization types and when to use each one.

* [Customization concepts](/docs/copilot/concepts/customization.md)

</div>

<div class="docs-action" data-show-in-doc="false" data-show-in-sidebar="true" title="Tutorial">
Follow a hands-on walkthrough to customize AI for your project.

* [Customize AI for your project](/docs/copilot/guides/customize-copilot-guide.md)

</div>

To access customizations, select the **Configure Chat (gear icon)** in the Chat view to open the [Chat Customizations editor](#chat-customizations-editor).

![Screenshot of the Chat Customizations editor, showing the sidebar with customization categories and the main view listing custom agents.](../images/customization/chat-customizations-editor.png)

## Customization scenarios

The following sections describe common customization scenarios and which options to use for each one.

### Define coding standards

Use [custom instructions](/docs/copilot/customization/custom-instructions.md) to share project-wide rules and conventions with the AI. Always-on instructions apply to every request, while file-based instructions target specific file types or folders. For example, enforce ESLint rules across all files and apply React patterns only in `.tsx` files.

### Automate tasks and workflows

Create [prompt files](/docs/copilot/customization/prompt-files.md) for repeatable tasks you run often, like scaffolding a component or preparing a pull request.

For more complex multi-step workflows that involve scripts and external tools, package them as [agent skills](/docs/copilot/customization/agent-skills.md).

### Specialize the AI

Create [custom agents](/docs/copilot/customization/custom-agents.md) that adopt specific personas, such as security reviewer, database admin, or planner. Each agent defines its own behavior, available tools, and language model preferences. Choose different [language models](/docs/copilot/customization/language-models.md) for different tasks, or bring your own API key to access additional models.

### Discover and install plugins

Install [agent plugins](/docs/copilot/customization/agent-plugins.md) (preview) to add pre-packaged bundles of customizations from plugin marketplaces. A single plugin can provide slash commands, skills, custom agents, hooks, and MCP servers.

### Connect external tools and data

Add [MCP servers](/docs/copilot/customization/mcp-servers.md) to give the AI access to databases, APIs, and other services through the [Model Context Protocol](https://modelcontextprotocol.io/). Use [hooks](/docs/copilot/customization/hooks.md) to run shell commands at key lifecycle points, such as running a formatter after every file edit or enforcing security policies.

## Get started

Implement AI customizations incrementally. Start with the basics and add more as needed. For a hands-on walkthrough, see the [Customize AI for your project](/docs/copilot/guides/customize-copilot-guide.md) guide.

1. **Initialize your project**: type `/init` in chat to generate a `.github/copilot-instructions.md` file with coding standards tailored to your codebase.

1. **Add targeted rules**: create file-based `*.instructions.md` files for specific parts of your codebase, such as language conventions or framework patterns.

1. **Automate repetitive tasks**: create prompt files for common workflows and add MCP servers to connect external services.

1. **Create specialized workflows**: build custom agents for specific roles. Package reusable capabilities as agent skills to share across tools.

1. **Generate customizations with AI**: type `/create-prompt`, `/create-instruction`, `/create-skill`, `/create-agent`, or `/create-hook` in chat to generate customization files with AI assistance.

## Parent repository discovery

In monorepo setups, you might open a subfolder of a repository in VS Code rather than the repo root. By default, Visual Studio Code only discovers customization files within your open workspace folder(s). Enable the `setting(chat.useCustomizationsInParentRepositories)` setting to also discover customizations from the parent repository.

When this setting is enabled, VS Code walks up the folder hierarchy from each workspace folder until it finds a `.git` folder. If found, it collects customizations from all folders between the workspace folder and the repository root (inclusive). This applies to all customization types: always-on instructions (`copilot-instructions.md`, `AGENTS.md`, `CLAUDE.md`), file-based instructions, prompt files, custom agents, agent skills, and hooks.

For example, consider the following monorepo structure:

```text
my-monorepo/              # repo root (has .git folder)
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   │   └── style.instructions.md
│   ├── prompts/
│   │   └── review.prompt.md
│   └── agents/
│       └── reviewer.agent.md
├── packages/
│   └── frontend/          # opened as workspace folder
│       └── src/
```

If you open only `packages/frontend/` in VS Code and enable the setting, VS Code discovers the customization files at the repo root, such as `copilot-instructions.md`, `style.instructions.md`, `review.prompt.md`, and `reviewer.agent.md`.

Conditions for parent repository discovery:

* The workspace folder does not contain a `.git` folder (it is not itself a repository root).
* A parent folder contains a `.git` folder.
* The parent repository folder is [trusted](/docs/editing/workspaces/workspace-trust.md). VS Code prompts you to trust the parent folder when the workspace is opened.

> [!NOTE]
> The `setting(chat.useCustomizationsInParentRepositories)` setting is disabled by default.

## Chat Customizations editor

> [!NOTE]
> The Chat Customizations editor is currently in preview.

The Chat Customizations editor provides a centralized UI for creating and managing all your chat customizations in one place. The editor organizes the different customization types into separate tabs and provides an embedded code editor for editing customization files with syntax highlighting and validation.

You can create new customizations from scratch by editing the corresponding Markdown, or use AI to generate initial content based on your specific project.

To add MCP servers and agent plugins, you can browse the corresponding marketplace directly from the editor, install new items, and manage existing ones.

![Screenshot of the Chat Customizations editor, showing the sidebar with customization categories and the main view listing custom agents.](../images/customization/chat-customizations-editor.png)

To open the Chat Customizations editor, select the **Configure Chat (gear icon)** in the Chat view or run **Chat: Open Chat Customizations** from the Command Palette (`kb(workbench.action.showCommands)`).

You can configure customization for different [agent types](/docs/copilot/agents/overview.md#types-of-agents): local agents, Copilot CLI, and the Claude agent. Select the agent type from the dropdown at the top of the editor to view and manage customizations for that agent type.

## Troubleshoot customization issues

If your customizations aren't being applied or cause unexpected behavior, select the ellipsis (**...**) menu in the Chat view and select **Show Agent Debug Logs** to [troubleshoot agent issues](/docs/copilot/troubleshooting.md).

## Related resources

* [Customization concepts](/docs/copilot/concepts/customization.md)
* [Customize AI for your project guide](/docs/copilot/guides/customize-copilot-guide.md)
