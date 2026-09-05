# Vexel 🪐

> **Premium, open-source Quizlet alternative. Rebelling against corporate paywalls.** Built for students, developers, and polyglots.

🚀 **[Launch Platform](https://vexel-eosin.vercel.app)**

---

## 💡 The Story Behind Vexel
Vexel was built out of frustration with legacy paywalled apps while gaming and learning phrases. In 2 months, Vexel was created as a lightning-fast, free, open-source alternative featuring advanced memorization algorithms and military-grade security.

---

## 🛠 Tech Stack & Core Features
*   **Framework:** Next.js 16 (App Router)
*   **UI:** React 19 + Tailwind CSS 4 + shadcn/ui
*   **State:** Zustand + TanStack Query v5
*   **DB & ORM:** PostgreSQL + Prisma ORM
*   **Auth & Security:** Auth.js v5 + 2FA (TOTP)
*   **Services:** Cloudinary & Resend
*   **Architecture:** Feature-Sliced Design (FSD)

---

## 🧠 Core Engineering Systems
1. **SM2 Spaced Repetition:** Dynamic interval learning algorithm recalculating Easiness Factors on the backend.
2. **Multi-tenant Architecture:** Support for isolated Private and shareable Public decks.
3. **Hardened 2FA Security:** Integrated TOTP generator within the NextAuth v5 flow.

---

## 🚀 Quick Setup
```bash
git clone https://github.com
cd vexel
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## 💰 Support & License
*   **TON / USDT:** `UQDS84qVy-oyh6PG5Hss9r20m81Xabg3MrTTdlrXrRsd4wc8`
*   Licensed under the MIT License by [nfluvv](https://github.com/nfluvv). Full details can be found in the repository.
