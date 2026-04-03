---
title: 'Claude Code 使用指南：从入门到高效开发'
description: '全面介绍 Anthropic Claude Code 的安装、配置、常用命令与高级功能，帮助你用 AI 提升开发效率'
date: 2026-04-03
showTableOfContents: true
tags:
    - AI
    - 工具
    - Claude
---

## 什么是 Claude Code

Claude Code 是 Anthropic 推出的 AI 编程助手，以 CLI 为核心，能读懂你的整个代码仓库、编辑文件、执行命令，并深度集成到你的开发工作流中。它不只是一个聊天工具，而是一个**真正的 Agent**——能自主完成多步骤编码任务。

## 安装

### 系统要求

- Node.js 18 或更高版本（npm 安装方式）
- Git（Windows 用户需安装 Git for Windows）

### 安装方式

**原生安装（推荐）：**

```bash
# macOS / Linux / WSL
curl -fsSL https://claude.ai/install.sh | bash

# Windows PowerShell
irm https://claude.ai/install.ps1 | iex
```

**Homebrew（macOS）：**

```bash
brew install --cask claude-code
```

**WinGet（Windows）：**

```bash
winget install Anthropic.ClaudeCode
```

**npm 全局安装：**

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后，在任意项目目录运行 `claude` 即可启动，首次使用会提示登录。

## 订阅计划

| 计划 | 价格 | 适合场景 |
|------|------|----------|
| Pro | $20/月 | 中等编码强度，日常开发辅助 |
| Max 5x | $100/月 | 重度编码，需频繁使用 Opus 模型 |
| Max 20x | $200/月 | 近乎自主的多 Agent 并行开发 |

也可使用 API 按量付费（Anthropic Console 获取 API Key）。

## 基础命令

### 启动方式

```bash
# 交互式会话（REPL）
claude

# 带初始提问启动
claude "解释这个项目的架构"

# 单次查询后退出（适合脚本调用）
claude -p "review this code"

# 管道输入
cat logs.txt | claude -p "分析这些错误"

# 继续最近的对话
claude -c

# 恢复指定会话
claude -r "session-id" "继续上次的工作"
```

### 会话内的斜杠命令

在交互式会话中，可以使用以下命令：

| 命令 | 说明 |
|------|------|
| `/help` | 显示所有可用命令 |
| `/compact` | 压缩上下文，节省 token |
| `/config` | 交互式配置设置 |
| `/model` | 切换 Claude 模型 |
| `/agents` | 管理子 Agent |
| `/mcp` | 管理 MCP 服务器 |
| `/vim` | 启用 vim 编辑模式 |
| `/clear` | 清除当前会话 |
| `/voice` | 语音输入模式 |
| `/plan` | 结构化规划模式 |

### 文件引用

用 `@` 符号在提示中引用文件或目录：

```bash
# 引用单个文件
> 审查这个组件的代码 @./src/components/Button.tsx

# 引用整个目录
> 为所有 API 路由添加错误处理 @./src/api/

# 引用多个文件
> 比较这两个实现 @./src/old.js @./src/new.js

# 通配符
> 审查所有测试文件 @./src/**/*.test.ts
```

### 执行 Shell 命令

用 `!` 前缀直接在会话中运行 shell 命令：

```bash
> !npm test

# 进入 shell 模式（再输一次 ! 退出）
> !
```

## 模型选择

Claude Code 提供三个核心模型：

| 模型 | 特点 | 适用场景 |
|------|------|----------|
| **Sonnet** | 性能均衡，响应快 | 日常编码，大多数任务 |
| **Haiku** | 最快最省 token | 简单查询，批量处理 |
| **Opus** | 最强推理能力 | 复杂架构设计，多步骤规划 |

切换模型：

```bash
# 会话内切换
/model

# 命令行指定
claude --model claude-opus-4
```

## 配置体系

### 设置文件（分层继承）

| 文件 | 作用域 |
|------|--------|
| `~/.claude/settings.json` | 全局（所有项目） |
| `.claude/settings.json` | 项目级（可提交到 git） |
| `.claude/settings.local.json` | 项目级（个人，不提交） |

### CLAUDE.md 记忆文件

用 Markdown 文件给 Claude 提供项目上下文和指令：

| 文件 | 作用域 |
|------|--------|
| `~/.claude/CLAUDE.md` | 全局指令 |
| `./CLAUDE.md` | 项目级指令 |
| `./src/CLAUDE.md` | 子目录级指令 |

