'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サイト情報 */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              {t.common.siteName}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {t.common.siteDescription}
            </p>
            <p className="text-xs text-slate-500">
              {t.product.affiliateNotice}
            </p>
          </div>

          {/* リンク */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 mb-3">
              {t.category.title}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/category/desks-tables" className="hover:text-slate-900">
                  {t.category.desks}
                </Link>
              </li>
              <li>
                <Link href="/category/chairs-seating" className="hover:text-slate-900">
                  {t.category.chairs}
                </Link>
              </li>
              <li>
                <Link href="/category/storage" className="hover:text-slate-900">
                  {t.category.storage}
                </Link>
              </li>
              <li>
                <Link href="/category/beds-bedding" className="hover:text-slate-900">
                  {t.category.beds}
                </Link>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h4 className="font-semibold text-sm text-slate-900 mb-3">
              {t.footer.about}
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/about" className="hover:text-slate-900">
                  {t.footer.about}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-900">
                  {t.footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900">
                  {t.footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/affiliate-disclosure" className="hover:text-slate-900">
                  {t.footer.affiliateDisclosure}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t border-slate-200">
          <p className="text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Sized Furniture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
