import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-8">
            <span className="text-[#0D9488] text-4xl">✧</span>
          </div>
          <h1 className="text-2xl font-display font-medium text-gray-900 mb-4 tracking-tighter">A temporary shimmer in the aura</h1>
          <p className="text-sm text-gray-500 max-w-sm mb-12 leading-relaxed italic">
            "Beauty takes a moment to restore. We're polishing the vault for your return."
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-10 py-4 bg-gray-900 text-white text-[10px] uppercase tracking-[0.3em] font-black rounded-none hover:bg-[#0D9488] transition-all duration-500 shadow-xl"
          >
            Return to Store
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
