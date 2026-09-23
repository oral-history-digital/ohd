import { render, screen } from '@testing-library/react';

import NewTabLink from './NewTabLink';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: () => 'opens in a new tab',
    }),
}));

test('opens in a new tab and announces that behavior', () => {
    render(<NewTabLink href="https://example.org">Example</NewTabLink>);

    const link = screen.getByRole('link', {
        name: 'Example (opens in a new tab)',
    });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
});
