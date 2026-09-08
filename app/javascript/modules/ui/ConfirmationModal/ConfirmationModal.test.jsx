import { fireEvent, render, screen } from '@testing-library/react';

import ConfirmationModal from './ConfirmationModal';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

test('renders confirmation content and handles both actions', () => {
    const onCancel = jest.fn();
    const onConfirm = jest.fn();

    render(
        <ConfirmationModal
            isOpen
            title="Confirm change"
            message="This affects the website."
            confirmText="Change"
            onCancel={onCancel}
            onConfirm={onConfirm}
        />
    );

    expect(screen.getByRole('dialog')).toHaveTextContent(
        'This affects the website.'
    );
    fireEvent.click(screen.getByRole('button', { name: 'Change' }));
    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
});

test('renders nothing while closed', () => {
    render(
        <ConfirmationModal
            isOpen={false}
            title="Confirm change"
            message="Warning"
            onCancel={jest.fn()}
            onConfirm={jest.fn()}
        />
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
