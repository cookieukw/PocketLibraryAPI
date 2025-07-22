import "./global.css";

import NavigationTabs from "@/components/NavigationTabs"


export const metadata = {
    metadataBase: new URL("https://b-pocket.vercel.app"),
    icons: {
        icon: "/icon-192-maskable.png",
        apple: "/icon-192.png"
    },
    openGraph: {
        keywords:
            "book, livro, opensource, source, dominio, publico, ccby0, cc, creative commons",
        title: "PocketLibrary",
        deScription:
            "Um aplicativo reimplementando os livros do site 'domínio publico', com novas funções e interface",
        url: "https://b-pocket.vercel.app/",
        type: "website",
        images: ["/icon-192.png"]
    }
};

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Tags que não são tratadas pelo objeto metadata */}
                <meta charSet="UTF-8" />
                <meta name="color-scheme" content="light dark" />
                {/* Links para ícones */}
                <link rel="icon" href="/icon-192-maskable.png" sizes="any" />
                <link rel="apple-touch-icon" href="/icon-192.png" />


            </head>
            <body>
            <NavigationTabs>
                {children}
            </NavigationTabs>
            </body>


        </html>
    );
}
