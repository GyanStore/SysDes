export default function Placeholder({ config }: { config?: { caption?: string } }) {
  return (
    <div className="panel p-6 grid place-items-center text-center min-h-[180px]">
      <div>
        <div className="text-3xl mb-2 animate-pulse2">🛰️</div>
        <div className="text-ink font-semibold">Signature simulation coming online</div>
        <p className="text-muted text-sm mt-1 max-w-sm">
          {config?.caption ?? "This concept's interactive instrument is on the build roadmap. The lesson, trade-off, and recall below are fully live."}
        </p>
      </div>
    </div>
  );
}
