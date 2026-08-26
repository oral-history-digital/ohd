import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from './Button';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
}));

describe('<Button />', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders an anchor when href is provided', () => {
        render(<Button buttonText="Open archive" href="https://example.org" />);

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            'https://example.org'
        );
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('sets secure rel for target=_blank by default', () => {
        render(
            <Button
                buttonText="Open archive"
                href="https://example.org"
                target="_blank"
            />
        );

        expect(screen.getByRole('link')).toHaveAttribute(
            'rel',
            'noopener noreferrer'
        );
    });

    it('prevents click behavior when link is disabled', async () => {
        const user = userEvent.setup();
        const onClick = jest.fn();
        render(
            <Button
                buttonText="Open archive"
                href="https://example.org"
                onClick={onClick}
                isDisabled
            />
        );

        const link = screen.getByText('Open archive');
        await user.click(link);

        expect(link).not.toHaveAttribute('href');
        expect(link).toHaveAttribute('aria-disabled', 'true');
        expect(onClick).not.toHaveBeenCalled();
    });
});
