import CryptoJS from 'crypto-js';

/**
 * AWS Signature Version 4 署名生成
 */
export class AwsSignature {
  private accessKey: string;
  private secretKey: string;
  private region: string;
  private service: string;

  constructor(accessKey: string, secretKey: string, region: string, service: string = 'ProductAdvertisingAPI') {
    this.accessKey = accessKey;
    this.secretKey = secretKey;
    this.region = region;
    this.service = service;
  }

  /**
   * 署名済みヘッダーを生成
   */
  sign(
    method: string,
    host: string,
    path: string,
    headers: Record<string, string>,
    payload: string
  ): Record<string, string> {
    const now = new Date();
    const amzDate = this.getAmzDate(now);
    const dateStamp = this.getDateStamp(now);

    // ペイロードのハッシュ
    const payloadHash = CryptoJS.SHA256(payload).toString(CryptoJS.enc.Hex);

    // ヘッダーを準備
    const signedHeaders = {
      ...headers,
      'host': host,
      'x-amz-date': amzDate,
      'x-amz-content-sha256': payloadHash,
    };

    // 署名するヘッダー名のリスト
    const signedHeaderNames = Object.keys(signedHeaders)
      .map(k => k.toLowerCase())
      .sort()
      .join(';');

    // Canonical Request
    const canonicalHeaders = Object.keys(signedHeaders)
      .map(k => k.toLowerCase())
      .sort()
      .map(k => `${k}:${signedHeaders[k as keyof typeof signedHeaders]}`)
      .join('\n');

    const canonicalRequest = [
      method,
      path,
      '', // query string (empty for POST)
      canonicalHeaders,
      '',
      signedHeaderNames,
      payloadHash,
    ].join('\n');

    // String to Sign
    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${this.region}/${this.service}/aws4_request`;
    const canonicalRequestHash = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);

    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      canonicalRequestHash,
    ].join('\n');

    // 署名キーを生成
    const signingKey = this.getSignatureKey(dateStamp);

    // 署名を計算
    const signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

    // Authorization ヘッダー
    const authorization = `${algorithm} Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaderNames}, Signature=${signature}`;

    return {
      ...signedHeaders,
      'Authorization': authorization,
    };
  }

  private getSignatureKey(dateStamp: string): CryptoJS.lib.WordArray {
    const kDate = CryptoJS.HmacSHA256(dateStamp, `AWS4${this.secretKey}`);
    const kRegion = CryptoJS.HmacSHA256(this.region, kDate);
    const kService = CryptoJS.HmacSHA256(this.service, kRegion);
    const kSigning = CryptoJS.HmacSHA256('aws4_request', kService);
    return kSigning;
  }

  private getAmzDate(date: Date): string {
    return date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  }

  private getDateStamp(date: Date): string {
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
}
