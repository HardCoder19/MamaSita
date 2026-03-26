import { supabase } from './supabase'

const TAX_RATE = 0.08

// ─── Customer-side API ────────────────────────────────────────────────────────

export async function createOrder(customerInfo, cartItems, paymentMethod = 'card') {
  console.log('[createOrder] starting with', customerInfo, cartItems)

  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({ name: customerInfo.name.trim(), email: customerInfo.email.trim().toLowerCase() })
    .select()
    .single()

  if (custErr) { console.error('[createOrder] customer insert error:', custErr); return { order: null, error: custErr } }

  const subtotal = parseFloat(cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2))
  const tax      = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total    = parseFloat((subtotal + tax).toFixed(2))

  const isPaid    = paymentMethod === 'card'

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      customer_id:    customer.id,
      subtotal, tax, total,
      payment_method: paymentMethod,
      payment_status: isPaid ? 'paid'      : 'pending',
      status:         isPaid ? 'confirmed' : 'pending', // cash = needs counter auth
    })
    .select()
    .single()

  if (orderErr) { console.error('[createOrder] order insert error:', orderErr); return { order: null, error: orderErr } }

  const lineItems = cartItems.map(item => ({
    order_id:     order.id,
    menu_item_id: item.menuItemId || null,
    quantity:     item.quantity,
    unit_price:   item.price,
    custom_build: item.customBuild || null,
  }))

  const { error: itemsErr } = await supabase.from('order_items').insert(lineItems)
  if (itemsErr) { console.error('[createOrder] order_items error:', itemsErr); return { order: null, error: itemsErr } }

  return { order, error: null }
}

export async function getOrder(orderId) {
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()
  return { order, error }
}

export async function testConnection() {
  const { error } = await supabase.from('menu_items').select('id').limit(1)
  if (error) return { ok: false, message: error.message || error.code || JSON.stringify(error) }
  return { ok: true, message: 'Connected' }
}

// ─── Admin API ────────────────────────────────────────────────────────────────

/** Fetch all non-delivered orders with customer info + line items */
export async function getAdminOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*, customers(name, email), order_items(*, menu_items(name))')
    .neq('status', 'delivered')
    .order('created_at', { ascending: false })
  return { orders: data, error }
}

/** Fetch ALL orders (for analytics) */
export async function getAllOrders(since) {
  let query = supabase
    .from('orders')
    .select('*, customers(name, email), order_items(*, menu_items(name))')
    .order('created_at', { ascending: false })
  if (since) query = query.gte('created_at', since)
  const { data, error } = await query
  return { orders: data, error }
}

/** Move an order to the next status */
export async function updateOrderStatus(id, status) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  return { order: data, error }
}

/** Authorize a cash payment — moves to confirmed (enters cook queue) */
export async function authorizeOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'confirmed' })
    .eq('id', id)
    .select()
    .single()
  return { order: data, error }
}

/** Hard-delete an order (cascades to order_items) */
export async function deleteOrder(id) {
  const { error } = await supabase.from('orders').delete().eq('id', id)
  return { error }
}

/** Create a walk-up order at the counter */
export async function createManualOrder(customerInfo, cartItems, paymentMethod = 'cash') {
  const emailFallback = `walkin-${Date.now()}@mamasita.local`
  const { data: customer, error: custErr } = await supabase
    .from('customers')
    .insert({ name: customerInfo.name.trim(), email: (customerInfo.email || emailFallback).toLowerCase() })
    .select()
    .single()
  if (custErr) return { order: null, error: custErr }

  const subtotal       = parseFloat(cartItems.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2))
  const tax            = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const total          = parseFloat((subtotal + tax).toFixed(2))
  const status         = paymentMethod === 'card' ? 'confirmed' : 'pending'
  const payment_status = paymentMethod === 'card' ? 'paid'      : 'pending'

  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({ customer_id: customer.id, subtotal, tax, total, payment_method: paymentMethod, payment_status, status })
    .select()
    .single()
  if (orderErr) return { order: null, error: orderErr }

  const lineItems = cartItems.map(item => ({
    order_id:   order.id,
    quantity:   item.quantity,
    unit_price: item.price,
    custom_build: item.customBuild || null,
  }))

  const { error: itemsErr } = await supabase.from('order_items').insert(lineItems)
  if (itemsErr) return { order: null, error: itemsErr }

  return { order, error: null }
}
