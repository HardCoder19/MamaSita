import { supabase } from './supabase'

const TAX_RATE = 0.08

/**
 * createOrder
 * 1. Inserts a customer row
 * 2. Creates the order row
 * 3. Inserts all order_items
 * Returns { order, error }
 */
export async function createOrder(customerInfo, cartItems) {
  console.log('[createOrder] starting with', customerInfo, cartItems)

  // --- 1. Insert customer ---
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({ name: customerInfo.name.trim(), email: customerInfo.email.trim().toLowerCase() })
    .select()
    .single()

  if (custErr) {
    console.error('[createOrder] customer insert error:', custErr)
    return { order: null, error: custErr }
  }
  console.log('[createOrder] customer created:', customer.id)

  // --- 2. Calculate totals ---
  const subtotal = parseFloat(cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2))
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total    = parseFloat((subtotal + tax).toFixed(2))

  // --- 3. Create order ---
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ customer_id: customer.id, subtotal, tax, total })
    .select()
    .single()

  if (orderErr) {
    console.error('[createOrder] order insert error:', orderErr)
    return { order: null, error: orderErr }
  }
  console.log('[createOrder] order created:', order.id)

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

  if (itemsErr) {
    console.error('[createOrder] order_items insert error:', itemsErr)
    return { order: null, error: itemsErr }
  }

  console.log('[createOrder] complete! order:', order.id)
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

/**
 * testConnection — quick smoke-test we can call to verify DB is reachable
 * Returns { ok: bool, message: string }
 */
export async function testConnection() {
  const { error } = await supabase.from('menu_items').select('id').limit(1)
  if (error) {
    console.error('[testConnection] failed:', error)
    return { ok: false, message: error.message || error.code || JSON.stringify(error) }
  }
  return { ok: true, message: 'Connected' }
}
