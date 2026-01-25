'use client';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="ja">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-slate-50">
          <h1 className="text-6xl font-bold text-slate-300 mb-4">Error</h1>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            重大なエラーが発生しました
          </h2>
          <p className="text-slate-600 mb-8 text-center">
            申し訳ございません。システムエラーが発生しました。
            <br />
            しばらくしてから再度お試しください。
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            再試行
          </button>
        </div>
      </body>
    </html>
  );
}
