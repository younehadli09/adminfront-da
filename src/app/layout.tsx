import "./globals.css";
// import { ToasterProvider } from "@/lib/ToasterProvider";

// export const metadata: Metadata = {
//   title: "MerriAdmin",
//   description: "shop right now",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="flex max-lg:flex-col text-grey-1">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
