import type { Metadata } from "next";
import "./globals.css";
import Menubar from "@/components/Menubar";
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
    weight: ['400', '700'],  // Add weights you need
    subsets: ['latin'],      // Specify character subsets (e.g., latin, cyrillic)
});

export const metadata: Metadata = {
    title: "Hafstaff Brands",
    description: "Showcasing the best of Hafstaff Brands",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Menubar></Menubar>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
