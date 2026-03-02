import { getStripe } from '../../../lib/stripe';
import { setUserDoc } from '../../../lib/firestore-admin';

export const config = {
  api: { bodyParser: false },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = getStripe();
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid signature' });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription);
          const uid = subscription.metadata?.firebaseUid;
          if (uid) {
            await setUserDoc(uid, {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              currentPeriodEnd: subscription.current_period_end,
              planInterval: subscription.items.data[0]?.plan?.interval || 'month',
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          await setUserDoc(uid, {
            subscriptionId: subscription.id,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            planInterval: subscription.items.data[0]?.plan?.interval || 'month',
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const uid = subscription.metadata?.firebaseUid;
        if (uid) {
          await setUserDoc(uid, {
            subscriptionId: subscription.id,
            subscriptionStatus: 'canceled',
            currentPeriodEnd: subscription.current_period_end,
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: 'Webhook handler failed' });
  }

  return res.status(200).json({ received: true });
}
