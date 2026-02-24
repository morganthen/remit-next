"I was tired of paying for QuickBooks subscriptions, so I built a tool tailored to my own workflow."

# Remit | Simple Invoicing for Freelancers

Remit is a lightweight, responsive invoicing dashboard built to help freelancers manage their billing cycles with ease. It features a clean UI, real-time database synchronization, and secure user authentication.

---

### 🚀 Key Features

- **User Authentication:** Working on this choosing between NextAuth or SupabaseAuth.
- **Full CRUD Support:** Create, Read, Update, and Delete invoices with immediate UI feedback.
- **Financial Insights:** Real-time calculation of "Total Outstanding" and "Total Collected" balances.
- **Dynamic Status Management:** Categorize invoices as **Draft**, **Unpaid**, or **Paid** with a custom action menu.
- **Secure Data Architecture:** Row-Level Security (RLS) policies ensure data isolation between users.

### 🛠️ Tech Stack

- **Frontend:** React 18 (Next)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **Deployment:** Vercel

### 🏗️ Database Schema

The app utilizes a relational PostgreSQL schema. The `invoices` table is linked to authenticated users to maintain strict data ownership:

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to Auth)
- `client_name`: Text
- `amount`: Decimal
- `status`: Text (Draft, Unpaid, Paid)
- `due_date`: Date

### 🤕 Challenges Overcome

Persistent Authentication: Implemented a useAuth context to maintain session state across the application.

UI/UX Polishing: Solved CSS stacking context issues with absolute-positioned dropdown menus inside overflow-hidden containers.

Relational Security: Configured Supabase RLS policies to allow granular "Manage" permissions for owners while denying all public access.
