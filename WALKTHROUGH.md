# MAMASITA — Deployment & Feature Walkthrough

## What Was Built

MAMASITA is a QR-scannable restaurant ordering web app with a full cart system and Supabase backend.

---

## Architecture

```
Browser (React SPA)
  └── CartContext (useReducer + localStorage)
  └── React Router (BrowserRouter)
  └── Supabase JS client
           └── PostgreSQL (Supabase hosted)
```

---

## Feature Walkthrough

### 1. Home Page — Quick Bites
- Tap **+** on any Quick Bite to add it to the cart instantly
- Cart badge on the top-right bag icon updates immediately
- CART tab in the bottom nav shows the same count

### 2. Build Your Own Taco (3 steps)
1. `/build-base` → pick a tortilla base
2. `/build-protein` → choose protein (selection carried via route state)
3. `/build-sauce` → pick a sauce → **ADD TO CART** → navigates to `/cart`

Each step passes the previous selections via `navigate('/next', { state: {...} })`.

### 3. Cart Page
- Reads from `CartContext` — real items, real totals
- Quantity +/- buttons (hitting 0 removes the item)
- REMOVE button per item
- Live subtotal + 8% tax + delivery = total
- CHECKOUT button shows the live total

### 4. Checkout Page
- Two controlled inputs: **Full Name** + **Email**
- On submit → calls `createOrder(customerInfo, cartItems)` from `src/lib/api.js`
  1. INSERT into `customers`
  2. INSERT into `orders` (with subtotal/tax/total)
  3. INSERT all line items into `order_items` (with `custom_build` JSONB for DIY tacos)
- On success → cart cleared → navigate to `/order-status` with orderId

### 5. Order Status Page
- Receives `orderId` from navigation state
- Fetches order + items from Supabase (`getOrder()`)
- Shows animated progress bar: Received → Prepping → Cooking → Ready

---

## Deploying to Vercel

### Prerequisites
- GitHub account with this repo pushed
- Supabase project with schema.sql run

### Steps
1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo
2. Framework: **Vite** (auto-detected)
3. Add Environment Variables:
   ```
   VITE_SUPABASE_URL     = https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY = your_key_here
   ```
4. Deploy → get your URL
5. Go to [qr.io](https://qr.io) → paste the URL → download QR PNG

### Important — SPA Routing on Vercel
React Router uses client-side routing. Add a `vercel.json` to handle direct URL loads:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

This file is already in the repo.

---

## Database Tables

| Table | Key Columns |
|---|---|
| `customers` | id, name, email, created_at |
| `menu_items` | id, name, price, category, image_url, available |
| `orders` | id, customer_id, status, subtotal, tax, total |
| `order_items` | id, order_id, quantity, unit_price, custom_build (JSONB) |

### Updating Order Status
To mark an order as cooking (for staff to do from Supabase dashboard):
```sql
UPDATE orders SET status = 'cooking' WHERE id = 'YOUR_ORDER_ID';
```

---

## Scalability Notes

- **Frontend**: Static files on Vercel CDN — handles unlimited concurrent users
- **Cart**: Per-browser localStorage — zero server load
- **Supabase free tier**: 500MB DB, 2GB bandwidth — handles hundreds of concurrent diners
- **PostgreSQL transactions**: Each order is ACID-compliant — no concurrency bugs
- **Upgrade path**: Supabase Pro ($25/mo) for dedicated DB + 8GB storage when needed
