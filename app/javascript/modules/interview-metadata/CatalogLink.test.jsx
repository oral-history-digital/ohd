import { render, screen } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import CatalogLink from './CatalogLink';

jest.mock('modules/constants', () => ({
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({ getUmbrellaProject: jest.fn() }));
jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        locale: 'de',
        t: (key, params) =>
            jest.requireActual('../i18n/t').default(
                {
                    locale: 'de',
                    translations: {
                        'modules.interview_metadata.collection_link_title': {
                            de: 'Sammlung im %{umbrella_project_name}-Katalog',
                        },
                    },
                },
                key,
                params
            ),
    }),
}));
jest.mock('modules/routes', () => ({
    useProject: () => ({ project: { is_umbrella: true } }),
}));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

beforeAll(() => {
    globalThis.railsMode = 'test';
});

test.each([
    ['oh.d', 'oh.d'],
    [null, 'portal'],
])(
    'uses display shortname %s in a comma-free catalog title',
    (displayShortname, expectedName) => {
        useSelector.mockReturnValue({
            display_shortname: displayShortname,
            shortname: 'portal',
            name: { de: 'Oral-History.Digital' },
        });

        render(
            <MemoryRouter>
                <CatalogLink
                    type="collection"
                    id={90409031}
                    collectionId={90409031}
                />
            </MemoryRouter>
        );

        expect(screen.getByRole('link')).toHaveAttribute(
            'title',
            `Sammlung im ${expectedName}-Katalog`
        );
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            '/de/catalog/collections/90409031'
        );
    }
);
