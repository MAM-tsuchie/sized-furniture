'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function TermsPage() {
  const { language } = useTranslation();

  if (language === 'ja') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">利用規約</h1>
        
        <div className="prose prose-slate max-w-none">
          <p>最終更新日：2026年1月25日</p>
          
          <h2>第1条（適用）</h2>
          <p>
            本規約は、Sized Furniture（以下「当サイト」）が提供するサービスの
            利用条件を定めるものです。ユーザーは本規約に同意の上、
            当サイトをご利用ください。
          </p>
          
          <h2>第2条（サービス内容）</h2>
          <p>
            当サイトは、家具のサイズ検索サービスを提供します。
            当サイトで表示される商品情報は、提携先ECサイトから取得したものであり、
            当サイトが直接販売を行うものではありません。
          </p>
          
          <h2>第3条（禁止事項）</h2>
          <p>ユーザーは、以下の行為を行ってはなりません：</p>
          <ul>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>当サイトのサーバーまたはネットワークの機能を妨害する行為</li>
            <li>当サイトの運営を妨害する行為</li>
            <li>他のユーザーに関する個人情報を収集または蓄積する行為</li>
            <li>他のユーザーになりすます行為</li>
            <li>当サイトに関連して反社会的勢力に対して直接または間接に利益を供与する行為</li>
            <li>スクレイピング、クローリング等による大量のデータ取得</li>
          </ul>
          
          <h2>第4条（免責事項）</h2>
          <ol>
            <li>
              当サイトに掲載されている商品情報（価格、在庫状況、サイズ等）は、
              提携先ECサイトのAPIを通じて取得しています。
              情報の正確性には万全を期しておりますが、
              最新の情報は各ECサイトにてご確認ください。
            </li>
            <li>
              当サイトからのリンク先で行われる商品の購入、
              および購入後のトラブルについて、当サイトは一切の責任を負いません。
            </li>
            <li>
              当サイトは、予告なくサービス内容の変更または終了を行う場合があります。
            </li>
          </ol>
          
          <h2>第5条（著作権）</h2>
          <p>
            当サイトに掲載されているコンテンツ（テキスト、画像、ロゴ等）の
            著作権は、当サイトまたは正当な権利者に帰属します。
            無断での複製、転載、改変等を禁止します。
          </p>
          
          <h2>第6条（アフィリエイト）</h2>
          <p>
            当サイトは、Amazonアソシエイト・プログラム、楽天アフィリエイト、
            その他のアフィリエイトプログラムに参加しています。
            商品リンクはアフィリエイトリンクであり、
            ユーザーがリンク経由で商品を購入した場合、
            当サイトが紹介料を受け取る場合があります。
          </p>
          
          <h2>第7条（規約の変更）</h2>
          <p>
            当サイトは、必要に応じて本規約を変更することがあります。
            変更後の規約は、当サイト上に掲載した時点で効力を生じます。
          </p>
          
          <h2>第8条（準拠法・管轄裁判所）</h2>
          <p>
            本規約の解釈には日本法を準拠法とします。
            当サイトに関して紛争が生じた場合、東京地方裁判所を
            第一審の専属的合意管轄裁判所とします。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-slate max-w-none">
        <p>Last updated: January 25, 2026</p>
        
        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service govern your use of Sized Furniture (&quot;the Site&quot;).
          By using the Site, you agree to these terms.
        </p>
        
        <h2>2. Service Description</h2>
        <p>
          The Site provides a furniture size search service.
          Product information displayed on the Site is obtained from partner e-commerce sites.
          We do not sell products directly.
        </p>
        
        <h2>3. Prohibited Activities</h2>
        <p>Users may not:</p>
        <ul>
          <li>Violate any laws or regulations</li>
          <li>Engage in criminal activity</li>
          <li>Interfere with site functionality</li>
          <li>Collect personal information of other users</li>
          <li>Impersonate other users</li>
          <li>Scrape or crawl the site for mass data collection</li>
        </ul>
        
        <h2>4. Disclaimer</h2>
        <ol>
          <li>
            Product information (prices, availability, sizes) is obtained through
            partner e-commerce site APIs. Please verify current information
            on each e-commerce site.
          </li>
          <li>
            We are not responsible for purchases made through external links
            or any resulting issues.
          </li>
          <li>
            We may change or discontinue the service without notice.
          </li>
        </ol>
        
        <h2>5. Copyright</h2>
        <p>
          Content on this site (text, images, logos) is owned by us
          or the rightful owners. Unauthorized reproduction is prohibited.
        </p>
        
        <h2>6. Affiliate Disclosure</h2>
        <p>
          This site participates in affiliate programs including Amazon Associates
          and others. We may receive referral fees when users purchase products
          through our links.
        </p>
        
        <h2>7. Changes to Terms</h2>
        <p>
          We may modify these terms as needed. Changes take effect
          when posted on the site.
        </p>
        
        <h2>8. Governing Law</h2>
        <p>
          These terms are governed by the laws of Japan.
        </p>
      </div>
    </div>
  );
}
