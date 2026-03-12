'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-600">
          <Link href="/blog" className="hover:text-neutral-400 transition-colors">
            ガイド
          </Link>
          <span className="text-neutral-800">·</span>
          <Link href="/about" className="hover:text-neutral-400 transition-colors">
            {t.footer.about}
          </Link>
          <span className="text-neutral-800">·</span>
          <Link href="/privacy" className="hover:text-neutral-400 transition-colors">
            {t.footer.privacy}
          </Link>
          <span className="text-neutral-800">·</span>
          <Link href="/terms" className="hover:text-neutral-400 transition-colors">
            {t.footer.terms}
          </Link>
          <span className="text-neutral-800">·</span>
          <span className="text-neutral-700">© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
