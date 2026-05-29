// Stripe calls this URL when a payment event happens
// On successful payment, it grants the user access in Supabase

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Service role key — has full database access
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const userId = session.metadata?.userId;

    if (!userId) {
      console.error('No userId in session metadata');
      return { statusCode: 400, body: 'Missing userId' };
    }

    // Grant access in Supabase
    const { error } = await supabase.from('user_access').upsert({
      user_id: userId,
      has_access: true,
      access_type: 'paid',
      stripe_customer_id: session.customer,
      stripe_session_id: session.id,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    if (error) {
      console.error('Database error:', error);
      return { statusCode: 500, body: 'Database error' };
    }

    console.log(`Access granted for user ${userId}`);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
