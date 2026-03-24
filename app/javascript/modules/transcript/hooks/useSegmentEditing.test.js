import React from 'react';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import PropTypes from 'prop-types';
import { act } from 'react-dom/test-utils';

import { useSegmentEditing } from './useSegmentEditing';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/media-player', () => ({
    togglePlayerWidth: jest.fn(),
}));

function HookHarness(props) {
    return <InnerHarness {...props} />;
}

function InnerHarness({ onRender }) {
    const hook = useSegmentEditing();

    React.useEffect(() => {
        onRender(hook);
    }, [hook, onRender]);

    return null;
}

InnerHarness.propTypes = {
    onRender: PropTypes.func.isRequired,
};

describe('useSegmentEditing', () => {
    let wrapper;
    let hook;

    const render = () => {
        wrapper = mount(
            <HookHarness
                onRender={(h) => {
                    hook = h;
                }}
            />
        );
    };

    afterEach(() => {
        if (wrapper) wrapper.unmount();
        hook = null;
    });

    it('initializes editingSegmentId to null', () => {
        render();
        expect(hook.editingSegmentId).toBeNull();
    });

    it('initializes editingSegmentHasUnsavedChanges to false', () => {
        render();
        expect(hook.editingSegmentHasUnsavedChanges).toBe(false);
    });

    it('initializes showUnsavedWarning to false', () => {
        render();
        expect(hook.showUnsavedWarning).toBe(false);
    });

    it('provides editingSegmentIdRef', () => {
        render();
        expect(hook.editingSegmentIdRef).toBeDefined();
        expect(typeof hook.editingSegmentIdRef.current).not.toBe('undefined');
    });

    it('provides handleEditStart function', () => {
        render();
        expect(typeof hook.handleEditStart).toBe('function');
    });

    it('provides handleEditEnd function', () => {
        render();
        expect(typeof hook.handleEditEnd).toBe('function');
    });

    it('provides handleUnsavedChangesAttempt function', () => {
        render();
        expect(typeof hook.handleUnsavedChangesAttempt).toBe('function');
    });

    it('provides setEditingSegmentId function', () => {
        render();
        expect(typeof hook.setEditingSegmentId).toBe('function');
    });

    it('provides setEditingSegmentHasUnsavedChanges function', () => {
        render();
        expect(typeof hook.setEditingSegmentHasUnsavedChanges).toBe('function');
    });

    it('provides setShowUnsavedWarning function', () => {
        render();
        expect(typeof hook.setShowUnsavedWarning).toBe('function');
    });

    it('provides dismissUnsavedWarning function', () => {
        render();
        expect(typeof hook.dismissUnsavedWarning).toBe('function');
    });

    it('provides continueAfterUnsavedWarning function', () => {
        render();
        expect(typeof hook.continueAfterUnsavedWarning).toBe('function');
    });

    it('editingSegmentIdRef.current reflects initial null state', () => {
        render();
        expect(hook.editingSegmentIdRef.current).toBeNull();
    });

    it('handleEditEnd returns true and closes when there are no unsaved changes', () => {
        render();

        act(() => {
            hook.setEditingSegmentId(1);
        });
        wrapper.update();

        let result;
        act(() => {
            result = hook.handleEditEnd();
        });
        wrapper.update();

        expect(result).toBe(true);
    });

    it('handleEditEnd returns false and shows warning when unsaved changes exist', () => {
        render();

        act(() => {
            hook.setEditingSegmentId(1);
            hook.setEditingSegmentHasUnsavedChanges(true);
        });
        wrapper.update();

        let result;
        act(() => {
            result = hook.handleEditEnd();
        });
        wrapper.update();

        expect(result).toBe(false);
        expect(hook.showUnsavedWarning).toBe(true);
    });

    it('continueAfterUnsavedWarning executes pending action and clears warning', () => {
        render();
        const onContinue = jest.fn();

        act(() => {
            hook.setEditingSegmentHasUnsavedChanges(true);
        });
        wrapper.update();

        let result;
        act(() => {
            result = hook.handleUnsavedChangesAttempt(onContinue);
        });
        wrapper.update();

        expect(result).toBe(false);
        expect(hook.showUnsavedWarning).toBe(true);

        act(() => {
            hook.continueAfterUnsavedWarning();
        });
        wrapper.update();

        expect(onContinue).toHaveBeenCalledTimes(1);
        expect(hook.showUnsavedWarning).toBe(false);
        expect(hook.editingSegmentHasUnsavedChanges).toBe(false);
    });
});
