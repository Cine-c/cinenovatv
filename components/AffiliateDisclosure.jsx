export default function AffiliateDisclosure({ variant = 'inline' }) {
  if (variant === 'footer') {
    return (
      <p className="affiliate-disclosure affiliate-disclosure-footer">
        CineNovaTV is a participant in affiliate advertising programs including
        the Amazon Services LLC Associates Program. We may earn commissions from
        qualifying purchases made through links on this site, at no extra cost to
        you. All opinions are our own.
      </p>
    );
  }

  return (
    <p className="affiliate-disclosure affiliate-disclosure-inline">
      This page contains affiliate links. We may earn a small commission at no
      extra cost to you.
    </p>
  );
}
