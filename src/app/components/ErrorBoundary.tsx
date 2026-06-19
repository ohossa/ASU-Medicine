import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col items-center justify-center p-6 font-manrope">
          <div className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-800/80 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-bl-[80px]" />
            
            <div className="flex items-center gap-4 mb-6 text-red-400">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-sm">
                <AlertTriangle size={24} />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-red-400/70">Application Error</span>
                <h2 className="font-archivo text-2xl font-black tracking-tight mt-0.5">Something went wrong</h2>
              </div>
            </div>

            <p className="text-sm text-gray-400 font-medium leading-relaxed mb-6">
              The application crashed due to an unexpected runtime error. This might be due to corrupted local cache or a sync conflict. You can try reloading or resetting the application data.
            </p>

            {this.state.error && (
              <div className="bg-black/40 rounded-2xl p-4 border border-gray-800/80 mb-8 overflow-auto max-h-48 font-mono text-xs text-red-350/90 leading-normal">
                <div className="font-bold mb-1 text-red-400">{this.state.error.toString()}</div>
                {this.state.errorInfo?.componentStack && (
                  <pre className="mt-2 text-gray-500/80 whitespace-pre-wrap leading-relaxed">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleReload}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-full text-xs font-bold transition-all border border-gray-700"
              >
                <RefreshCw size={14} />
                Reload Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-red-500 hover:bg-red-650 text-white rounded-full text-xs font-bold transition-all shadow-lg shadow-red-500/10"
              >
                <Trash2 size={14} />
                Reset Cache & Restart
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
