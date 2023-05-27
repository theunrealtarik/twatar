import { Component, ReactNode } from "react";

export default class ErrorBoundary extends Component<IErrorBoundaryProps> {
  state: {
    hasError?: boolean;
  };

  constructor(props: IErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  // componentDidCatch(error: any, info: { componentStack: any }) {}

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

interface IErrorBoundaryProps {
  fallback?: ReactNode;
  children?: ReactNode;
}
