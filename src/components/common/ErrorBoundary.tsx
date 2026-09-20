import { Component, type ReactNode, type ErrorInfo } from 'react';
import { ErrorDisplay } from './ErrorDisplay';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '40px auto' }}>
          <ErrorDisplay
            title="Application Error Intercepted"
            message={this.state.error?.message || 'An unexpected rendering error occurred.'}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
