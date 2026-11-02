import { Component, ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error in React ErrorBoundary:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-3xl bg-danger/10 text-danger border border-danger/20 flex items-center justify-center mb-4 animate-bounce">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-bold text-foreground mb-1">
            حدث خطأ غير متوقع أثناء عرض هذه الصفحة
          </h2>
          <p className="text-xs text-muted-foreground max-w-md mb-6 leading-relaxed">
            نعتذر عن هذا الخطأ، تم تسجيل تفاصيل المشكلة. يمكنك محاولة إعادة تحميل الصفحة أو العودة إلى لوحة التحكم الرئيسية.
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={this.handleReset}
              variant="default"
              className="gap-2 text-xs h-9 rounded-xl"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة المحاولة</span>
            </Button>
            <Button
              onClick={() => {
                window.location.href = '/dashboard';
              }}
              variant="outline"
              className="gap-2 text-xs h-9 rounded-xl"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الرئيسية</span>
            </Button>
          </div>

          {import.meta.env.DEV && this.state.error && (
            <div className="mt-8 text-start max-w-xl w-full p-4 rounded-xl bg-muted/60 border border-border text-left font-mono text-[11px] text-danger overflow-auto max-h-48" dir="ltr">
              <p className="font-bold">{this.state.error.toString()}</p>
              <pre className="mt-2 text-[10px] text-muted-foreground whitespace-pre-wrap">
                {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
