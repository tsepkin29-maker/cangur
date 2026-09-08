import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-[var(--a-line)] bg-[var(--a-bg)]/95 px-4 py-3 backdrop-blur sm:px-6">
      <Link
        href="/admin"
        className="text-[15px] font-black tracking-wide"
        style={{ fontFamily: "var(--font-onest), sans-serif" }}
      >
        CANGUR <span className="text-[var(--a-muted)]">ADMIN</span>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <a
          href="/ru"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn"
        >
          Открыть сайт ↗
        </a>
        <form action="/admin/logout" method="post">
          <button type="submit" className="admin-btn admin-btn--danger">
            Выйти
          </button>
        </form>
      </div>
    </header>
  );
}
