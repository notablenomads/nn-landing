export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="mt-3 max-w-md text-sm text-white/70">
        Check your connection and try again.
      </p>
    </main>
  );
}
