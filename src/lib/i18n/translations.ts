import type { Language } from '@/types';

export const translations = {
  ja: {
    common: {
      siteName: 'サイズで探す家具',
      siteDescription: 'ぴったりサイズの家具が見つかる',
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      noResults: '結果が見つかりませんでした',
      showMore: 'もっと見る',
      showLess: '閉じる',
      all: 'すべて',
      clear: 'クリア',
      apply: '適用',
      search: '検索',
      filter: '絞り込み',
      sort: '並び替え',
      close: '閉じる',
      back: '戻る',
      next: '次へ',
      previous: '前へ',
    },
    search: {
      title: 'サイズで家具を探す',
      subtitle: '幅・奥行き・高さを指定して、ぴったりの家具を見つけましょう',
      placeholder: 'キーワードで検索',
      width: '幅',
      depth: '奥行き',
      height: '高さ',
      min: '最小',
      max: '最大',
      unit: 'cm',
      tolerance: '許容誤差',
      searchButton: '検索する',
      advancedSearch: '詳細検索',
      resultsCount: '{count}件の商品が見つかりました',
      noResultsMessage: '条件に合う商品が見つかりませんでした',
      tryDifferent: '検索条件を変更してお試しください',
    },
    category: {
      title: 'カテゴリ',
      all: 'すべてのカテゴリ',
      desks: 'デスク・テーブル',
      chairs: '椅子・チェア',
      storage: '収納家具',
      beds: 'ベッド・寝具',
      sofas: 'ソファ・リビング',
    },
    color: {
      title: 'カラー',
      all: 'すべての色',
      wood: '木目',
      solid: 'ソリッドカラー',
      metallic: 'メタリック',
      woodType: '木材の種類',
    },
    product: {
      price: '価格',
      size: 'サイズ',
      color: 'カラー',
      material: '素材',
      brand: 'ブランド',
      viewDetails: '詳細を見る',
      buyNow: '購入サイトへ',
      outOfStock: '在庫なし',
      affiliateNotice: '※ このリンクはアフィリエイトリンクです',
    },
    sort: {
      relevance: '関連度順',
      priceAsc: '価格が安い順',
      priceDesc: '価格が高い順',
      newest: '新着順',
    },
    footer: {
      about: 'このサイトについて',
      privacy: 'プライバシーポリシー',
      terms: '利用規約',
      contact: 'お問い合わせ',
      affiliateDisclosure: 'アフィリエイト開示',
    },
  },
  en: {
    common: {
      siteName: 'Find Furniture by Size',
      siteDescription: 'Find furniture that fits perfectly',
      loading: 'Loading...',
      error: 'An error occurred',
      noResults: 'No results found',
      showMore: 'Show more',
      showLess: 'Show less',
      all: 'All',
      clear: 'Clear',
      apply: 'Apply',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
    },
    search: {
      title: 'Find Furniture by Size',
      subtitle: 'Specify width, depth, and height to find the perfect fit',
      placeholder: 'Search by keyword',
      width: 'Width',
      depth: 'Depth',
      height: 'Height',
      min: 'Min',
      max: 'Max',
      unit: 'cm',
      tolerance: 'Tolerance',
      searchButton: 'Search',
      advancedSearch: 'Advanced Search',
      resultsCount: '{count} products found',
      noResultsMessage: 'No products found matching your criteria',
      tryDifferent: 'Try adjusting your search criteria',
    },
    category: {
      title: 'Category',
      all: 'All Categories',
      desks: 'Desks & Tables',
      chairs: 'Chairs & Seating',
      storage: 'Storage Furniture',
      beds: 'Beds & Bedding',
      sofas: 'Sofas & Living',
    },
    color: {
      title: 'Color',
      all: 'All Colors',
      wood: 'Wood',
      solid: 'Solid Color',
      metallic: 'Metallic',
      woodType: 'Wood Type',
    },
    product: {
      price: 'Price',
      size: 'Size',
      color: 'Color',
      material: 'Material',
      brand: 'Brand',
      viewDetails: 'View Details',
      buyNow: 'Buy Now',
      outOfStock: 'Out of Stock',
      affiliateNotice: '* This is an affiliate link',
    },
    sort: {
      relevance: 'Relevance',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
      newest: 'Newest',
    },
    footer: {
      about: 'About',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      contact: 'Contact',
      affiliateDisclosure: 'Affiliate Disclosure',
    },
  },
  de: {
    common: {
      siteName: 'Möbel nach Größe finden',
      siteDescription: 'Finden Sie Möbel, die perfekt passen',
      loading: 'Laden...',
      error: 'Ein Fehler ist aufgetreten',
      noResults: 'Keine Ergebnisse gefunden',
      showMore: 'Mehr anzeigen',
      showLess: 'Weniger anzeigen',
      all: 'Alle',
      clear: 'Löschen',
      apply: 'Anwenden',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      close: 'Schließen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
    },
    search: {
      title: 'Möbel nach Größe finden',
      subtitle: 'Geben Sie Breite, Tiefe und Höhe an',
      placeholder: 'Nach Stichwort suchen',
      width: 'Breite',
      depth: 'Tiefe',
      height: 'Höhe',
      min: 'Min',
      max: 'Max',
      unit: 'cm',
      tolerance: 'Toleranz',
      searchButton: 'Suchen',
      advancedSearch: 'Erweiterte Suche',
      resultsCount: '{count} Produkte gefunden',
      noResultsMessage: 'Keine passenden Produkte gefunden',
      tryDifferent: 'Versuchen Sie andere Suchkriterien',
    },
    category: {
      title: 'Kategorie',
      all: 'Alle Kategorien',
      desks: 'Schreibtische & Tische',
      chairs: 'Stühle & Sitzmöbel',
      storage: 'Aufbewahrungsmöbel',
      beds: 'Betten & Bettwaren',
      sofas: 'Sofas & Wohnzimmer',
    },
    color: {
      title: 'Farbe',
      all: 'Alle Farben',
      wood: 'Holz',
      solid: 'Volltonfarbe',
      metallic: 'Metallic',
      woodType: 'Holzart',
    },
    product: {
      price: 'Preis',
      size: 'Größe',
      color: 'Farbe',
      material: 'Material',
      brand: 'Marke',
      viewDetails: 'Details ansehen',
      buyNow: 'Jetzt kaufen',
      outOfStock: 'Nicht auf Lager',
      affiliateNotice: '* Dies ist ein Affiliate-Link',
    },
    sort: {
      relevance: 'Relevanz',
      priceAsc: 'Preis: Aufsteigend',
      priceDesc: 'Preis: Absteigend',
      newest: 'Neueste',
    },
    footer: {
      about: 'Über uns',
      privacy: 'Datenschutz',
      terms: 'Nutzungsbedingungen',
      contact: 'Kontakt',
      affiliateDisclosure: 'Affiliate-Offenlegung',
    },
  },
  fr: {
    common: {
      siteName: 'Trouver des Meubles par Taille',
      siteDescription: 'Trouvez des meubles parfaitement adaptés',
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      noResults: 'Aucun résultat trouvé',
      showMore: 'Voir plus',
      showLess: 'Voir moins',
      all: 'Tout',
      clear: 'Effacer',
      apply: 'Appliquer',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
    },
    search: {
      title: 'Trouver des Meubles par Taille',
      subtitle: 'Spécifiez la largeur, la profondeur et la hauteur',
      placeholder: 'Rechercher par mot-clé',
      width: 'Largeur',
      depth: 'Profondeur',
      height: 'Hauteur',
      min: 'Min',
      max: 'Max',
      unit: 'cm',
      tolerance: 'Tolérance',
      searchButton: 'Rechercher',
      advancedSearch: 'Recherche avancée',
      resultsCount: '{count} produits trouvés',
      noResultsMessage: 'Aucun produit correspondant trouvé',
      tryDifferent: 'Essayez de modifier vos critères',
    },
    category: {
      title: 'Catégorie',
      all: 'Toutes les catégories',
      desks: 'Bureaux & Tables',
      chairs: 'Chaises & Sièges',
      storage: 'Rangement',
      beds: 'Lits & Literie',
      sofas: 'Canapés & Salon',
    },
    color: {
      title: 'Couleur',
      all: 'Toutes les couleurs',
      wood: 'Bois',
      solid: 'Couleur unie',
      metallic: 'Métallique',
      woodType: 'Type de bois',
    },
    product: {
      price: 'Prix',
      size: 'Taille',
      color: 'Couleur',
      material: 'Matériau',
      brand: 'Marque',
      viewDetails: 'Voir les détails',
      buyNow: 'Acheter',
      outOfStock: 'Rupture de stock',
      affiliateNotice: "* Ceci est un lien d'affiliation",
    },
    sort: {
      relevance: 'Pertinence',
      priceAsc: 'Prix croissant',
      priceDesc: 'Prix décroissant',
      newest: 'Plus récent',
    },
    footer: {
      about: 'À propos',
      privacy: 'Confidentialité',
      terms: "Conditions d'utilisation",
      contact: 'Contact',
      affiliateDisclosure: "Divulgation d'affiliation",
    },
  },
};

