'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import { useRegion } from '@/lib/region/context';

const CONSENT_COOKIE_NAME = 'cookie_consent';
const CONSENT_EXPIRY_DAYS = 365;

// GDPR対象国（EU/EEA）
const GDPR_COUNTRIES = ['de', 'fr', 'uk', 'at', 'be', 'bg', 'hr', 'cy', 'cz', 'dk', 'ee', 'fi', 'gr', 'hu', 'ie', 'it', 'lv', 'lt', 'lu', 'mt', 'nl', 'pl', 'pt', 'ro', 'sk', 'si', 'es', 'se', 'is', 'li', 'no'];

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const { language } = useTranslation();
  const { regionCode } = useRegion();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  // GDPR対象国かチェック
  const isGdprRegion = GDPR_COUNTRIES.includes(regionCode);

  useEffect(() => {
    // すでに同意済みかチェック
    const consent = getCookie(CONSENT_COOKIE_NAME);
    if (!consent && isGdprRegion) {
      setIsVisible(true);
    }
  }, [isGdprRegion]);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(necessaryOnly);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
    setIsVisible(false);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    setCookie(CONSENT_COOKIE_NAME, JSON.stringify(prefs), CONSENT_EXPIRY_DAYS);
    
    // Google Analytics の同意設定（gtag.js使用時）
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('consent', 'update', {
        analytics_storage: prefs.analytics ? 'granted' : 'denied',
        ad_storage: prefs.marketing ? 'granted' : 'denied',
      });
    }
  };

  if (!isVisible) return null;

  const isJapanese = language === 'ja';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-slate-200 shadow-lg">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">
              {isJapanese ? 'Cookieの使用について' : 'Cookie Consent'}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {isJapanese 
                ? '当サイトでは、ユーザー体験の向上とアクセス解析のためにCookieを使用しています。「すべて許可」をクリックすると、すべてのCookieに同意したことになります。'
                : 'We use cookies to improve your experience and for analytics. By clicking "Accept All", you consent to all cookies.'}
            </p>

            {showDetails && (
              <div className="space-y-3 mb-4 p-4 bg-slate-50 rounded-lg">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={preferences.necessary}
                    disabled
                    className="rounded"
                  />
                  <div>
                    <span className="font-medium text-sm">
                      {isJapanese ? '必須Cookie' : 'Necessary Cookies'}
                    </span>
                    <p className="text-xs text-slate-500">
                      {isJapanese 
                        ? 'サイトの基本機能に必要です（常に有効）'
                        : 'Required for basic site functionality (always enabled)'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="rounded"
                  />
                  <div>
                    <span className="font-medium text-sm">
                      {isJapanese ? '分析Cookie' : 'Analytics Cookies'}
                    </span>
                    <p className="text-xs text-slate-500">
                      {isJapanese 
                        ? 'アクセス解析用（Google Analytics等）'
                        : 'For analytics (Google Analytics, etc.)'}
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="rounded"
                  />
                  <div>
                    <span className="font-medium text-sm">
                      {isJapanese ? 'マーケティングCookie' : 'Marketing Cookies'}
                    </span>
                    <p className="text-xs text-slate-500">
                      {isJapanese 
                        ? '広告のパーソナライズ用'
                        : 'For personalized advertising'}
                    </p>
                  </div>
                </label>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={handleAcceptAll}>
            {isJapanese ? 'すべて許可' : 'Accept All'}
          </Button>
          <Button variant="outline" onClick={handleAcceptNecessary}>
            {isJapanese ? '必須のみ' : 'Necessary Only'}
          </Button>
          {showDetails ? (
            <Button variant="outline" onClick={handleSavePreferences}>
              {isJapanese ? '設定を保存' : 'Save Preferences'}
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setShowDetails(true)}>
              {isJapanese ? '詳細設定' : 'Customize'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Cookie操作ユーティリティ
function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}
