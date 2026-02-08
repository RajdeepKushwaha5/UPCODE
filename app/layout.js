import "./globals.css";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { getServerSession } from "next-auth";
import SessionProvider from "../components/SessionProvider";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProfileSetupCheck from "../components/ProfileSetupCheck";
import Chatbot from "../components/Chatbot";

export const metadata = {
  title: "UPCODE - Your Coding Ground",
  description: "Best Coding platform for all your needs",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default async function RootLayout({ children }) {
  let session = null;

  try {
    session = await getServerSession();
  } catch (error) {
    // Handle JWT session errors gracefully (happens when NEXTAUTH_URL changes)
    console.warn('Session error (likely due to URL change):', error.message);
    session = null;
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="theme-color" content="#f8fafc" />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('upcode-theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0c0c14');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="theme-bg theme-text transition-colors duration-200 flex flex-col min-h-screen">
        <SessionProvider session={session}>
          <ThemeProvider>
            <ProfileSetupCheck>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <Chatbot />
            </ProfileSetupCheck>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}