-- AU / CA リージョンの追加
INSERT INTO regions (code, name, currency, currency_symbol, language, amazon_domain) VALUES
('au', 'Australia', 'AUD', 'A$', 'en', 'amazon.com.au'),
('ca', 'Canada', 'CAD', 'C$', 'en', 'amazon.ca');

-- ASPプロバイダーの対応リージョン更新
UPDATE asp_providers
SET supported_regions = ARRAY['jp', 'us', 'uk', 'de', 'fr', 'au', 'ca']
WHERE code = 'amazon';

UPDATE asp_providers
SET supported_regions = ARRAY['us', 'uk', 'de', 'fr', 'au', 'ca']
WHERE code IN ('cj', 'awin');
