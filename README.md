# Blog Platform - Next.js + tRPC

Full-stack blog platform with CRUD operations, search, and pagination.

## 🚀 Features

- ✅ Blog CRUD operations
- ✅ Category management
- ✅ Search functionality
- ✅ Pagination
- ✅ Responsive design

## 🛠 Tech Stack

- Next.js 14
- tRPC
- Prisma
- PostgreSQL
- Tailwind CSS

## 📦 Setup

1. Clone repository
2. Install dependencies: npm install
3. Setup .env file with DATABASE_URL
4. Run migrations: npx prisma migrate dev
5. Seed database: npx prisma db seed
6. Start server: npm run dev

## 🌐 Environment Variables
DATABASE_URL="DATABASE_URL=postgresql://postgres:Kanpur100@@db.cowrpjppugiqdsuassgl.supabase.co:5432/postgres"

## 📁 Project Structure
app/
├── posts/          # Posts pages
├── dashboard/      # Admin panel
└── api/trpc/       # API routeslib/server/
├── routers/        # tRPC routers
│   ├── _app.ts    # Main router
│   ├── posts.ts   # Posts CRUD
│   └── categories.ts
└── prisma.ts       # Database client

## 👨‍💻 Author

Abhishek verma

