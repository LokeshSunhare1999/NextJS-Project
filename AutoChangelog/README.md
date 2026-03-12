# AutoChangelog

Automated changelog generator for Git repositories.

## Tech Stack

- **Frontend & Backend**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with GitHub OAuth
- **Background Jobs**: BullMQ with Redis
- **Styling**: Tailwind CSS

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── api/              # API routes
│   │   ├── changelog/        # Public changelog pages
│   │   └── layout.tsx        # Root layout
│   ├── lib/                  # Shared utilities
│   │   ├── auth.ts           # NextAuth configuration
│   │   ├── prisma.ts         # Prisma client
│   │   ├── github.ts         # GitHub API service
│   │   └── commit-classifier.ts
│   └── workers/              # Background job workers
└── package.json
```

## Quick Start

See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed installation instructions.

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# 3. Set up database
npm run db:push

# 4. Start development server
npm run dev
```

## Documentation

- [Getting Started Guide](./GETTING_STARTED.md) - Installation and setup
- [User Guide](./USER_GUIDE.md) - How to use AutoChangelog
- [Architecture](./ARCHITECTURE.md) - Technical documentation

## Features

- GitHub OAuth authentication
- Repository connection and sync
- Automatic commit classification
- Release builder
- Public changelog pages
- Background job processing

## API Endpoints

- `GET /api/repositories` - List user repositories
- `GET /api/commits?repositoryId=` - Get commits
- `GET /api/releases?repositoryId=` - Get releases
- `GET /changelog/[slug]` - Public changelog page
