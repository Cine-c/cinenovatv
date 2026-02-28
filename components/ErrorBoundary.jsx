import { Component } from 'react';
import Link from 'next/link';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Something went wrong</h1>
          <p style={{ color: '#999', margin: '1rem 0' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Link href="/" style={{ color: '#e50914' }}>
            Go Home
          </Link>
        </div>
      );
    }

    return this.props.children;
  }
}
