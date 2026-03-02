"I was tired of paying for QuickBooks subscriptions, so I built a tool tailored to my own workflow."

# Remit | Simple Invoicing for Freelancers

Remit is a lightweight, responsive invoicing dashboard built to help freelancers manage their billing cycles with ease. It features a clean UI, real-time database synchronization, and secure user authentication.

---

### 🚀 Key Features

- **User Authentication:** Secure sign up, login via Supabase Auth.
- **Full CRUD Support:** Create, Read, Update, and Delete invoices with immediate UI feedback.
- **Financial Insights:** Real-time calculation of "Total Outstanding", "Total Collected" balances, Average Invoice Amount and 7-day Rolling Average"
- **Dynamic Status Management:** Categorize invoices as **Draft**, **Unpaid**, **Paid**, or **Void** with a custom action menu
  **Client Management** – Manage a client list and associate invoices to clients
- **Printable Invoices** – Dedicated invoice view optimized for print
- **Dark / Light Mode** – System-aware theme toggle
- **Secure Data Architecture** – Row-Level Security (RLS) policies ensure strict data isolation between users

### 🛠️ Tech Stack

| Layer              | Technology                                  |
| ------------------ | ------------------------------------------- |
| Framework          | Next.js 15 (App Router, Server Actions)     |
| Language           | TypeScript                                  |
| UI                 | React 19, shadcn/ui, Radix UI, Lucide React |
| Styling            | Tailwind CSS v4                             |
| Forms & Validation | React Hook Form + Zod                       |
| Auth & Database    | Supabase (PostgreSQL + RLS)                 |
| Deployment         | Vercel                                      |

### 🏗️ Database Schema

| Column        | Type    | Notes                     |
| ------------- | ------- | ------------------------- |
| `id`          | UUID    | Primary Key               |
| `user_id`     | UUID    | Foreign Key → Auth        |
| `client_name` | Text    |                           |
| `amount`      | Decimal |                           |
| `status`      | Text    | Draft, Unpaid, Paid, Void |
| `due_date`    | Date    |                           |

### 🤕 Challenges Overcome

Persistent Authentication: Implemented a useAuth context to maintain session state across the application.

UI/UX Polishing: Solved CSS stacking context issues with absolute-positioned dropdown menus inside overflow-hidden containers.

Relational Security: Configured Supabase RLS policies to allow granular "Manage" permissions for owners while denying all public access.

---

## 🏃 Running Locally

```bash
git clone https://github.com/your-username/remit-next.git
cd remit-next
npm install
cp .env.example .env.local  # Add your Supabase keys
npm run dev
```
