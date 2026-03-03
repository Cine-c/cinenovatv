import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Auto-reload once to recover from chunk load failures
    const key = 'errorBoundaryReload';
    const last = sessionStorage.getItem(key);
    if (!last || Date.now() - Number(last) > 10000) {
      sessionStorage.setItem(key, String(Date.now()));
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <h1>Something went wrong</h1>
          <p style={{ color: '#999', margin: '1rem 0' }}>
            An unexpected error occurred.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ color: '#e50914', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
