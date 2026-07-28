export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-white/[0.06] pt-5 pb-5 text-center">
      <p className="font-brand text-xl tracking-wide text-on-surface/80">
        몽글
      </p>
      <p className="mt-2.5 text-[12px] leading-relaxed tracking-wide text-on-surface-variant/65">
        © {year} by{" "}
        <a
          href="https://github.com/august5pm"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant/85 transition-colors hover:text-on-surface"
        >
          august5pm
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
