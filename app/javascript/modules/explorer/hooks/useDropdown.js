import { useCallback, useEffect, useRef, useState } from 'react';

export function useDropdown({ align = 'left' } = {}) {
    const [open, setOpen] = useState(false);
    const [panelStyle, setPanelStyle] = useState({});
    const containerRef = useRef(null);
    const toggleRef = useRef(null);

    const computeStyle = useCallback(() => {
        if (!toggleRef.current) return;
        const rect = toggleRef.current.getBoundingClientRect();
        if (align === 'right') {
            setPanelStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                right: window.innerWidth - rect.right,
                minWidth: rect.width,
                zIndex: 1000,
            });
        } else {
            setPanelStyle({
                position: 'fixed',
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                zIndex: 1000,
            });
        }
    }, [align]);

    useEffect(() => {
        if (!open) return;
        computeStyle();

        const handleClose = (e) => {
            if (!containerRef.current?.contains(e.target)) setOpen(false);
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

    return { open, toggle, close, containerRef, toggleRef, panelStyle };
}
