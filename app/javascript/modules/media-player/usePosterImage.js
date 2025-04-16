import speakerImage from 'assets/images/speaker.png';
import { useEffect, useRef, useState } from 'react';

export default function usePosterImage(interview) {
    const [posterUrl, setPosterUrl] = useState(null);
    const [stillImageError, setStillImageError] = useState(false);
    const loadingAttemptRef = useRef(false);

    useEffect(() => {
        // Prevent multiple concurrent loading attempts
        if (!interview || loadingAttemptRef.current) return;

        // Start with a clean state for each interview
        setStillImageError(false);

        // No still_url, use fallback immediately
        if (!interview.still_url) {
            setPosterUrl(createFallbackPoster(interview));
            setStillImageError(true);
            return;
        }

        loadingAttemptRef.current = true;

        // Clear any cached results by adding a timestamp
        const uncachedUrl = `${interview.still_url}?_=${Date.now()}`;

        // Create a new image to test loading
        const img = new Image();

        img.onload = () => {
            // If the image loaded successfully, use the original URL (without timestamp)
            setPosterUrl(interview.still_url);
            setStillImageError(false);
            loadingAttemptRef.current = false;
            console.log('Image loaded successfully:', interview.still_url);
        };

        img.onerror = () => {
            // If the image failed to load, use fallback
            setPosterUrl(createFallbackPoster(interview));
            setStillImageError(true);
            loadingAttemptRef.current = false;
            console.log('Image failed to load:', interview.still_url);
        };

        // Start loading the image with cache-busting parameter
        img.src = uncachedUrl;

        return () => {
            // Cleanup function to prevent state updates after unmount
            img.onload = null;
            img.onerror = null;
            loadingAttemptRef.current = false;
        };
    }, [interview]);

    // If we're still determining the poster URL, return a loading state
    if (posterUrl === null) {
        return {
            // Temporary value while determining the actual URL
            posterUrl: createFallbackPoster(interview),
            stillImageError: false,
        };
    }

    return {
        posterUrl,
        stillImageError,
    };
}

function createFallbackPoster(interview) {
    const iconType = interview?.media_type || 'default';
    const iconColor = '#ffffff';
    const horizontalPosition = 50; // Centered horizontally
    const verticalPosition = 50; // Centered vertically

    console.log('iconType', iconType);

    let iconPath;

    switch (iconType) {
        case 'video':
            iconPath =
                'M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z';
            break;
        case 'audio':
            iconPath =
                'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
            break;
        default:
            iconPath =
                'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z';
    }

    // Generate SVG with the icon properly centered and adjusted for control bar
    const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    <rect width="100" height="100" fill="#000000" opacity="0.8"/>
    <g transform="translate(${horizontalPosition}, ${verticalPosition})" text-anchor="middle" dominant-baseline="middle">
      <g transform="translate(-12, -12) scale(1)">
        <path d="${iconPath}" fill="${iconColor}"/>
      </g>
    </g>
  </svg>`;

    try {
        return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
    } catch (e) {
        return getAbsoluteUrl(speakerImage);
    }
}

// Convert relative path to absolute URL
const getAbsoluteUrl = (relativePath) => {
    if (!relativePath) return null;

    // If it's already an absolute URL, return it as is
    if (relativePath.startsWith('http') || relativePath.startsWith('data:')) {
        return relativePath;
    }

    // Remove leading slash if it exists
    const path = relativePath.startsWith('/')
        ? relativePath.substring(1)
        : relativePath;

    // Create absolute URL using window.location.origin
    return `${window.location.origin}/${path}`;
};
