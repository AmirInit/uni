import { useEffect, useState } from 'react';
import { ImageIcon } from './Icons.jsx';

/** Deterministic hue per product so the fallback tile is stable, not random. */
const hueFor = (text) => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) % 360;
  return hash;
};

/**
 * How long to wait before giving up on an image.
 *
 * An unreachable host makes the request *hang* rather than fail, and `onError`
 * never fires — without this the card would sit on a grey placeholder forever.
 * That is exactly what happens when the demo machine has no internet.
 */
const LOAD_TIMEOUT_MS = 6000;

/**
 * Product image with a graceful fallback.
 *
 * Catalogue images are hosted on picsum.photos. If they can't be reached (or an
 * admin saves a broken URL) we render a tinted tile carrying the product name
 * instead of a broken-image icon, so the grid never looks unfinished.
 */
export const ProductImage = ({ src, alt, className = '', sizes }) => {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    // A new src (e.g. an admin edited the product) restarts the load cycle.
    setStatus(src ? 'loading' : 'error');
    if (!src) return undefined;

    const timer = setTimeout(
      () => setStatus((current) => (current === 'loading' ? 'error' : current)),
      LOAD_TIMEOUT_MS,
    );
    return () => clearTimeout(timer);
  }, [src]);

  if (status === 'error') {
    const hue = hueFor(alt || 'کالا');
    return (
      <span
        className={`flex flex-col items-center justify-center gap-2 p-3 text-center ${className}`}
        style={{
          background: `linear-gradient(145deg, hsl(${hue} 46% 93%), hsl(${(hue + 40) % 360} 40% 86%))`,
        }}
        role="img"
        aria-label={alt}
      >
        <ImageIcon className="h-7 w-7 shrink-0" style={{ color: `hsl(${hue} 35% 45%)` }} />
        <span
          className="line-clamp-2-fa max-w-[90%] text-[11px] leading-5 font-semibold"
          style={{ color: `hsl(${hue} 32% 32%)` }}
        >
          {alt}
        </span>
      </span>
    );
  }

  return (
    <span className="relative block h-full w-full overflow-hidden">
      {status === 'loading' && (
        <span className="skeleton absolute inset-0 block" aria-hidden="true" />
      )}
      {/* The image stays in layout (faded out rather than `display:none`) so that
          native lazy-loading still resolves its position correctly. */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes={sizes}
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
        className={`${className} transition-opacity duration-300 ${
          status === 'loading' ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </span>
  );
};

export default ProductImage;
