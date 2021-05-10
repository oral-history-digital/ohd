export default function scrollSmoothlyTo(left, top) {
    const isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;

    if (isSmoothScrollSupported) {
        // Native smooth scrolling
        window.scrollTo({
            left,
            top,
            behavior: 'smooth',
        });
    } else {
        // Old way scrolling without effects
        window.scrollTo(left, top);
    }
}
