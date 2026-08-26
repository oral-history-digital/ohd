import { render, screen } from '@testing-library/react';
import { OHD_DOMAINS } from 'modules/constants';
import { MemoryRouter } from 'react-router-dom';

import { Logo } from './Logo';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de' }),
}));

describe('<Logo />', () => {
    const renderLogo = (props = {}) =>
        render(
            <MemoryRouter>
                <Logo {...props} />
            </MemoryRouter>
        );

    it('uses anchor with absolute OHD URL when on a different domain', () => {
        Object.defineProperty(window, 'location', {
            value: {
                origin: 'http://localhost:3000',
            },
            writable: true,
        });

        renderLogo();

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            `${OHD_DOMAINS.test}/de`
        );
    });

    it('uses Link without reload when already on OHD domain', () => {
        Object.defineProperty(window, 'location', {
            value: {
                origin: OHD_DOMAINS.test,
            },
            writable: true,
        });

        renderLogo();

        expect(screen.getByRole('link')).toHaveAttribute('href', '/de');
    });

    it('renders configured title and alt text', () => {
        renderLogo({ title: 'Custom OHD', logoSrc: '/x.svg' });

        expect(screen.getByRole('link')).toHaveAttribute('title', 'Custom OHD');
        expect(screen.getByRole('img')).toHaveAttribute('src', '/x.svg');
        expect(screen.getByRole('img')).toHaveAccessibleName('Custom OHD logo');
    });
});
