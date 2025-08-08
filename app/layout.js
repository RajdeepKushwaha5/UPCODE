import "./globals.css";
import Navbar from "../components/shared/Navbar";
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
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" sizes="32x32" />
        <link rel="shortcut icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body>
        <SessionProvider session={session}>
          <ThemeProvider>
            <ProfileSetupCheck>
              <Navbar />
              <main>
                {children}
              </main>
              <Chatbot />
            </ProfileSetupCheck>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}