import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useThemeStore from "@/store/useThemeStore";

interface ThemeProviderProps {
  children: React.ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 1,
                        refetchOnWindowFocus: false,
                        staleTime: 1000 * 60, // Data fresh for 1 minute
                        gcTime: 1000 * 60 * 10, // Garbage collect unused cache after 10 minutes
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                {children}
                <Toaster
                    position="top-left"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            fontFamily: "inherit",
                            borderRadius: "12px",
                            background: "var(--card)",
                            color: "var(--card-foreground)",
                            border: "1px solid var(--border)",
                            boxShadow: "var(--shadow-lg)",
                            fontSize: "13px",
                            padding: "10px 16px",
                        },
                    }}
                />
            </ThemeProvider>
        </QueryClientProvider>
    );
}
