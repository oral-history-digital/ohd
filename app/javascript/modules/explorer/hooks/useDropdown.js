import { useCallback, useEffect, useRef, useState } from 'react';

export function useDropdown({ align = 'left' } = {}) {
    const [open, setOpen] = useState(false);
    const [panelStyle, setPanelStyle] = useState({});
    const containerRef = useRef(null);
    const toggleRef = useRef(null);
    const panelRef = useRef(null);

    const computeStyle = useCallback(() => {
        if (!toggleRef.current) return;
        const rect = toggleRef.current.getBoundingClientRect();
        const viewportWidth = document.documentElement.clientWidth;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom - 4;
        const spaceAbove = rect.top - 4;
        const openUpward = spaceBelow < 120 && spaceAbove > spaceBelow;
        const availableSpace = openUpward ? spaceAbove : spaceBelow;
        const maxHeight = Math.max(80, Math.min(300, availableSpace - 8));

        const vertical = openUpward
            ? { bottom: viewportHeight - rect.top + 4 }
            : { top: rect.bottom + 4 };

        if (align === 'right') {
            setPanelStyle({
                position: 'fixed',
                ...vertical,
                right: viewportWidth - rect.right,
                minWidth: rect.width,
                maxHeight,
                zIndex: 1000,
            });
        } else {
            setPanelStyle({
                position: 'fixed',
                ...vertical,
                left: rect.left,
                width: rect.width,
                maxHeight,
                zIndex: 1000,
            });
        }
    }, [align]);

    useEffect(() => {
        if (!open) return;
        computeStyle();

        const handleClose = (e) => {
            if (
                !containerRef.current?.contains(e.target) &&
                !panelRef.current?.contains(e.target)
            )
                setOpen(false);
        };
        const handleReposition = () => computeStyle();

        document.addEventListener('mousedown', handleClose);
        window.addEventListener('scroll', handleReposition, true);
        window.addEventListener('resize', handleReposition);
        return () => {
            document.removeEventListener('mousedown', handleClose);
            window.removeEventListener('scroll', handleReposition, true);
            window.removeEventListener('resize', handleReposition);
        };
    }, [open, computeStyle]);

    const toggle = () => setOpen((p) => !p);
    const close = () => setOpen(false);

    return {
        open,
        toggle,
        close,
        containerRef,
        toggleRef,
        panelRef,
        panelStyle,
    };
}
