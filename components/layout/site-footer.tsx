export function SiteFooter() {
  return (
    <footer className="px-6 py-8 text-sm text-black/60">
      <div className="mx-auto flex w-full max-w-6xl justify-between gap-4">
        <span>© {new Date().getFullYear()} Muhamad Febian</span>
        <span>Built with Next.js</span>
      </div>
    </footer>
  );
}