import { render, screen } from '@testing-library/react';
import { useUmbrellaProject } from 'modules/data';
import { useProject } from 'modules/routes';
import { MemoryRouter } from 'react-router-dom';

import CatalogLink from './CatalogLink';

jest.mock('modules/constants', () => ({
    OHD_DOMAINS: { test: 'https://portal.example' },
}));
jest.mock('modules/data', () => ({
    useUmbrellaProject: jest.fn(),
}));
jest.mock('modules/ui', () => ({
    InlineNotification: jest.fn(() => <p role="alert">Request failed</p>),
}));
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
    useProject: jest.fn(),
}));

beforeAll(() => {
    globalThis.railsMode = 'test';
});

beforeEach(() => {
    useProject.mockReturnValue({ project: { is_umbrella: true } });
    useUmbrellaProject.mockReturnValue({
        project: { shortname: 'portal', display_shortname: 'oh.d' },
    });
});

test.each([
    ['oh.d', 'oh.d'],
    [null, 'portal'],
])(
    'uses display shortname %s in a comma-free catalog title',
    (displayShortname, expectedName) => {
        useUmbrellaProject.mockReturnValue({
            project: {
                display_shortname: displayShortname,
                shortname: 'portal',
                name: { de: 'Oral-History.Digital' },
            },
        });

        render(
            <MemoryRouter>
                <CatalogLink type="collection" id={90409031} />
            </MemoryRouter>
        );

        expect(screen.getByRole('link')).toHaveAttribute(
            'title',
            `Sammlung im ${expectedName}-Katalog`
        );
        expect(useProject).toHaveBeenCalledWith();
        expect(useUmbrellaProject).toHaveBeenCalledWith();
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            '/de/catalog/collections/90409031'
        );
    }
);

test('opens catalog links on the portal when the current project has its own domain', () => {
    useProject.mockReturnValue({
        project: {
            archive_domain: 'https://project.example',
            is_umbrella: false,
        },
    });
    render(
        <MemoryRouter>
            <CatalogLink type="archive" id={7} />
        </MemoryRouter>
    );
    expect(screen.getByRole('link')).toHaveAttribute(
        'href',
        'https://portal.example/de/catalog/archives/7'
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
});

test.each([useProject, useUmbrellaProject])(
    'hides catalog links while %p loads or fails',
    (hook) => {
        hook.mockReturnValue({ isLoading: true });
        const { rerender } = render(
            <MemoryRouter>
                <CatalogLink type="collection" id={7} />
            </MemoryRouter>
        );
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        hook.mockReturnValue({ error: { message: 'Request failed' } });
        rerender(
            <MemoryRouter>
                <CatalogLink type="collection" id={7} />
            </MemoryRouter>
        );
        expect(screen.getByRole('alert')).toBeInTheDocument();
        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    }
);