示例 CLAUDE.md：

```markdown
# 项目规范
- 所有新代码使用 TypeScript
- 遵循现有的 ESLint 配置
- React 组件使用函数式组件 + Hooks
- 测试文件放在源文件旁边，命名为 .test.ts
```

### 权限配置

```json
{
  "permissions": {
    "allowedTools": [
      "Read",
      "Write(src/**)",
      "Bash(git *)",
      "Bash(npm *)"
    ],
    "deny": [
      "Read(.env*)",
      "Write(production.config.*)",
      "Bash(rm *)"
    ]
  }
}
```

## 高级功能

### 自定义斜杠命令

在 `.claude/commands/` 目录下创建 `.md` 文件，自动注册为斜杠命令：

```bash
mkdir -p .claude/commands
echo "分析这段代码的性能问题并提出优化建议" > .claude/commands/optimize.md
```

支持参数化：

```markdown
<!-- .claude/commands/fix-issue.md -->
按照我们的编码规范修复 issue #$ARGUMENTS
```

使用：`/fix-issue 123`

### 子 Agent（Subagents）

为特定任务创建专业化的 Agent 实例：

```bash
> /agents
# 按提示定义名称、描述、模型和人设
```

配置示例（`.claude/agents/reviewer.md`）：

```markdown
---
name: reviewer
description: 用于代码审查
model: sonnet
---
你是一个专业的代码审查员。重点关注安全性、性能和可维护性。
```

### Hooks 自动化

在特定事件触发时自动执行 shell 命令：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write(*.py)",
        "hooks": [
          {
            "type": "command",
            "command": "python -m black \"$file\""
          }
        ]
      }
    ]
  }
}
```

可用事件：`PreToolUse`、`PostToolUse`、`UserPromptSubmit`、`SessionStart`

### MCP 服务器扩展

通过 Model Context Protocol 扩展 Claude Code 的能力：

```bash
# 添加 MCP 服务器
claude mcp add my-server -e API_KEY=123 -- /path/to/server arg1 arg2
```

常见用途：连接 Google Drive、Jira、数据库等外部工具。

### 扩展思考（Extended Thinking）

默认开启，让 Claude 在编码前进行深度推理：

- **切换思考模式**：`Alt+T`（Windows/Linux）或 `Option+T`（macOS）
- **查看思考过程**：`Ctrl+O` 开启详细模式
- **限制思考 token**：`export MAX_THINKING_TOKENS=10000`

## 常见工作流

### 代码分析

```bash
> 分析这个代码仓库的结构并提出改进建议 @./src/
```

### 功能开发

```bash
> 实现一个带 JWT 令牌和密码哈希的用户认证系统
```

### Bug 修复

```bash
> 调试这个错误："TypeError: Cannot read property 'id' of undefined" @./src/user-service.js
```

### 测试生成

```bash
> 为这个模块生成完整的单元测试 @./src/utils/validation.js
```

### CI/CD 集成

```bash
claude -p "如果有 linting 错误，修复它们并给出 commit 建议"
```

## 多平台支持

Claude Code 不只是终端工具，它覆盖了多个开发环境：

| 平台 | 特点 |
|------|------|
| **终端 CLI** | 全功能，最灵活 |
| **VS Code 扩展** | 内联 diff、@ 引用、对话历史 |
| **JetBrains 插件** | IntelliJ/PyCharm/WebStorm 集成 |
| **桌面应用** | 可视化 diff、多会话并行 |
| **Web（claude.ai/code）** | 无需本地安装，支持移动端 |

所有平台共享相同的 CLAUDE.md、设置和 MCP 配置。

## 最佳实践

1. **提供充分的上下文** — 具体的指令比模糊的描述效果好得多
2. **不同任务用不同会话** — 更省 token，输出质量更高
3. **善用 CLAUDE.md** — 把常用规范写进去，避免每次重复说明
4. **审查后再接受** — 养成检查代码变更的习惯
5. **用 hooks 自动格式化** — 让代码风格保持一致
6. **敏感数据放 .env** — 在权限中拒绝 Claude 读取

## 总结

Claude Code 是目前最强大的 AI 编程 Agent 之一。它不仅能写代码，更能理解整个项目上下文、自主执行多步骤任务、与你的开发工具链深度集成。掌握本文提到的命令和工作流，能显著提升你的开发效率。

---

**参考资源：**
- [Claude Code 官方文档](https://code.claude.com/docs/en/overview)
- 在会话中输入 `/help` 查看完整命令列表
