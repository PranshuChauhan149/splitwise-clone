# Splitwise Clone - AI Context

## Product Research

Splitwise is a popular expense-sharing app that helps friends, roommates, and travel groups track shared expenses, split costs, and settle debts. A Clone of Splitwise should focus on clear group expense management, flexible split options, and transparent balances.

Key takeaways:
- Users need easy onboarding and secure authentication.
- Group creation and member management are central to collaboration.
- Expense entry must support equal, unequal, percentage, and share-based splits.
- Real-time updates and chat improve coordination and dispute resolution.
- Clear balance summaries reduce confusion and simplify settlements.

## User Personas

### 1. College Roommate
- Age: 19-24
- Needs: track rent, utilities, groceries, and split bills evenly or unequally.
- Goals: avoid manual math, keep finances transparent, settle balances monthly.

### 2. Travel Organizer
- Age: 25-35
- Needs: manage trip expenses, share costs among friends, support percent or custom splits.
- Goals: reduce dispute risk, keep everyone informed, finalize settlements after travel.

### 3. Group Event Planner
- Age: 30-45
- Needs: track shared expenses for dinners, parties, or club activities.
- Goals: let members join groups, contribute to expenses, and view individual balances.

## User Stories

### Authentication
- As a new user, I want to register with name, email, and password so I can securely access the app.
- As a returning user, I want to log in with my email and password so I can access my groups and expenses.
- As a user, I want my session to persist so I stay signed in after a page refresh.
- As a user, I want logout available so I can securely end my session.

### Group Management
- As a user, I want to create a group so I can organize expenses with specific people.
- As a group admin, I want to add or remove members so the expense group stays accurate.

### Expenses and Splits
- As a user, I want to create an expense so I can record a shared cost.
- As a user, I want to split an expense equally so everyone pays the same share.
- As a user, I want to split an expense unequally so I can allocate exact amounts.
- As a user, I want to split an expense by percentage so I can handle proportional shares.
- As a user, I want to split an expense by share count so I can account for varying participation.

### Balances and Settlements
- As a group member, I want to view the group balance so I know who owes what.
- As a user, I want to view my individual balance summary so I can understand my total owed and owed-to amounts.
- As a user, I want to record a settlement so I can mark debts as paid and keep the ledger current.

### Realtime Collaboration
- As a user, I want an expense chat so I can discuss costs and clarify details with group members in realtime.
- As a user, I want chat history loaded for each expense so I can continue conversations after reconnecting.

### Authentication UI
- As a user, I want a modern login and registration experience with validation, loading state, and clear error messages.
- As a returning user, I want protected pages so I cannot access app content without signing in.
- As a user, I want my session to persist between refreshes and logout to clear authentication.

## MVP Scope

Included:
- React frontend with login/register flows.
- Node.js + Express backend with JWT authentication.
- PostgreSQL database managed by Prisma.
- CRUD group management.
- Expense creation with equal, unequal, percentage, and share splits.
- Group balance calculation and individual balance summary.
- Settlement recording.
- Socket.io expense chat for realtime group communication.

## Out-of-Scope Features

- Payment processor integration (Stripe, PayPal).
- OCR receipt scanning.
- Advanced analytics or spending categories.
- Email notifications or push alerts.
- Multi-currency support.
- Mobile native app.
- Social login (Google/Facebook).

## Notes for Development

- Keep API design RESTful and consistent.
- Use JWTs for stateless auth and protect group/expense endpoints.
- Design database schema for users, groups, memberships, expenses, splits, settlements, and chat messages.
- Keep UI simple and mobile-friendly using a component-based React structure.
- Use Redux Toolkit for auth and session state, with a shared axios service for API calls.
- Use Socket.io client for realtime expense chat, and keep event flow clear in app architecture.

## Phase 1 Status

- Completed database schema design.
- Defined Prisma models for `User`, `Group`, `Membership`, `Expense`, `ExpenseSplit`, `Settlement`, and `Message`.
- Established relationships for authentication, group membership, expense splitting, settlements, and realtime chat.
## Audit Findings (Phase 14)

### Key Bugs
- `DashboardPage` expects `group.expenses` from `groupApi.getGroupById`, but backend group details do not include expenses. This breaks dashboard expense rendering.
- `ExpenseChat` initializes `socket` via `getSocket()` before calling `initSocket()`, so message sending can fail because `sendMessage` may use an undefined socket.
- `createExpense` response does not include the `paidBy` relation, causing UI to display "Unknown" payer for newly created expenses.
- Auth state is persisted only in `localStorage` and not validated on app startup. If cookies expire, the UI can still treat the user as authenticated.
- `BalanceCard` displays the raw accent CSS class string as badge text, producing incorrect UI copy.
- `CreateExpenseModal` and backend split validation require exact totals, which is brittle for user-entered decimals and can reject valid cases.
- `SettlementForm` does not handle single-member groups safely and may allow invalid settlement payloads.

### Missing Edge Cases
- Invalid or expired auth sessions after page refresh are not corrected automatically.
- Percentage splits with fractional decimals may be rejected or miscalculated due to strict equality checks.
- Chat reconnection after auth/session expiry is not handled gracefully.
- Group details and dashboard use separate API calls; stale group member data may affect expense/settlement UI.
- No global 401 handler on the frontend, so authorization failures may surface as generic API errors.

### Suggested Fixes
- Fix dashboard data flow by returning expenses with `findGroupById` or changing dashboard to call `expenseApi.getGroupExpenses`.
- Fix `ExpenseChat` to initialize and reuse the same socket instance for both event handlers and emit calls.
- Include `paidBy` in the expense creation response payload.
- Add auth hydration on app load via `/api/auth/me` and clear stale local auth state on invalid sessions.
- Improve split validation with tolerance for floating-point rounding and adjust participant amounts for percentage splits.
- Disable or hide settlement inputs for groups with fewer than two members.
- Add a frontend 401 interceptor to redirect users to login on invalid sessions.
- Add environment readiness documentation for `CLIENT_URL`, `VITE_API_URL`, `JWT_SECRET`, and `DATABASE_URL`.

### Production Readiness Summary
- Core feature set is implemented: auth, groups, expenses, split types, balances, settlements, and realtime chat.
- The frontend build passes, but there are critical runtime issues in dashboard rendering and chat send behavior.
- Authentication flow is fragile because the app trusts persisted local user state without server-side revalidation.
- The codebase needs testing coverage, especially for auth, split calculation, balance summaries, settlement recording, and socket chat.
- Before production, add comprehensive end-to-end tests, improve error handling, and complete missing backend response data.
