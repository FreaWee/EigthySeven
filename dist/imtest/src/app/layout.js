import "./globals.css";
export const metadata = {
    title: "TIM",
    description: "",
};
export default function RootLayout({ children, }) {
    return (<html lang="en">
      <body className="bg-white">{children}</body>
    </html>);
}
