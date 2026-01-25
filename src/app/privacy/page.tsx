'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function PrivacyPage() {
  const { language } = useTranslation();

  if (language === 'ja') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">プライバシーポリシー</h1>
        
        <div className="prose prose-slate max-w-none">
          <p>最終更新日：2026年1月25日</p>
          
          <h2>1. はじめに</h2>
          <p>
            Sized Furniture（以下「当サイト」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーでは、
            当サイトが収集する情報とその利用方法について説明します。
          </p>
          
          <h2>2. 収集する情報</h2>
          <h3>2.1 自動的に収集される情報</h3>
          <ul>
            <li>IPアドレス</li>
            <li>ブラウザの種類</li>
            <li>アクセス日時</li>
            <li>参照元URL</li>
            <li>閲覧したページ</li>
            <li>検索条件（サイズ、カテゴリなど）</li>
          </ul>
          
          <h3>2.2 Cookie</h3>
          <p>
            当サイトでは、ユーザー体験の向上およびアクセス解析のために
            Cookieを使用しています。Cookieには以下の種類があります：
          </p>
          <ul>
            <li><strong>必須Cookie</strong>：サイトの基本機能に必要</li>
            <li><strong>分析Cookie</strong>：アクセス解析用（Google Analytics等）</li>
            <li><strong>広告Cookie</strong>：関連広告の表示用</li>
          </ul>
          
          <h2>3. 情報の利用目的</h2>
          <ul>
            <li>サービスの提供および改善</li>
            <li>検索機能の最適化</li>
            <li>アクセス解析</li>
            <li>不正アクセスの防止</li>
          </ul>
          
          <h2>4. 第三者への情報提供</h2>
          <p>
            当サイトは、以下の場合を除き、ユーザーの個人情報を第三者に提供しません：
          </p>
          <ul>
            <li>ユーザーの同意がある場合</li>
            <li>法令に基づく場合</li>
            <li>サービス提供に必要な業務委託先への提供</li>
          </ul>
          
          <h2>5. アフィリエイトプログラム</h2>
          <p>
            当サイトは、以下のアフィリエイトプログラムに参加しています：
          </p>
          <ul>
            <li>Amazonアソシエイト・プログラム</li>
            <li>楽天アフィリエイト</li>
            <li>その他のASP（アフィリエイト・サービス・プロバイダー）</li>
          </ul>
          <p>
            これらのプログラムの参加者として、ユーザーが当サイト経由で
            商品を購入した場合、紹介料が当サイトに支払われることがあります。
          </p>
          
          <h2>6. ユーザーの権利</h2>
          <p>
            ユーザーは、自身の個人情報について以下の権利を有します：
          </p>
          <ul>
            <li>アクセス権：収集された情報の開示を求める権利</li>
            <li>訂正権：不正確な情報の訂正を求める権利</li>
            <li>削除権：情報の削除を求める権利</li>
            <li>オプトアウト：Cookie の無効化</li>
          </ul>
          
          <h2>7. お問い合わせ</h2>
          <p>
            プライバシーポリシーに関するお問い合わせは、
            下記メールアドレスまでお願いいたします。
          </p>
          <p>
            <a href="mailto:privacy@example.com">privacy@example.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p>Last updated: January 25, 2026</p>
        
        <h2>1. Introduction</h2>
        <p>
          Sized Furniture (&quot;we&quot;, &quot;our&quot;, or &quot;the site&quot;) respects your privacy
          and is committed to protecting your personal information.
          This Privacy Policy explains what information we collect and how we use it.
        </p>
        
        <h2>2. Information We Collect</h2>
        <h3>2.1 Automatically Collected Information</h3>
        <ul>
          <li>IP address</li>
          <li>Browser type</li>
          <li>Access date and time</li>
          <li>Referring URL</li>
          <li>Pages viewed</li>
          <li>Search criteria (size, category, etc.)</li>
        </ul>
        
        <h3>2.2 Cookies</h3>
        <p>
          We use cookies to improve user experience and for analytics.
          Types of cookies we use:
        </p>
        <ul>
          <li><strong>Essential Cookies</strong>: Required for basic site functionality</li>
          <li><strong>Analytics Cookies</strong>: For access analysis (Google Analytics, etc.)</li>
          <li><strong>Advertising Cookies</strong>: For displaying relevant ads</li>
        </ul>
        
        <h2>3. How We Use Information</h2>
        <ul>
          <li>Providing and improving our services</li>
          <li>Optimizing search functionality</li>
          <li>Access analysis</li>
          <li>Preventing unauthorized access</li>
        </ul>
        
        <h2>4. Sharing Information with Third Parties</h2>
        <p>
          We do not share your personal information with third parties except:
        </p>
        <ul>
          <li>With your consent</li>
          <li>When required by law</li>
          <li>With service providers necessary for our operations</li>
        </ul>
        
        <h2>5. Affiliate Programs</h2>
        <p>
          This site participates in the following affiliate programs:
        </p>
        <ul>
          <li>Amazon Associates Program</li>
          <li>Rakuten Affiliate (Japan)</li>
          <li>Other ASPs (Affiliate Service Providers)</li>
        </ul>
        
        <h2>6. Your Rights</h2>
        <p>You have the following rights regarding your personal information:</p>
        <ul>
          <li>Right of access</li>
          <li>Right to rectification</li>
          <li>Right to erasure</li>
          <li>Right to opt-out of cookies</li>
        </ul>
        
        <h2>7. Contact Us</h2>
        <p>
          For questions about this Privacy Policy, please contact us at:
        </p>
        <p>
          <a href="mailto:privacy@example.com">privacy@example.com</a>
        </p>
      </div>
    </div>
  );
}
