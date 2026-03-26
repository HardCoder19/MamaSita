import { supabase } from './supabase'

const TAX_RATE = 0.08  // 8%

/**
 * createOrder
 * 1. Upserts the customer (by email)
 * 2. Creates the order row
 * 3. Inserts all order_items
 * Returns { order, error }
 */
export async function createOrder(customerInfo, cartItems) {
  // --- 1. Upsert customer ---
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({ name: customerInfo.name, email: customerInfo.email })
    .select()
    .single()

  if (custErr) return { order: null, error: custErr }

  // --- 2. Calculate totals ---
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total    = parseFloat((subtotal + tax).toFixed(2))

  // --- 3. Create order ---
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ customer_id: customer.id, subtotal, tax, total })
    .select()
    .single()

  if (orderErr) return { order: null, error: orderErr }

  // --- 4. Insert order items ---
  const lineItems = cartItems.map(item => ({
    order_id:     order.id,
    menu_item_id: item.menuItemId || null,
    quantity:     item.quantity,
    unit_price:   item.price,
    custom_build: item.customBuild || null,
  }))

  const { error: itemsErr } = await supabase
    .from('order_items')
    .insert(lineItems)

  if (itemsErr) return { order: null, error: itemsErr }

  return { order, error: null }
}

/**
 * getOrder — fetch order + items for the status page
 */
export async function getOrder(orderId) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()

  return { order, error }
}
