import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SEOHead from '../components/seo/SEOHead';
import { useAuth } from '../components/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [sub, setSub] = useState(null);
  const [subLoading, setSubLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?redirect=/account');
    }
  }, [authLoading, user, router]);

  // Fetch subscription data
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchSub() {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        if (cancelled) return;
        if (snap.exists()) {
          setSub(snap.data());
        }
      } catch (err) {
        console.error('Failed to fetch subscription:', err);
      } finally {
        if (!cancelled) setSubLoading(false);
      }
    }

    fetchSub();
    return () => { cancelled = true; };
  }, [user]);

  async function handleManageSubscription() {
    if (!user) return;
    setPortalLoading(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Something went wrong.');
      }
    } catch {
      alert('Failed to open billing portal.');
    } finally {
      setPortalLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (authLoading || !user) {
    return null;
  }

  const isActive = sub?.subscriptionStatus === 'active'
    && sub?.currentPeriodEnd > Math.floor(Date.now() / 1000);

  const nextBillingDate = sub?.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null;

  return (
    <>
      <SEOHead
        title="Account - CineNovaTV"
        description="Manage your CineNovaTV account and subscription."
        url="/account"
      />

      <div className="account-page">
        <h1>Your Account</h1>

        <div className="account-section">
          <h2>Profile</h2>
          <div className="account-detail">
            <span className="account-label">Email</span>
            <span>{user.email}</span>
          </div>
          {user.displayName && (
            <div className="account-detail">
              <span className="account-label">Name</span>
              <span>{user.displayName}</span>
            </div>
          )}
        </div>

        <div className="account-section">
          <h2>Subscription</h2>
          {subLoading ? (
            <p className="account-muted">Loading subscription details...</p>
          ) : isActive ? (
            <>
              <div className="account-detail">
                <span className="account-label">Status</span>
                <span className="account-status-active">Active</span>
              </div>
              <div className="account-detail">
                <span className="account-label">Plan</span>
                <span>{sub.planInterval === 'year' ? 'Yearly' : 'Monthly'}</span>
              </div>
              {nextBillingDate && (
                <div className="account-detail">
                  <span className="account-label">Next billing date</span>
                  <span>{nextBillingDate}</span>
                </div>
              )}
              <button
                className="btn btn-secondary account-btn"
                onClick={handleManageSubscription}
                disabled={portalLoading}
              >
                {portalLoading ? 'Loading...' : 'Manage Subscription'}
              </button>
            </>
          ) : (
            <>
              <p className="account-muted">
                {sub?.subscriptionStatus === 'canceled'
                  ? 'Your subscription has been canceled.'
                  : 'You don\'t have an active subscription.'}
              </p>
              <button
                className="btn btn-primary account-btn"
                onClick={() => router.push('/premium')}
              >
                Subscribe to Premium
              </button>
            </>
          )}
        </div>

        <div className="account-section">
          <button className="btn btn-secondary account-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
