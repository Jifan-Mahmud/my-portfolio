# B.M. Jifan Mahmud - Professional Full-Stack Portfolio & Admin Panel

A production-ready, high-performance personal portfolio website with a secure admin panel built for **B.M. Jifan Mahmud** (Full-Stack Web Developer).

---

## 🛠️ Tech Stack

### Frontend (`My-Portfolio-Client`)
- **Next.js 16 (App Router)** - JavaScript (.jsx), Zero TypeScript
- **Tailwind CSS 4** - Modern responsive styling and custom color tokens
- **HeroUI** - Component primitives & Toast provider
- **Motion (`motion/react`)** - Smooth animations and interactive transitions
- **@gravity-ui/icons & Lucide React** - Minimalist icon set
- **Better Auth** - Session & authentication management

### Backend (`My-Portfolio-Server`)
- **Node.js + Express.js** - Clean modular REST API (CommonJS)
- **MongoDB** - Official MongoDB Native Driver
- **jose-cjs** - Modern, secure JWT token generation and verification
- **bcryptjs** - Password hashing for admin credentials
- **Helmet & CORS** - Security headers and origin protection
- **express-rate-limit** - Abuse prevention on login and contact endpoints

---

## 🚀 Getting Started

### 1. Database Seeding (Admin & Initial Data)

In `My-Portfolio-Server`:
```bash
cd My-Portfolio-Server
npm install
npm run seed
```
This automatically seeds:
- Admin user: `admin@jifanmahmud.com` (password configured in `.env`)
- B.M. Jifan Mahmud's profile & story (Barisal Polytechnic Institute, Programming Hero, People N Tech)
- 12 Categorized Skills (Frontend, Backend, Database, Tools)
- 4 Featured Offerings / Services
- 4 Education & Experience Milestones
- 3 Full-Stack Projects (SkillBridge, DevPulse, ElectroZone)
- Recommendations & Testimonials

### 2. Running the Backend Server
```bash
cd My-Portfolio-Server
npm run dev
# Server starts on http://localhost:5000
```

### 3. Running the Frontend Client
```bash
cd My-Portfolio-Client
npm install
npm run dev
# Frontend starts on http://localhost:3000
```

---

## 🔒 Admin Panel Access

1. Open your browser and navigate to: `http://localhost:3000/login` (Notice: `/login` is unlisted in the navigation menu for maximum security).
2. Enter your admin credentials configured in `My-Portfolio-Server/.env`:
   - **Email**: Configured via `ADMIN_EMAIL` (default: `admin@jifanmahmud.com`)
   - **Password**: Configured via `ADMIN_PASSWORD` in your private `.env`
3. Upon authentication, you will be redirected to `/admin` dashboard.
4. From `/admin`, you can:
   - Add, edit, or delete **Projects** (with live demo and GitHub links)
   - Update your **CV / Resume download link** and profile biography
   - Add, edit, or delete **Skills** and proficiencies
   - Read, mark as read, or delete incoming **Client Inquiries**
   - Manage **Experience & Education** timeline milestones
   - Configure **Services**

---

## 🌐 Production Deployment Guide

### Deploying the Backend on Render
1. Push your repository to GitHub.
2. In Render, create a new **Web Service** and set the Root Directory to `My-Portfolio-Server`.
3. Set Build Command: `npm install`
4. Set Start Command: `node index.js`
5. Add the Environment Variables:
   - `PORT=5000`
   - `MONGODB_URI=your_mongodb_cluster_uri`
   - `DB_NAME=portfolio_db`
   - `JWT_SECRET=your_long_random_jwt_secret`
   - `ADMIN_EMAIL=your_admin_email`
   - `ADMIN_PASSWORD=your_admin_password`
   - `CLIENT_URL=https://your-portfolio.vercel.app`

### Deploying the Frontend on Vercel
1. Import your GitHub repository into Vercel and select `My-Portfolio-Client` as the Root Directory.
2. Framework Preset: **Next.js**
3. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL=https://your-render-service.onrender.com/api`
   - `BETTER_AUTH_SECRET=your_better_auth_secret`
   - `BETTER_AUTH_URL=https://your-portfolio.vercel.app`
   - `MONGODB_URI=your_mongodb_cluster_uri`
   - `db_Name=portfolio_db`
4. Deploy!
