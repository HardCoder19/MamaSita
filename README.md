# MAMASITA 🌮 — The Urban Cantina

> A QR-code-scannable restaurant ordering web app built with Vite + React + Tailwind CSS + Supabase.

![MAMASITA App](https://img.shields.io/badge/Stack-Vite%20%2B%20React%20%2B%20Supabase-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge)

---

## ✨ Features

- **Build Your Own Taco** — 3-step wizard (Base → Protein → Sauce) with live progress bar
- **Quick Bites** — one-tap add to cart from the home page
- **Live Cart Badge** — item count shown on the nav bag icon and CART tab at all times
- **Persistent Cart** — survives page refresh via localStorage
- **Checkout** — captures name + email, writes order to Supabase
- **Order Status** — live order tracking page with progress bar
- **Neo-Brutalist Design** — bold borders, drop shadows, rotated badges, dot-pattern backgrounds
- **QR-Code Ready** — deploy to Vercel, generate a QR code, and diners scan to order

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── TopAppBar.jsx       # Header with live cart badge
│   ├── BottomNav.jsx       # Footer nav with live cart badge
│   ├── BuildProgress.jsx   # Shared 3-step progress bar
│   ├── BuildPageHeader.jsx # Shared heading for all build steps
│   ├── BuildOptionCard.jsx # Shared selection card
│   └── BuildNextButton.jsx # Shared CTA button
├── context/
│   └── CartContext.jsx     # useReducer cart state + localStorage
├── lib/
│   ├── supabase.js         # Supabase client
│   └── api.js              # createOrder(), getOrder()
└── pages/
    ├── HomePage.jsx
    ├── BuildBasePage.jsx
    ├── BuildProteinPage.jsx
    ├── BuildSaucePage.jsx
    ├── CartPage.jsx
    ├── CheckoutPage.jsx
    ├── OrderStatusPage.jsx
    └── ProfilePage.jsx
supabase/
└── schema.sql              # Database schema + seed — run once in Supabase SQL Editor
```

---

## 🚀 Deploy to Vercel (Free)

### 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](./supabase/schema.sql)
3. Go to **Project Settings → API** and copy your **Project URL** and **anon/publishable key**

### 2. Deploy to Vercel

1. Push this repo to GitHub (or fork it)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Add these **Environment Variables** in the Vercel dashboard:

   | Variable | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `your_anon_key_here` |

4. Click **Deploy** — you'll get a URL like `mamasita.vercel.app`
5. Generate a QR code at [qr.io](https://qr.io) pointing to that URL

---

## 🛠 Local Development

```bash
# 1. Clone
git clone https://github.com/HardCoder19/MamaSita.git
cd MamaSita

# 2. Install
npm install

# 3. Set up env
cp .env.example .env.local
# Fill in your Supabase credentials

# 4. Run
npm run dev
```

App runs at `http://localhost:5173/`  
Network URL (for scanning on phone): `http://YOUR_LOCAL_IP:5173/`

---

## 🗃 Database Schema

The schema is in [`supabase/schema.sql`](./supabase/schema.sql). Tables:

| Table | Description |
|---|---|
| `customers` | Name + email of each person who places an order |
| `menu_items` | Pre-seeded Quick Bite items (Tikka Taco, Paneer Wrap, etc.) |
| `orders` | Each order with status, subtotal, tax, total |
| `order_items` | Line items — quantity, price, and `custom_build` JSONB for DIY tacos |

Order status flow: `received → prepping → cooking → ready → delivered`

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite 5 |
| Styling | Tailwind CSS v3 (neo-brutalist design system) |
| Routing | React Router DOM v6 |
| State | React Context + useReducer + localStorage |
| Database | Supabase (PostgreSQL) |
| Icons | Material Symbols Outlined |
| Fonts | Lilita One, Space Grotesk, Plus Jakarta Sans |
| Deploy | Vercel |

---

## 📱 QR Code Flow

```
Customer scans QR code
       ↓
Vercel CDN serves the React app
       ↓
Customer browses menu / builds taco
       ↓
Cart stored in browser localStorage
       ↓
Checkout → Supabase writes order to PostgreSQL
       ↓
Order Status page shows live progress
```

---

## 📄 License

MIT — use freely for your own restaurant project.
