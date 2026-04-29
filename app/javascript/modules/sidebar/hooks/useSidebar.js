import { useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import { hideSidebar, showSidebar, toggleSidebar } from '../actions';

export function useSidebar({
    showOnMount = false,
    hideOnMount = false,
    hideOnUnmount = false,
    showOnUnmount = false,
} = {}) {
    const dispatch = useDispatch();

    const show = useCallback(() => dispatch(showSidebar()), [dispatch]);
    const hide = useCallback(() => dispatch(hideSidebar()), [dispatch]);
    const toggle = useCallback(() => dispatch(toggleSidebar()), [dispatch]);

    useEffect(() => {
        if (hideOnMount) {
            hide();
        } else if (showOnMount) {
            show();
        }

        return () => {
            if (showOnUnmount) {
                show();
            } else if (hideOnUnmount) {
                hide();
            }
        };
    }, [show, hide, showOnMount, hideOnMount, showOnUnmount, hideOnUnmount]);

    return {
        show,
        hide,
        toggle,
    };
}

export function useShowSidebarOnMount({ hideOnUnmount = false } = {}) {
    useSidebar({ showOnMount: true, hideOnUnmount });
}

export function useHideSidebarOnMount({ showOnUnmount = false } = {}) {
    useSidebar({ hideOnMount: true, showOnUnmount });
}

export default useSidebar;
