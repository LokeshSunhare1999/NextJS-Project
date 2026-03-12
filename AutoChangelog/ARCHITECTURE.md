# AutoChangelog Architecture

Technical architecture documentation for developers.

## System Overview

AutoChangelog is built as a modern full-stack application using Next.js 14 with the App Router, providing both frontend and backend capabilities in a single codebase.

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety

### Backend
- **Next.js API Routes**: RESTful API endpoints
- **NextAuth.js**: Authentication with GitHub OAuth
- **Prisma ORM**: Database abstraction layer
- **BullMQ**: Background job processing

### Database
- **PostgreSQL**: Primary data store
- **Redis**: Job queue and caching

### External Services
- **GitHub API**: Repository and commit data
- **GitHub OAuth**: User authentication

## Project Structure

```
autochangelog/
├── prisma/
│   └── schema.prisma              # Database schema definition
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # API routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   ├── repositories/      # Repository management
│   │   │   ├── commits/           # Commit data
│   │   │   └── releases/          # Release management
│   │   ├── changelog/[slug]/      # Public changelog pages
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Homepage
│   │   └── globals.css            # Global styles
│   ├── lib/                       # Shared utilities
│   │   ├── auth.ts                # NextAuth configuration
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── github.ts              # GitHub API service
│   │   └── commit-classifier.ts   # Commit categorization logic
│   └── workers/                   # Background job workers
│       └── commit-fetcher.ts      # Commit sync worker
├── .env.example                   # Environment variables template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript configuration
└── next.config.js                 # Next.js configuration
```

## Data Model

### Entity Relationship Diagram

```
User (1) ──────< (N) Repository
                      │
                      ├──< (N) Commit
                      │
                      └──< (N) Release
                                │
                                └──< (N) Commit
```

### Database Schema

#### User
- Stores user account information
- Links to GitHub account via `githubId`
- Tracks subscription plan

#### Repository
- Represents a connected GitHub repository
- Stores access token for API calls
- Links to owner (User)

#### Commit
- Individual Git commits
- Automatically categorized by message prefix
- Can be associated with a Release

#### Release
- Groups commits into versions
- Can be published to public changelog
- Supports draft and published states

## Authentication Flow

```
1. User clicks "Sign in with GitHub"
   ↓
2. Redirect to GitHub OAuth
   ↓
3. User authorizes application
   ↓
4. GitHub redirects back with code
   ↓
5. NextAuth exchanges code for token
   ↓
6. Create/update user in database
   ↓
7. Create session and set cookie
   ↓
8. Redirect to dashboard
```

## Commit Sync Flow

```
1. User connects repository
   ↓
2. Store repository metadata
   ↓
3. Queue commit fetch job
   ↓
4. Worker fetches commits from GitHub API
   ↓
5. Classify each commit by message
   ↓
6. Store commits in database
   ↓
7. Detect and create releases from tags
```

## Background Jobs

### Commit Fetcher Worker

**Purpose**: Periodically sync commits from GitHub

**Trigger**: 
- Manual: When user connects repository
- Automatic: Scheduled every 6 hours
- Webhook: On push events

**Process**:
1. Fetch repository from database
2. Get latest commits from GitHub API
3. Classify commits by category
4. Upsert commits to database
5. Update last sync timestamp

### Release Generator Worker

**Purpose**: Automatically create releases from Git tags

**Trigger**:
- When new tag is detected
- Manual release creation

**Process**:
1. Fetch commits between tags
2. Group by category
3. Generate release notes
4. Create draft release

## API Architecture

### RESTful Endpoints

All API routes follow REST conventions:

```
GET    /api/repositories          # List repositories
POST   /api/repositories          # Connect new repository
GET    /api/repositories/:id      # Get repository details
DELETE /api/repositories/:id      # Disconnect repository

GET    /api/commits?repositoryId  # List commits
GET    /api/commits/:id           # Get commit details

GET    /api/releases?repositoryId # List releases
POST   /api/releases              # Create release
GET    /api/releases/:id          # Get release details
PUT    /api/releases/:id          # Update release
DELETE /api/releases/:id          # Delete release
POST   /api/releases/:id/publish  # Publish release
```

### Authentication

API routes use NextAuth session-based authentication:

```typescript
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Handle request
}
```

## Commit Classification Algorithm

```typescript
function classifyCommit(message: string): Category | null {
  const lowerMessage = message.toLowerCase()
  
  // Check conventional commit prefixes
  if (lowerMessage.startsWith('feat:')) return Category.FEATURE
  if (lowerMessage.startsWith('fix:')) return Category.FIX
  if (lowerMessage.startsWith('perf:')) return Category.PERFORMANCE
  if (lowerMessage.startsWith('docs:')) return Category.DOCS
  if (lowerMessage.startsWith('refactor:')) return Category.REFACTOR
  if (lowerMessage.startsWith('chore:')) return Category.CHORE
  
  return null // Uncategorized
}
```

## Security Considerations

### OAuth Token Storage
- GitHub access tokens are encrypted at rest
- Tokens stored per repository for granular access
- Tokens never exposed to frontend

### API Security
- All API routes require authentication
- Rate limiting on public endpoints
- CSRF protection via NextAuth
- Input validation with Zod schemas

### Webhook Verification
- Verify GitHub webhook signatures
- Validate payload structure
- Prevent replay attacks

## Performance Optimizations

### Database
- Indexed queries on frequently accessed fields
- Composite unique indexes for upserts
- Connection pooling via Prisma

### Caching
- Redis cache for GitHub API responses
- Session caching
- Static page generation for public changelogs

### Background Processing
- Async commit fetching
- Job queue for heavy operations
- Batch processing for bulk operations

## Scalability

### Horizontal Scaling
- Stateless API design
- Session stored in database
- Background workers can scale independently

### Database Scaling
- Read replicas for queries
- Connection pooling
- Prepared statements

### Job Queue Scaling
- Multiple worker instances
- Job prioritization
- Retry logic with exponential backoff

## Monitoring & Logging

### Application Logs
- Structured logging with timestamps
- Error tracking and alerting
- Performance metrics

### Database Monitoring
- Query performance tracking
- Connection pool metrics
- Slow query logs

### Job Queue Monitoring
- Job success/failure rates
- Queue depth
- Processing time metrics

## Deployment Architecture

```
┌─────────────┐
│   Vercel    │  (Next.js App)
└──────┬──────┘
       │
       ├──────> PostgreSQL (Managed DB)
       │
       ├──────> Redis (Upstash/Redis Cloud)
       │
       └──────> GitHub API
```

## Future Enhancements

### Planned Features
- GitLab and Bitbucket integration
- AI-generated release summaries
- Slack/Discord notifications
- Analytics dashboard
- Custom changelog themes
- Markdown export
- API webhooks

### Technical Improvements
- GraphQL API
- Real-time updates via WebSockets
- Advanced caching strategies
- Multi-region deployment
- CDN for public changelogs

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server
npm run db:studio    # Open Prisma Studio
npm run db:migrate   # Run migrations
```

### Testing
```bash
npm run test         # Run tests
npm run test:e2e     # End-to-end tests
npm run lint         # Lint code
```

### Deployment
```bash
npm run build        # Production build
npm run start        # Start production server
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.
