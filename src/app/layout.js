// app/layout.js (server component)
import "./globals.css"; // if you have any global CSS
import ThemeRegistry from "./ThemeRegistry";

export const metadata = {
  title: "Chachee's Chai Cafe Mississuaga",
  description: "Dashboard for toggling AI agent calls.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
