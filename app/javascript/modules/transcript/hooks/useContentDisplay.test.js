import { act, renderHook } from '@testing-library/react';

import { useContentDisplay } from './useContentDisplay';

describe('useContentDisplay', () => {
    let result;
    let rerender;

    const render = () => {
        const renderedHook = renderHook(() => useContentDisplay());
        result = renderedHook.result;
        rerender = renderedHook.rerender;
    };

    afterEach(() => {
        result = null;
        rerender = null;
    });

    it('initializes displayedContentType as null', () => {
        render();
        expect(result.current.displayedContentType).toBeNull();
    });

    it('provides handleToggleContentDisplay function', () => {
        render();
        expect(typeof result.current.handleToggleContentDisplay).toBe(
            'function'
        );
    });

    it('provides handleCloseContentDisplay function', () => {
        render();
        expect(typeof result.current.handleCloseContentDisplay).toBe(
            'function'
        );
    });

    it('returns object with all required properties', () => {
        render();

        expect(result.current).toHaveProperty('displayedContentType');
        expect(result.current).toHaveProperty('handleToggleContentDisplay');
        expect(result.current).toHaveProperty('handleCloseContentDisplay');
        expect(Object.keys(result.current).length).toBe(3);
    });

    it('maintains stable function references across renders', () => {
        render();
        const { handleToggleContentDisplay, handleCloseContentDisplay } =
            result.current;

        rerender();

        // The callbacks are created with useCallback so they should be stable
        expect(result.current.handleToggleContentDisplay).toBe(
            handleToggleContentDisplay
        );
        expect(result.current.handleCloseContentDisplay).toBe(
            handleCloseContentDisplay
        );
    });

    it('handleToggleContentDisplay is a function that accepts a contentType', () => {
        render();
        const { handleToggleContentDisplay } = result.current;

        act(() => {
            handleToggleContentDisplay('annotations');
        });

        expect(result.current.displayedContentType).toBe('annotations');
    });

    it('handleCloseContentDisplay is a function that can be called', () => {
        render();
        const { handleToggleContentDisplay, handleCloseContentDisplay } =
            result.current;

        act(() => {
            handleToggleContentDisplay('annotations');
        });
        act(() => {
            handleCloseContentDisplay();
        });

        expect(result.current.displayedContentType).toBeNull();
    });

    it('returns consistent structure on multiple renders', () => {
        render();
        const firstResult = result.current;

        rerender();

        expect(Object.keys(result.current).sort()).toEqual(
            Object.keys(firstResult).sort()
        );
    });
});
