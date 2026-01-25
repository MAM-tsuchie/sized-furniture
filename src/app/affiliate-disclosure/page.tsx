'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function AffiliateDisclosurePage() {
  const { language } = useTranslation();

  if (language === 'ja') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">アフィリエイト開示</h1>
        
        <div className="prose prose-slate max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <p className="text-blue-800 font-medium mb-0">
              当サイト「Sized Furniture」は、アフィリエイトプログラムに参加しています。
              当サイトのリンクを経由して商品を購入された場合、
              当サイトは紹介料を受け取る場合があります。
            </p>
          </div>
          
          <h2>参加しているアフィリエイトプログラム</h2>
          
          <h3>Amazonアソシエイト・プログラム</h3>
          <p>
            当サイトは、Amazon.co.jpを宣伝しリンクすることによって
            サイトが紹介料を獲得できる手段を提供することを目的に設定された
            アフィリエイトプログラムである、Amazonアソシエイト・プログラムの参加者です。
          </p>
          
          <h3>楽天アフィリエイト</h3>
          <p>
            当サイトは、楽天アフィリエイトに参加しています。
            楽天市場の商品リンクは、アフィリエイトリンクとなっています。
          </p>
          
          <h3>その他のアフィリエイトプログラム</h3>
          <p>
            当サイトは、以下のアフィリエイトプログラムにも参加している場合があります：
          </p>
          <ul>
            <li>もしもアフィリエイト</li>
            <li>バリューコマース</li>
            <li>A8.net</li>
            <li>CJ Affiliate（海外向け）</li>
            <li>Awin（海外向け）</li>
          </ul>
          
          <h2>アフィリエイトリンクの見分け方</h2>
          <p>
            当サイトの商品リンクは、すべてアフィリエイトリンクです。
            商品カードの「詳細を見る」「購入サイトへ」などのボタンを
            クリックした場合、外部ECサイトに移動します。
          </p>
          
          <h2>ユーザーへの影響</h2>
          <p>
            アフィリエイトリンクを経由しても、商品価格には一切影響しません。
            通常通りの価格で商品をご購入いただけます。
          </p>
          
          <h2>お問い合わせ</h2>
          <p>
            アフィリエイトに関するご質問は、下記までお問い合わせください。
          </p>
          <p>
            <a href="mailto:contact@example.com">contact@example.com</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Affiliate Disclosure</h1>
      
      <div className="prose prose-slate max-w-none">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <p className="text-blue-800 font-medium mb-0">
            Sized Furniture participates in affiliate programs.
            We may earn a referral fee when you purchase products through our links.
          </p>
        </div>
        
        <h2>Affiliate Programs We Participate In</h2>
        
        <h3>Amazon Associates Program</h3>
        <p>
          This site is a participant in the Amazon Associates Program,
          an affiliate advertising program designed to provide a means for sites
          to earn advertising fees by advertising and linking to Amazon.
        </p>
        
        <h3>Rakuten Affiliate (Japan)</h3>
        <p>
          This site participates in the Rakuten Affiliate program.
          Links to Rakuten products are affiliate links.
        </p>
        
        <h3>Other Affiliate Programs</h3>
        <p>
          This site may also participate in the following affiliate programs:
        </p>
        <ul>
          <li>CJ Affiliate</li>
          <li>Awin</li>
          <li>ShareASale</li>
          <li>Impact</li>
        </ul>
        
        <h2>Identifying Affiliate Links</h2>
        <p>
          All product links on this site are affiliate links.
          When you click &quot;View Details&quot; or &quot;Buy Now&quot; buttons,
          you will be redirected to external e-commerce sites.
        </p>
        
        <h2>Impact on Users</h2>
        <p>
          Using affiliate links does not affect product prices.
          You can purchase products at the same price as usual.
        </p>
        
        <h2>Contact Us</h2>
        <p>
          For questions about our affiliate relationships, please contact:
        </p>
        <p>
          <a href="mailto:contact@example.com">contact@example.com</a>
        </p>
      </div>
    </div>
  );
}
