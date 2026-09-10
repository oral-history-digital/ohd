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
    const cancelButton = screen.getByTestId('cancel-button');
    const confirmButton = screen.getByRole('button', { name: 'Change' });
    const buttonRow = cancelButton.parentElement;

    expect(buttonRow).toHaveClass('Form-footer-buttons');
    expect(Array.from(buttonRow.children)).toEqual([
        cancelButton,
        confirmButton,
    ]);

    fireEvent.click(confirmButton);
    fireEvent.click(cancelButton);

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
