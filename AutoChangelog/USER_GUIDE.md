# AutoChangelog User Guide

Complete guide to using AutoChangelog for generating automated changelogs from your Git repositories.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Connecting Repositories](#connecting-repositories)
3. [Understanding Commit Classification](#understanding-commit-classification)
4. [Creating Releases](#creating-releases)
5. [Publishing Changelogs](#publishing-changelogs)
6. [API Usage](#api-usage)
7. [Best Practices](#best-practices)

---

## Getting Started

### Sign In

1. Navigate to `http://localhost:3000`
2. Click "Sign in with GitHub"
3. Authorize AutoChangelog to access your repositories
4. You'll be redirected to your dashboard

### Dashboard Overview

After signing in, you'll see:
- List of connected repositories
- Recent releases
- Quick actions to add new repositories

---

## Connecting Repositories

### Add a New Repository

1. Click "Connect Repository" button
2. Select a repository from your GitHub account
3. Grant necessary permissions (read commits, tags, PRs)
4. Click "Connect"

The system will automatically:
- Fetch all commits from the repository
- Classify commits based on their messages
- Detect existing tags/releases

### Repository Settings

For each connected repository, you can configure:
- **Default Branch**: Which branch to track (default: `main`)
- **Auto-sync**: Automatically fetch new commits
- **Webhook**: Enable real-time updates when you push

---

## Understanding Commit Classification

AutoChangelog automatically categorizes commits based on conventional commit prefixes:

### Supported Categories

| Prefix | Category | Description | Example |
|--------|----------|-------------|---------|
| `feat:` | Feature | New features | `feat: add user authentication` |
| `fix:` | Bug Fix | Bug fixes | `fix: resolve login issue` |
| `perf:` | Performance | Performance improvements | `perf: optimize database queries` |
| `docs:` | Documentation | Documentation changes | `docs: update API guide` |
| `refactor:` | Refactor | Code refactoring | `refactor: simplify auth logic` |
| `chore:` | Chore | Maintenance tasks | `chore: update dependencies` |

### Writing Good Commit Messages

For best results, follow this format:

```
<type>: <short description>

<optional longer description>
```

**Examples:**

✅ Good:
```
feat: add password reset functionality
fix: prevent duplicate email registrations
perf: cache user sessions in Redis
```

❌ Bad:
```
updated stuff
fixed bug
changes
```

---

## Creating Releases

### Automatic Release Detection

AutoChangelog automatically detects releases from:
- Git tags (e.g., `v1.0.0`, `1.2.3`)
- GitHub Releases

### Manual Release Creation

1. Go to your repository page
2. Click "Create Release"
3. Fill in the details:
   - **Version**: e.g., `1.0.0`
   - **Title**: e.g., "Major Update"
   - **Date Range**: Select commits to include
4. Review categorized commits
5. Click "Generate Release Notes"

### Release Builder Features

The release builder will:
- Group commits by category
- Generate a structured changelog
- Allow you to edit descriptions
- Preview the public changelog

### Editing Release Notes

Before publishing, you can:
- Reorder commits
- Edit commit descriptions
- Add custom notes
- Exclude certain commits
- Add breaking changes section

---

## Publishing Changelogs

### Public Changelog Page

Each repository gets a unique public URL:

```
http://localhost:3000/changelog/[owner]/[repo-name]
```

Example: `http://localhost:3000/changelog/johndoe/my-app`

### Publishing a Release

1. Create or edit a release
2. Review the generated changelog
3. Click "Publish"
4. Share the public URL with your users

### Changelog Customization

You can customize:
- Page title and description
- Color scheme
- Logo
- Custom domain (Pro/Team plans)

---

## API Usage

AutoChangelog provides REST APIs for programmatic access.

### Authentication

All API requests require authentication:

```bash
# Get your API token from Settings > API Keys
curl -H "Authorization: Bearer YOUR_API_TOKEN" \
  http://localhost:3000/api/repositories
```

### Available Endpoints

#### List Repositories

```bash
GET /api/repositories
```

Response:
```json
[
  {
    "id": "repo-id",
    "name": "my-app",
    "owner": "johndoe",
    "fullName": "johndoe/my-app"
  }
]
```

#### Get Commits

```bash
GET /api/commits?repositoryId=repo-id
```

Response:
```json
[
  {
    "id": "commit-id",
    "sha": "abc123",
    "message": "feat: add new feature",
    "category": "FEATURE",
    "date": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Releases

```bash
GET /api/releases?repositoryId=repo-id
```

Response:
```json
[
  {
    "id": "release-id",
    "version": "1.0.0",
    "title": "Major Release",
    "isPublished": true,
    "publishedAt": "2024-01-20T12:00:00Z"
  }
]
```

#### Create Release

```bash
POST /api/releases
Content-Type: application/json

{
  "repositoryId": "repo-id",
  "version": "1.1.0",
  "title": "New Release",
  "commitIds": ["commit-1", "commit-2"]
}
```

---

## Best Practices

### Commit Message Guidelines

1. **Use conventional commits**: Always prefix with type
2. **Be descriptive**: Explain what changed, not how
3. **Keep it concise**: First line under 72 characters
4. **Use imperative mood**: "add feature" not "added feature"

### Release Management

1. **Regular releases**: Don't accumulate too many commits
2. **Semantic versioning**: Follow semver (MAJOR.MINOR.PATCH)
3. **Meaningful versions**: 
   - MAJOR: Breaking changes
   - MINOR: New features
   - PATCH: Bug fixes
4. **Review before publishing**: Always preview changelogs

### Team Collaboration

1. **Establish conventions**: Agree on commit message format
2. **Use PR templates**: Include commit message guidelines
3. **Automate checks**: Use Git hooks to validate commit messages
4. **Regular reviews**: Review changelogs before releases

### Automation Tips

1. **Enable webhooks**: Get real-time updates
2. **Schedule syncs**: Auto-fetch commits daily
3. **CI/CD integration**: Trigger releases from your pipeline
4. **Notifications**: Set up Slack/email alerts for new releases

---

## Pricing Plans

### Free Plan
- 1 repository
- Manual changelog generation
- Public changelog page

### Pro Plan ($7/month)
- Unlimited repositories
- Automated changelog generation
- Custom domain
- API access

### Team Plan ($19/month)
- Everything in Pro
- Team collaboration
- Analytics dashboard
- Priority support

---

## Support

Need help?

- **Documentation**: Check our docs at `/docs`
- **GitHub Issues**: Report bugs or request features
- **Email**: support@autochangelog.com
- **Discord**: Join our community

---

## Tips & Tricks

### Quick Commit Classification

Add this to your `.bashrc` or `.zshrc`:

```bash
alias gf='git commit -m "feat: "'
alias gx='git commit -m "fix: "'
alias gp='git commit -m "perf: "'
alias gd='git commit -m "docs: "'
```

### Git Commit Template

Create `.gitmessage` in your repo:

```
<type>: <subject>

# Type: feat, fix, perf, docs, refactor, chore
# Subject: imperative, lowercase, no period

# Body (optional):

# Footer (optional):
```

Set it as default:
```bash
git config commit.template .gitmessage
```

### Webhook Setup

For real-time updates, set up a GitHub webhook:

1. Go to repository Settings > Webhooks
2. Add webhook URL: `http://your-domain.com/api/webhooks/github`
3. Select events: Push, Release
4. Save

---

## Keyboard Shortcuts

- `Ctrl/Cmd + K`: Quick search
- `Ctrl/Cmd + N`: New release
- `Ctrl/Cmd + S`: Save draft
- `Ctrl/Cmd + Enter`: Publish release

---

## FAQ

**Q: Can I edit commit messages?**
A: Yes, in the release builder you can edit how commits appear in the changelog.

**Q: What if I don't use conventional commits?**
A: You can manually categorize commits in the release builder.

**Q: Can I make my changelog private?**
A: Yes, in repository settings you can require authentication.

**Q: How do I migrate from Keep a Changelog?**
A: Import your existing CHANGELOG.md file from Settings > Import.

**Q: Can I customize the changelog design?**
A: Yes, Pro and Team plans include custom themes and CSS.

---

## Next Steps

- Explore the [API Documentation](./API.md)
- Set up [CI/CD Integration](./CI_CD.md)
- Learn about [Advanced Features](./ADVANCED.md)