// 翻訳データの型定義（柔軟な型）
export interface TranslationData {
  common: {
    siteName: string;
    siteDescription: string;
    loading: string;
    error: string;
    noResults: string;
    showMore: string;
    showLess: string;
    all: string;
    clear: string;
    apply: string;
    search: string;
    filter: string;
    sort: string;
    close: string;
    back: string;
    next: string;
    previous: string;
  };
  search: {
    title: string;
    subtitle: string;
    placeholder: string;
    width: string;
    depth: string;
    height: string;
    min: string;
    max: string;
    unit: string;
    tolerance: string;
    searchButton: string;
    advancedSearch: string;
    resultsCount: string;
    noResultsMessage: string;
    tryDifferent: string;
  };
  category: {
    title: string;
    all: string;
    desks: string;
    chairs: string;
    storage: string;
    beds: string;
    sofas: string;
  };
  color: {
    title: string;
    all: string;
    wood: string;
    solid: string;
    metallic: string;
    woodType: string;
  };
  product: {
    price: string;
    size: string;
    color: string;
    material: string;
    brand: string;
    viewDetails: string;
    buyNow: string;
    outOfStock: string;
    affiliateNotice: string;
  };
  sort: {
    relevance: string;
    priceAsc: string;
    priceDesc: string;
    newest: string;
  };
  footer: {
    about: string;
    privacy: string;
    terms: string;
    contact: string;
    affiliateDisclosure: string;
  };
}

export type TranslationKey = keyof typeof translations.ja;
export type Translations = typeof translations;

/**
 * 翻訳を取得
 */
export function getTranslations(lang: Language): TranslationData {
  return (translations[lang] || translations.en) as TranslationData;
}

/**
 * テンプレート文字列を置換
 */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/{(\w+)}/g, (_, key) => String(values[key] ?? ''));
}
