import Link from "next/link";

export const metadata = { robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <html lang="ru">
      <head>
        <meta name="robots" content="noindex, follow" />
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#090909",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div>
          <p style={{ fontSize: 64, fontWeight: 900, margin: 0 }}>404</p>
          <p style={{ color: "#9f9f9f" }}>
            Страница не найдена / Pagina nu a fost găsită / Page not found
          </p>
          <Link
            href="/ru"
            style={{
              display: "inline-block",
              marginTop: 16,
              background: "#ed1b3f",
              color: "#fff",
              padding: "12px 18px",
              borderRadius: 12,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            Cangur Boxing Club
          </Link>
        </div>
      </body>
    </html>
  );
}
