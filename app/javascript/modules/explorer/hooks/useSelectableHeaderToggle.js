export function useSelectableHeaderToggle(onToggle) {
    const handleHeaderClick = () => {
        if (typeof window !== 'undefined') {
            const selection = window.getSelection?.();
            if (selection && selection.toString().trim().length > 0) {
                return;
            }
        }

        onToggle?.();
    };

    const handleHeaderKeyDown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle?.();
        }
    };

    return { handleHeaderClick, handleHeaderKeyDown };
}
