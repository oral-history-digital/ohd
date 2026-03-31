import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import { FaImage } from 'react-icons/fa';

export default function SmartImage({
    src,
    alt,
    className,
    aspectRatio = '16 / 9',
    lazy = true,
    previewSrc = null,
    objectFit = 'contain',
    ...rest
}) {
    const [status, setStatus] = useState('loading'); // loading | loaded | error
    const [visible, setVisible] = useState(!lazy);
    const containerRef = useRef(null);

    // Reset loading state when src changes
    useEffect(() => {
        if (!src) {
            setStatus('error');
        } else {
            setStatus('loading');
        }
    }, [src]);

    /*
     * Lazy loading with IntersectionObserver
     *
     * Instead of loading the image immediately, we wait until the component
     * enters the viewport. The rootMargin allows loading slightly before the
     * image becomes visible, improving perceived performance.
     */
    useEffect(() => {
        if (!lazy) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '200px',
            }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [lazy]);

    return (
        <div
            ref={containerRef}
            className={`SmartImage ${className || ''}`}
            style={{ aspectRatio }}
            {...rest}
        >
            {/* Skeleton shown while the main image loads */}
            {status === 'loading' && <div className="SmartImage--skeleton" />}

            {/* Placeholder if image fails to load */}
            {status === 'error' && (
                <div className="SmartImage--placeholder">
                    <FaImage />
                </div>
            )}

            {/* Optional blurred preview (low-resolution image) */}
            {previewSrc && status === 'loading' && (
                <img
                    src={previewSrc}
                    alt=""
                    aria-hidden
                    className="SmartImage--preview"
                />
            )}

            {/* Main image */}
            {visible && src && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setStatus('loaded')}
                    onError={() => setStatus('error')}
                    className={`SmartImage--img ${
                        status === 'loaded' ? 'SmartImage--imgLoaded' : ''
                    }`}
                    style={{ objectFit }}
                />
            )}
        </div>
    );
}

SmartImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    aspectRatio: PropTypes.string,
    lazy: PropTypes.bool,
    previewSrc: PropTypes.string,
    onClick: PropTypes.func,
    objectFit: PropTypes.oneOf([
        'contain',
        'cover',
        'fill',
        'none',
        'scale-down',
    ]),
};
