'use client';

import { useTranslation } from '@/lib/i18n/context';

export default function AboutPage() {
  const { language } = useTranslation();

  if (language === 'ja') {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">このサイトについて</h1>
        
        <div className="prose prose-slate max-w-none">
          <h2>Sized Furniture とは</h2>
          <p>
            Sized Furniture は、サイズで家具を検索できるサービスです。
            「この場所に置ける家具が欲しいけど、サイズで絞り込めない…」という悩みを解決します。
          </p>
          
          <h2>サービスの特徴</h2>
          <ul>
            <li><strong>サイズ検索</strong>：幅・奥行き・高さを指定して、ぴったりの家具を見つけられます</li>
            <li><strong>木材で絞り込み</strong>：ウォールナット、オークなど、木材の種類で絞り込めます</li>
            <li><strong>複数ショップ比較</strong>：Amazon、楽天など複数のECサイトから商品を探せます</li>
          </ul>
          
          <h2>運営について</h2>
          <p>
            当サイトは個人が運営するアフィリエイトサイトです。
            掲載されている商品リンクはアフィリエイトリンクであり、
            リンク経由で商品を購入された場合、当サイトが紹介料を受け取る場合があります。
          </p>
          
          <h2>免責事項</h2>
          <p>
            商品情報は各ECサイトのAPIを通じて取得しており、
            情報の正確性には万全を期しておりますが、
            最新の価格・在庫状況は各ECサイトにてご確認ください。
          </p>
          
          <h2>お問い合わせ</h2>
          <p>
            サイトに関するお問い合わせは、下記メールアドレスまでお願いいたします。
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
      <h1 className="text-3xl font-bold text-slate-900 mb-8">About Us</h1>
      
      <div className="prose prose-slate max-w-none">
        <h2>What is Sized Furniture?</h2>
        <p>
          Sized Furniture is a service that allows you to search for furniture by size.
          We solve the problem of &quot;I want furniture that fits this space, but I can&apos;t filter by size.&quot;
        </p>
        
        <h2>Features</h2>
        <ul>
          <li><strong>Size Search</strong>: Specify width, depth, and height to find the perfect furniture</li>
          <li><strong>Filter by Wood Type</strong>: Filter by walnut, oak, and other wood types</li>
          <li><strong>Compare Multiple Shops</strong>: Browse products from Amazon, Rakuten, and more</li>
        </ul>
        
        <h2>About Our Operation</h2>
        <p>
          This site is an affiliate site operated by an individual.
          Product links on this site are affiliate links, and we may receive a referral fee
          if you purchase a product through our links.
        </p>
        
        <h2>Disclaimer</h2>
        <p>
          Product information is obtained through APIs from each e-commerce site.
          While we strive for accuracy, please check the latest prices and availability
          on each e-commerce site.
        </p>
        
        <h2>Contact</h2>
        <p>
          For inquiries about this site, please contact us at the email address below.
        </p>
        <p>
          <a href="mailto:contact@example.com">contact@example.com</a>
        </p>
      </div>
    </div>
  );
}
