<div align="center">

# IdeaForge
### Fueling the Future of Collaborative Innovation

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

**IdeaForge** is a premium, LinkedIn-inspired collaborative ecosystem designed specifically for university innovation hubs. It bridges the gap between ambitious students, expert faculty, and administrative moderators to transform raw concepts into reality.

</div>

## 📖 Introduction

In the rapidly evolving landscape of university innovation, students often struggle to find the right collaborators, while faculty members lack a streamlined way to provide expert guidance. **IdeaForge** solves this real-world problem by providing a centralized, high-performance platform where ideas are shared, teams are formed, and projects are nurtured under expert supervision.

Built with a focus on high-end aesthetics and professional networking, IdeaForge replaces scattered communication channels with a unified, glassmorphism-inspired experience that fosters genuine academic growth and entrepreneurial success.

---

## ✨ Features

- **🚀 Discovery Feed**: A vertical, scrollable feed of cutting-edge ideas with real-time interactions (Likes, Bookmarks, and Shares).
- **🔐 Secure Authentication**: Multi-role authentication (Student, Professor, Admin) powered by Supabase Auth.
- **🤝 Team Collaboration**: Effortlessly find teammates and join projects that align with your skills and interests.
- **🔍 Advanced Search**: Global search functionality with standardized, high-contrast filtering by domain, tags, and keywords.
- **📊 Interactive Dashboard**: Personalized metrics and project tracking for students and review panels for professors.
- **👤 Profile Management**: Showcase your skills, interests, and past innovations with a professional, customizable profile.
- **✨ Glassmorphism UI**: A stunning, modern design system featuring obsidian themes, smooth gradients, and micro-animations.
- **📱 Fully Responsive**: A seamless experience across desktop, tablet, and mobile viewports.
- **🛠️ Admin Control**: Comprehensive moderation tools for managing users, flags, and platform-wide analytics.
- **💬 Real-time Interaction**: Instant updates and engagement through role-based interactions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **State & UI**: [Framer Motion](https://www.framer.com/motion/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

### Backend & Infrastructure
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: [Supabase SSR Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- **Real-time**: [Socket.io](https://socket.io/) (Infrastructure ready)
- **Deployment**: [Vercel](https://vercel.com/)

---

---

## 📂 Folder Structure

```text
student-innovation-hub/
├── app/                  # Next.js App Router (Pages & API Routes)
│   ├── api/              # Server-side API endpoints
│   ├── dashboard/        # Protected role-based layouts & views
│   └── (auth)/           # Authentication flows (Login/Signup)
├── components/           # Reusable UI components
│   ├── ui/               # Base Radix/Tailwind components
│   └── SearchInput.tsx   # Standardized search component
├── context/              # React Context (Auth, Theme)
├── lib/                  # Utility functions & shared config
├── prisma/               # Database schema & migrations
├── public/               # Static assets & screenshots
└── globals.css           # Global design system & theme tokens
```

---

## ⚙️ Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ideaforge.git
cd ideaforge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory and add the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database Connection (Prisma)
DATABASE_URL=your_postgresql_connection_string
DIRECT_URL=your_direct_connection_string

# Auth Secrets
JWT_SECRET=your_jwt_secret
```

> **Where to get these?**
> - Create a project on [Supabase Dashboard](https://app.supabase.com).
> - Obtain URL and Anon Key from **Project Settings > API**.
> - Get connection strings from **Project Settings > Database**.

### 4. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🚀 Deployment Guide

### Deploying to Vercel
1.  Push your code to a GitHub repository.
2.  Login to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Import the `ideaforge` repository.
4.  Add your `.env.local` variables in the **Environment Variables** section.
5.  Click **Deploy**. Vercel will handle automatic deployments on every `git push`.

---

## ⚠️ Current Limitations & Drawbacks

- **UI Responsiveness**: While mostly responsive, some complex dashboard views require further refinement for extra-small devices.
- **Search Optimization**: Currently performs basic database filtering; implementation of fuzzy search or Algolia is pending.
- **Chat System**: The real-time messaging infrastructure is partially implemented but requires full integration with the UI.
- **Notifications**: System alerts are localized; global real-time notifications via Supabase Realtime are under development.
- **Performance**: High-resolution glassmorphism effects can be resource-intensive; lazy loading and image optimization are ongoing.

---

## 🛠️ How You Can Contribute

Help us solve the current limitations and make IdeaForge even better:
- **Responsive Layouts**: Refine Tailwind classes for edge-case mobile viewports.
- **State Management**: Integrate [Zustand](https://github.com/pmndrs/zustand) for more robust global state management.
- **Accessibility (a11y)**: Audit components for ARIA compliance and keyboard navigation.
- **Testing**: Implement unit tests with [Jest](https://jestjs.io/) and E2E tests with [Cypress](https://www.cypress.io/).
- **API Performance**: Optimize Prisma queries and implement Redis caching for the main feed.

---

## 🔮 Future Scope

- **🤖 AI Recommendation**: Smart project matching based on student skills and interests using OpenAI.
- **💬 Real-time Workspace**: Integrated collaborative chat and file sharing within project teams.
- **🌓 Dynamic Themes**: Expanded theme system with customizable accent colors.
- **📈 Advanced Analytics**: Deep insights for university administrators to track innovation trends.
- **📱 PWA Support**: Transform the hub into a Progressive Web App for offline access and native feel.

---

## 🤝 Contribution Guide

1.  **Fork** the repository.
2.  Create a new **Branch** (`git checkout -b feature/AmazingFeature`).
3.  **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4.  **Push** to the branch (`git push origin feature/AmazingFeature`).
5.  Open a **Pull Request**.

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

- **GitHub**: [YourProfile](https://github.com/your-username)
- **LinkedIn**: [YourName](https://linkedin.com/in/your-profile)
- **Email**: [your.email@example.com](mailto:your.email@example.com)

<div align="center">
Built with ❤️ by the IdeaForge Team.
</div>
