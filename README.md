# Vexel

- 🚀 **[Link](https://next-template-rho-six.vercel.app/en)**

### 🛠 Tech Stack

- **Framework:** Next.js 16
- **UI:** React 19
- **Authentication:** Auth.js / NextAuth.js v5
- **Database:** PostgreSQL
- **ORM:** Prisma
- **State Management:** Zustand
- **Server State:** TanStack Query
- **Forms:** React Hook Form + Zod
- **UI Components:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS 4
- **Image Storage:** Cloudinary
- **Email:** Resend
- **2FA:** OTPAuth / TOTP
- **Testing:** Vitest
- **Architecture:** Feature-Sliced Design
- **CI:** GitHub Actions

---

### 🚀 Installation

#### 1. Clone the repository

```bash
git clone https://github.com/nfluvv/vexel.git
cd next-template
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in the required environment variables, including your PostgreSQL connection, Auth.js secret, OAuth credentials, Cloudinary and Resend configuration.

#### 4. Set up the database

Make sure PostgreSQL is running and your `DATABASE_URL` is configured in `.env`.

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma migrate dev
```

If you need to inspect or manage the database manually, you can open Prisma Studio:

```bash
npx prisma studio
```

#### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

#### Useful Prisma commands

```bash
# Generate Prisma Client
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# Reset the database
npx prisma migrate reset
```

> **Note:** `prisma migrate reset` deletes all data from the database. Use it only in development.

---

### 🏗️ Architecture & Codebase Structure

The project follows the **Feature-Sliced Design** methodology.

```text
src/
├── app/          # Application providers and global configuration
├── views/        # Page-level compositions
├── widgets/      # Complex reusable UI blocks
├── features/     # User interactions and business actions
├── entities/     # Domain models, schemas and queries
└── shared/       # UI kit, utilities and infrastructure

app/              # Next.js routing layer
```
