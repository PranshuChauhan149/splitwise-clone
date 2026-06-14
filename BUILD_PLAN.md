# Splitwise Clone - Build Plan

## Overview
This build plan outlines the architecture, database design, API routes, frontend structure, backend structure, deployment strategy, and testing plan for the Splitwise Clone.

## Database Design

Entities:
- User
- Group
- Membership
- Expense
- Split
- Settlement
- Message

### Core tables
- `User`: stores authentication and profile info.
- `Group`: stores group metadata.
- `Membership`: links users to groups and tracks roles.
- `Expense`: stores expense details and payer information.
- `Split`: stores how each expense is divided among members.
- `Settlement`: records resolved payments between users.
- `Message`: stores realtime chat messages for expense groups.

## API Design

### Auth
- `POST /api/auth/register` — create a new user.
- `POST /api/auth/login` — authenticate and return JWT.

### Users
- `GET /api/users/me` — fetch current user profile.

### Groups
- `POST /api/groups` — create a new group.
- `GET /api/groups` — list groups for current user.
- `GET /api/groups/:groupId` — get group details.
- `PUT /api/groups/:groupId` — update group metadata.
- `DELETE /api/groups/:groupId` — delete a group.

### Memberships
- `POST /api/groups/:groupId/members` — add a member.
- `DELETE /api/groups/:groupId/members/:memberId` — remove a member.
- `GET /api/groups/:groupId/members` — list group members.

### Expenses
- `POST /api/groups/:groupId/expenses` — create a new expense.
- `GET /api/groups/:groupId/expenses` — list group expenses.
- `GET /api/groups/:groupId/expenses/:expenseId` — get expense detail.
- `PUT /api/groups/:groupId/expenses/:expenseId` — update expense.
- `DELETE /api/groups/:groupId/expenses/:expenseId` — remove expense.

### Balances
- `GET /api/groups/:groupId/balances` — calculate group balances.
- `GET /api/users/me/balance-summary` — get personal summary across groups.

### Settlements
- `POST /api/groups/:groupId/settlements` — record a repayment event.
- `GET /api/groups/:groupId/settlements` — list settlements.

### Chat
- `GET /api/messages/:expenseId` — fetch expense-level message history.
- `POST /api/messages` — post a message in an expense chat.
- Realtime socket events:
  - `join-expense` — join expense chat room.
  - `send-message` — send a new expense message.
  - `receive-message` — receive a realtime expense message.

## Frontend Architecture

### Pages / Views
- Login page
- Register page
- Dashboard / Group list
- Group detail page
- Expense creation / edit screen
- Balance summary view
- Group chat panel

### Components
- `AuthForm`
- `FormInput`
- `ProtectedRoute`
- `PublicRoute`
- `MainLayout`
- `AuthLayout`
- `GroupCard`
- `MemberList`
- `ExpenseForm`
- `SplitControls`
- `BalanceSummary`
- `ChatWindow`

### Authentication UI
- Modern login and registration pages with email/password forms.
- Validation and error handling for auth inputs.
- Loading state for API requests.
- Redux-backed auth state with persistence.
- Token-aware Axios service and session-based protected routes.
- `AuthForm`
- `GroupCard`
- `MemberList`
- `ExpenseForm`
- `SplitControls`
- `BalanceSummary`
- `ChatWindow`
- `ProtectedRoute`

### State Management
- Local component state for form fields.
- Redux Toolkit for auth state, session data, and UI state.
- Socket.io client state for realtime chat.

### Networking
- Axios instance with base URL and credentials.
- JWT stored in memory and sent with requests via auth header.
- Authorization header managed centrally by Axios.

## Backend Architecture

### Core technologies
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT for auth
- Socket.io for realtime chat

### Layers
- Routing layer for REST endpoints
- Controller/service layer for business logic
- Prisma data access layer for DB operations
- Middleware for auth, validation, and error handling

### Realtime
- Socket.io namespace or room per group
- Events for chat and live expense/settlement updates
- Server-side auth for socket connections

## Deployment Plan

### Environments
- Development: local Node and PostgreSQL, local React frontend
- Production: deploy backend and frontend separately or together

### Production options
- Frontend: Vercel, Netlify, or static hosting
- Backend: Heroku, Render, Railway, or a VPS with Docker
- Database: managed PostgreSQL (Supabase, Railway, ElephantSQL)

### Steps
1. Provision PostgreSQL database.
2. Configure environment variables for JWT secret, DB URL, and socket origin.
3. Deploy backend with build and start scripts.
4. Deploy frontend and connect API base URL.
5. Enable CORS and secure cookie/auth headers.

## Testing Plan

### Backend testing
- Unit tests for auth flows and balance calculations.
- Integration tests for CRUD endpoints and permission enforcement.
- Validation tests for split logic and settlement creation.

### Frontend testing
- Component tests for forms and balance displays.
- E2E tests for login, group creation, expense creation, and chat flow.
- Manual QA for realtime updates and responsive layout.

### Realtime testing
- Validate socket auth and event broadcasting.
- Confirm messages arrive in active group rooms.
- Test group update propagation with connected clients.

## Timeline

### Phase 1: Setup
- Initialize frontend and backend projects.
- Configure Prisma schema and authentication.
- Completed database schema design for users, groups, memberships, expenses, expense splits, settlements, and messages.

### Phase 2: Core functionality
- Build group management and expense creation.
- Implement split types and balance calculations.

### Phase 3: Realtime and polish
- Add Socket.io chat and live updates.
- Refine UI and complete summary views.
- Run end-to-end tests.
## Phase 14: Testing and Bug Audit

### Current issues to resolve before production
- Dashboard data flow is broken by missing expense inclusion in group details.
- Expense chat send functionality is unreliable due to socket initialization logic.
- Newly created expense responses lack payer metadata required by the UI.
- Authentication persistence is client-only and must be validated on startup.
- No global frontend 401/authorization handling exists.
- Split validation is strict and can reject valid decimal inputs.
- Settlement UI does not guard against invalid single-user group scenarios.

### Recommended action items
- Add auth session validation in app initialization using `/api/auth/me`.
- Harden frontend API error handling with a 401 redirect and logout flow.
- Update dashboard data fetching to use expense-specific endpoints or extend backend group detail queries.
- Fix socket code in `ExpenseChat.jsx` to use a single socket instance for emits and listeners.
- Return fully populated expense objects for create responses.
- Add more robust tests around auth, expense split calculations, balance summaries, settlements, and realtime messaging.
- Document required environment variables for frontend and backend deployments.

### Production readiness notes
- The project is close to an MVP, but it requires bug fixes and testing before production deployment.
- Focus on runtime correctness first: auth hydration, dashboard/expense data flow, chat reliability, and split/settlement edge cases.
- After fixes, add smoke tests for login, group creation, expense creation, settlement recording, and chat messaging.
---

This plan keeps features focused on a shareable, minimal Splitwise Clone with secure auth, flexible splits, group balances, and realtime collaboration.