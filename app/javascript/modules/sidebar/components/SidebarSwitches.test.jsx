import { fireEvent, render, screen } from '@testing-library/react';
import {
    changeToEditView,
    changeToTranslationsView,
    getEditView,
    getTranslationsView,
} from 'modules/archive';
import { getCurrentUser } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';

import ToggleEditView from './ToggleEditView';
import ToggleTranslationsView from './ToggleTranslationsView';

jest.mock('modules/archive', () => ({
    changeToEditView: jest.fn((checked) => ({ type: 'edit', checked })),
    changeToTranslationsView: jest.fn((checked) => ({
        type: 'translations',
        checked,
    })),
    getEditView: jest.fn(),
    getTranslationsView: jest.fn(),
}));
jest.mock('modules/data', () => ({ getCurrentUser: jest.fn() }));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/ui', () => ({
    Switch: jest.requireActual('../../ui/Switch').default,
}));
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

const dispatch = jest.fn();

beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatch);
    useSelector.mockImplementation((selector) => selector());
    getCurrentUser.mockReturnValue({ admin: true });
    getEditView.mockReturnValue(false);
    getTranslationsView.mockReturnValue(false);
});

test.each([
    [ToggleEditView, getEditView, changeToEditView, 'Switch edit view'],
    [
        ToggleTranslationsView,
        getTranslationsView,
        changeToTranslationsView,
        'Switch translations view',
    ],
])(
    'preserves sidebar switch behavior and appearance for %s',
    (Component, selector, action, name) => {
        const { rerender } = render(<Component />);
        const control = screen.getByRole('switch', { name });
        expect(control).toHaveClass('Switch--md', 'u-color-text');
        expect(control).not.toBeChecked();
        fireEvent.click(control);
        expect(action).toHaveBeenCalledWith(true);
        expect(dispatch).toHaveBeenCalledWith({
            type: expect.any(String),
            checked: true,
        });
        selector.mockReturnValue(true);
        rerender(<Component />);
        expect(control).toBeChecked();
        expect(control).toHaveClass('u-color-editorial');
        expect(control.querySelector('svg').style.color).toBe(
            'var(--editorial-color)'
        );
        fireEvent.click(control);
        expect(action).toHaveBeenLastCalledWith(false);
    }
);

test.each([null, {}, { admin: false }])(
    'hides translation switch for a non-admin user: %s',
    (user) => {
        getCurrentUser.mockReturnValue(user);
        render(<ToggleTranslationsView />);
        expect(screen.queryByRole('switch')).not.toBeInTheDocument();
    }
);
