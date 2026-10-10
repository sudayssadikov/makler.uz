import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return typeof this.props.fallback === 'function'
          ? this.props.fallback(this.state.error, this.handleReset)
          : this.props.fallback;
      }

      return (
        <div style={{
          padding: 24,
          borderRadius: 16,
          background: 'var(--bg-card)',
          boxShadow: 'var(--neo-inset)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
          margin: '16px auto',
          maxWidth: 480
        }}>
          <h3 style={{ color: 'var(--danger)', marginBottom: 8 }}>Xatolik yuz berdi</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 16 }}>
            Iltimos, qayta urinib koʻring yoki sahifani yangilang.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              background: 'var(--primary)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Qayta urinish
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
