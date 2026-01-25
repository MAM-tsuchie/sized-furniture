import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-900 mb-2">
        ページが見つかりません
      </h2>
      <p className="text-slate-600 mb-8 text-center">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          ホームに戻る
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
        >
          検索する
        </Link>
      </div>
    </div>
  );
}
