import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";

export const metadata: Metadata = {
  title: "Product Catalog",
  description: "Browse our collection of products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = 'light';
                  var stored = localStorage.getItem('app-storage');
                  if (stored) {
                    var parsed = JSON.parse(stored);
                    if (parsed && parsed.state && parsed.state.theme) {
                      theme = parsed.state.theme;
                    }
                  } else {
                    // No stored theme, use system preference and save it
                    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    localStorage.setItem('app-storage', JSON.stringify({
                      state: { theme: theme, isLoading: false },
                      version: 0
                    }));
                  }
                  // Apply theme class immediately
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Ignore errors
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          {/* Header with Theme Toggle */}
          {/* <header className="sticky top-0 z-50 w-full border-b border-black/8 bg-white/80 backdrop-blur-sm dark:border-white/14 dark:bg-black/80">
            <div className="mx-auto flex max-w-7xl items-center justify-end px-4 py-3 sm:px-6 lg:px-8">
              <ThemeToggle />
            </div>
          </header> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
