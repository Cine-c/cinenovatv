import { getStripe } from '../../../lib/stripe';
import { verifyFirebaseToken } from '../../../lib/verify-firebase-token';
import { getUserDoc, setUserDoc } from '../../../lib/firestore-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify Firebase auth
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    const { uid, email } = await verifyFirebaseToken(idToken);

    const priceId = process.env.STRIPE_MONTHLY_PRICE_ID;

    if (!priceId) {
      return res.status(500).json({ error: 'Price ID not configured' });
    }

    const stripe = getStripe();

    // Get or create Stripe customer
    let userDoc = await getUserDoc(uid);
    let customerId = userDoc?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { firebaseUid: uid },
      });
      customerId = customer.id;
      await setUserDoc(uid, { email, stripeCustomerId: customerId });
    }

    // Create checkout session
    const origin = req.headers.origin || 'https://cinenovatv.com';
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/premium?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium`,
      subscription_data: {
        metadata: { firebaseUid: uid },
      },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout error:', err);
    if (err.message?.includes('token') || err.message?.includes('Token')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
