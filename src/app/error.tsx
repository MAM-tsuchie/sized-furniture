'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // エラーをログ送信（本番環境では Sentry 等に送信）
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">500</h1>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        エラーが発生しました
      </h2>
      <p className="text-slate-600 mb-8 text-center">
        申し訳ございません。予期しないエラーが発生しました。
        <br />
        しばらくしてから再度お試しください。
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          再試行
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          ホームに戻る
        </a>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-red-50 rounded-lg max-w-xl">
          <p className="text-sm font-mono text-red-800 break-all">
            {error.message}
          </p>
        </div>
      )}
    </div>
  );
}
