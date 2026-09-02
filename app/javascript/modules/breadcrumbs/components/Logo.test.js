import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { Logo } from './Logo';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ locale: 'de' }),
}));

describe('<Logo />', () => {
    const ohdDomain = 'https://portal.oral-history.digital';
    const renderLogo = (props = {}) =>
        render(
            <MemoryRouter>
                <Logo {...props} />
            </MemoryRouter>
        );

    it('uses anchor with absolute OHD URL when on a different domain', () => {
        renderLogo({ currentOrigin: 'http://localhost:3000', ohdDomain });

        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            `${ohdDomain}/de`
        );
    });

    it('uses Link without reload when already on OHD domain', () => {
        renderLogo({ currentOrigin: ohdDomain, ohdDomain });

        expect(screen.getByRole('link')).toHaveAttribute('href', '/de');
    });

    it('renders configured title and alt text', () => {
        renderLogo({ title: 'Custom OHD', logoSrc: '/x.svg' });

        expect(screen.getByRole('link')).toHaveAttribute('title', 'Custom OHD');
        expect(screen.getByRole('img')).toHaveAttribute('src', '/x.svg');
        expect(screen.getByRole('img')).toHaveAccessibleName('Custom OHD logo');
    });
});
