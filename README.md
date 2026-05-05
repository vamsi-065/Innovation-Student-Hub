# 🚀 Student Innovation Hub

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-blue?logo=postgresql" />
  <img src="https://img.shields.io/badge/Socket.io-4-010101?logo=socket.io" />
</div>

<br />

> **Where student ideas take flight.** A full-stack collaborative platform for students to share startup ideas, find collaborators, and get mentorship from professors — with real-time messaging and Apple-inspired glassmorphism UI.

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 **JWT Authentication** | Signup/Login with HTTP-only cookies + localStorage |
| 👥 **3 Role System** | Student, Professor, Admin with route protection |
| 💡 **Idea Management** | Post, search, filter, like, and track project ideas |
| 🤝 **Team Building** | Join/leave teams, manage members with status tracking |
| 📝 **Professor Reviews** | Submit rated reviews with feedback and status |
| 💬 **Real-time Chat** | Socket.io powered messaging with typing indicators |
| 🔔 **Notifications** | In-app notifications for reviews, team requests |
| 👤 **LinkedIn-style Profiles** | Skills badges, interests, social links, idea history |
| 🛡️ **Admin Panel** | User management, role changes, platform analytics |

---

## 🏗️ Tech Stack

```
Frontend:  Next.js 14 (App Router) + TypeScript + Tailwind CSS v4
UI:        Glassmorphism design + Framer Motion animations + lucide-react
Backend:   Next.js API Routes + Custom Node.js server
Database:  PostgreSQL (Neon) via Prisma ORM
Auth:      JWT (jsonwebtoken) + bcryptjs + HTTP-only cookies
Realtime:  Socket.io (custom server)
Validation: Zod
```

---

## 📁 Project Structure

```
student-innovation-hub/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login page
│   │   └── signup/page.tsx         # Signup with role selector
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Collapsible sidebar shell
│   │   ├── student/page.tsx        # Student idea feed
│   │   ├── professor/page.tsx      # Professor review queue
│   │   ├── admin/page.tsx          # Admin panel
│   │   └── profile/
│   │       ├── [id]/page.tsx       # LinkedIn-style profile
│   │       └── edit/page.tsx       # Editable profile
│   ├── api/
│   │   ├── auth/                   # signup, login, me
│   │   ├── ideas/                  # CRUD + like toggle
│   │   ├── users/                  # Profile GET/PATCH
│   │   ├── reviews/                # Professor reviews
│   │   ├── teams/                  # Join/leave teams
│   │   ├── messages/               # Chat history
│   │   └── admin/                  # Admin-only routes
│   ├── globals.css                 # Design system
│   ├── layout.tsx                  # Root layout + AuthProvider
│   └── page.tsx                    # Landing page
├── context/
│   └── AuthContext.tsx             # Auth state + JWT management
├── lib/
│   ├── auth.ts                     # JWT helpers
│   ├── prisma.ts                   # Singleton Prisma client
│   └── utils.ts                    # cn(), formatDate, etc.
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── seed.ts                     # Demo data seeder
├── middleware.ts                   # JWT + role-based protection
├── server.ts                       # Custom Next.js + Socket.io
├── tsconfig.server.json            # Server-side TS config
└── .env.example                    # Environment template
```

---

## 🚦 User Roles

### 🎓 Student
- Post and manage project ideas
- Browse and search ideas from peers
- Join teams and request collaboration
- Message collaborators in real-time
- Receive professor reviews on your ideas

### 👨‍🏫 Professor
- View all open ideas needing review
- Submit rated reviews with detailed feedback
- Mark ideas as Approved/Rejected/Pending
- Message students directly

### 🛡️ Admin
- Full platform overview with analytics
- Manage all users (view, change role, delete)
- Moderate ideas and content
- Access all platform data

---

## ⚡ Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/student-innovation-hub.git
cd student-innovation-hub
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Get from: https://neon.tech → New Project → Connection String
DATABASE_URL="postgresql://USER:PASS@ep-xxxx.neon.tech/neondb?sslmode=require"

# Generate: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="your-super-secret-key"

NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
```

### 3. Push Database Schema

```bash
npm run db:push
```

### 4. Seed Demo Data

```bash
npm run db:seed
```

This creates:
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@innovationhub.dev | Admin@123456 |
| Professor | prof.smith@innovationhub.dev | Professor@123 |
| Student | student@innovationhub.dev | Student@123 |

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Note**: `npm run dev` starts the custom Socket.io server. Use `npm run dev:next` if you want to run without Socket.io (API routes only).

---

## 📡 API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/auth/signup` | POST | None | Create account |
| `/api/auth/login` | POST | None | Login |
| `/api/auth/me` | GET | JWT | Get current user |
| `/api/auth/me` | DELETE | JWT | Logout |
| `/api/ideas` | GET | None | List ideas (search, filter) |
| `/api/ideas` | POST | Student | Create idea |
| `/api/ideas/:id` | GET | None | Idea detail |
| `/api/ideas/:id` | PATCH | Author/Admin | Update idea |
| `/api/ideas/:id` | DELETE | Author/Admin | Delete idea |
| `/api/ideas/:id/like` | POST | JWT | Toggle like |
| `/api/users/:id` | GET | JWT | User profile |
| `/api/users/:id` | PATCH | Owner | Update profile |
| `/api/reviews` | POST | Professor | Submit review |
| `/api/reviews` | GET | JWT | List reviews |
| `/api/teams/:ideaId/join` | POST | Student | Join team |
| `/api/teams/:ideaId/join` | DELETE | Student | Leave team |
| `/api/messages/:roomId` | GET | JWT | Chat history |
| `/api/messages/:roomId` | POST | JWT | Send message |
| `/api/admin/users` | GET | Admin | All users |
| `/api/admin/users` | PATCH | Admin | Change role |
| `/api/admin/users` | DELETE | Admin | Delete user |

---

## 🔌 Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join_room` | Client → Server | `roomId: string` |
| `leave_room` | Client → Server | `roomId: string` |
| `send_message` | Client → Server | `{ roomId, receiverId, content }` |
| `new_message` | Server → Client | Message object |
| `typing_start` | Client → Server | `roomId: string` |
| `typing_stop` | Client → Server | `roomId: string` |
| `user_typing` | Server → Client | `{ userId, name }` |
| `notification` | Server → Client | `{ type, content }` |

---

## 🗄️ Database Schema

```
User ──< Idea ──< Review
     ──< TeamMember >── Team >── Idea
     ──< Message (sender/receiver)
     ──< Notification
     ──< IdeaLike >── Idea
```

---

## 🚀 Deployment

### Vercel (Recommended for frontend)

```bash
npm run build
vercel deploy
```

> Note: Socket.io requires a Node.js server. Deploy the custom server separately or use a service like Railway/Render for WebSocket support.

### Environment variables on Vercel:
Add all variables from `.env.example` to Vercel project settings.

---

## 📝 License

MIT © 2025 Student Innovation Hub
