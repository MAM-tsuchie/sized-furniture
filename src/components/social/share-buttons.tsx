'use client';

import { useState, useCallback } from 'react';
import { Share2, Check, Link2 } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
  className?: string;
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-hidden="true">
      <title>X</title>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LineIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-hidden="true">
      <title>LINE</title>
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" role="img" aria-hidden="true">
      <title>Pinterest</title>
      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641 0 12.017 0z" />
    </svg>
  );
}

export function ShareButtons({
  url,
  title,
  description,
  imageUrl,
  className = '',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url });
      } catch {
        // User cancelled
      }
    }
  }, [url, title, description]);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description || '');

  const xUrl = `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`;
  const pinterestUrl = imageUrl
    ? `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(imageUrl)}&description=${encodedDescription}`
    : `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`;

  const buttonBase =
    'inline-flex items-center justify-center w-10 h-10 rounded-full transition-colors';

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* X (Twitter) */}
      <a
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} bg-zinc-800 hover:bg-zinc-700 text-white`}
        aria-label="Xでシェア"
      >
        <XIcon className="w-4 h-4" />
      </a>

      {/* LINE */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} bg-[#06C755] hover:bg-[#05b34c] text-white`}
        aria-label="LINEでシェア"
      >
        <LineIcon className="w-5 h-5" />
      </a>

      {/* Pinterest */}
      <a
        href={pinterestUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`${buttonBase} bg-[#E60023] hover:bg-[#cc001f] text-white`}
        aria-label="Pinterestでシェア"
      >
        <PinterestIcon className="w-4 h-4" />
      </a>

      {/* Copy URL */}
      <button
        type="button"
        onClick={handleCopyUrl}
        className={`${buttonBase} ${
          copied
            ? 'bg-green-600 text-white'
            : 'bg-zinc-800 hover:bg-zinc-700 text-white'
        }`}
        aria-label="URLをコピー"
      >
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
      </button>

      {/* Native Share (mobile) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          type="button"
          onClick={handleNativeShare}
          className={`${buttonBase} bg-zinc-800 hover:bg-zinc-700 text-white`}
          aria-label="シェア"
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
