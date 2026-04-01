"use client";

import React, { ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-12 border border-red-500/20 bg-red-500/5 rounded-[3rem] text-center">
          <h2 className="text-3xl font-display mb-4">Something went wrong</h2>
          <p className="font-sans text-white/50 mb-8">We encountered an error while loading this component.</p>
          <button
            className="px-8 py-3 bg-red-500 text-white rounded-full font-display text-xl"
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
