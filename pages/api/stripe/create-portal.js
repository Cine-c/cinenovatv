import { getStripe } from '../../../lib/stripe';
import { verifyFirebaseToken } from '../../../lib/verify-firebase-token';
import { getUserDoc } from '../../../lib/firestore-admin';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.replace('Bearer ', '');
    const { uid } = await verifyFirebaseToken(idToken);

    const userDoc = await getUserDoc(uid);
    if (!userDoc?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const stripe = getStripe();
    const origin = req.headers.origin || 'https://cinenovatv.com';
    const session = await stripe.billingPortal.sessions.create({
      customer: userDoc.stripeCustomerId,
      return_url: `${origin}/account`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-portal error:', err);
    if (err.message?.includes('token') || err.message?.includes('Token')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return res.status(500).json({ error: 'Failed to create portal session' });
  }
}
