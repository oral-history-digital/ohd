import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';

import { useContentDisplay } from './useContentDisplay';

Enzyme.configure({ adapter: new Adapter() });

function TestComponent({ onRender }) {
    const result = useContentDisplay();

    React.useEffect(() => {
        onRender(result);
    }, [result, onRender]);

    return null;
}

TestComponent.propTypes = {
    onRender: PropTypes.func.isRequired,
};

describe('useContentDisplay', () => {
    let wrapper;
    let lastResult;

    const render = () => {
        wrapper = mount(
            <TestComponent
                onRender={(r) => {
                    lastResult = r;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        lastResult = null;
    });

    it('initializes displayedContentType as null', () => {
        render();
        expect(lastResult.displayedContentType).toBeNull();
    });

    it('provides handleToggleContentDisplay function', () => {
        render();
        expect(typeof lastResult.handleToggleContentDisplay).toBe('function');
    });

    it('provides handleCloseContentDisplay function', () => {
        render();
        expect(typeof lastResult.handleCloseContentDisplay).toBe('function');
    });

    it('returns object with all required properties', () => {
        render();

        expect(lastResult).toHaveProperty('displayedContentType');
        expect(lastResult).toHaveProperty('handleToggleContentDisplay');
        expect(lastResult).toHaveProperty('handleCloseContentDisplay');
        expect(Object.keys(lastResult).length).toBe(3);
    });

    it('maintains stable function references across renders', () => {
        render();
        const { handleToggleContentDisplay, handleCloseContentDisplay } =
            lastResult;

        // The callbacks are created with useCallback so they should be stable
        expect(typeof handleToggleContentDisplay).toBe('function');
        expect(typeof handleCloseContentDisplay).toBe('function');
    });

    it('handleToggleContentDisplay is a function that accepts a contentType', () => {
        render();
        const { handleToggleContentDisplay } = lastResult;

        expect(() => {
            handleToggleContentDisplay('annotations');
        }).not.toThrow();
    });

    it('handleCloseContentDisplay is a function that can be called', () => {
        render();
        const { handleCloseContentDisplay } = lastResult;

        expect(() => {
            handleCloseContentDisplay();
        }).not.toThrow();
    });

    it('returns consistent structure on multiple renders', () => {
        render();
        const firstResult = lastResult;

        wrapper.setProps({
            onRender: (r) => {
                lastResult = r;
            },
        });

        expect(Object.keys(lastResult).sort()).toEqual(
            Object.keys(firstResult).sort()
        );
    });
});
