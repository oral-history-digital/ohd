import { renderToStaticMarkup } from 'react-dom/server';

import ArchiveManagementInCell from './ArchiveManagementInCell';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({ t: (key) => key }),
}));

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => {
    const actual = jest.requireActual('react-redux');
    return {
        ...actual,
        useSelector: (selector) => mockUseSelector(selector),
    };
});

describe('<ArchiveManagementInCell />', () => {
    let warnSpy;

    beforeEach(() => {
        mockUseSelector.mockReset();
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('shows fallback text for missing project roles and logs a warning', () => {
        mockUseSelector.mockReturnValue({
            1: { id: 1, shortname: 'ohd' },
        });

        const row = {
            original: {
                user_roles: {
                    1: {
                        id: 1,
                        name: 'Archivmanagement',
                        project_id: 1,
                    },
                    2: {
                        id: 2,
                        name: 'Archivmanagement',
                        project_id: 999,
                    },
                },
            },
        };

        const html = renderToStaticMarkup(
            <ArchiveManagementInCell row={row} />
        );

        expect(html).toContain('ohd');
        expect(html).toContain('Unknown project (ID: 999)');
        expect(warnSpy).toHaveBeenCalledWith(
            '[ArchiveManagementInCell] Missing project for user role',
            expect.objectContaining({
                roleId: 2,
                projectId: 999,
            })
        );
    });

    it('does not throw when no matching projects are available', () => {
        mockUseSelector.mockReturnValue({});

        const row = {
            original: {
                user_roles: {
                    3: {
                        id: 3,
                        name: 'Archivmanagement',
                        project_id: 321,
                    },
                },
            },
        };

        expect(() =>
            renderToStaticMarkup(<ArchiveManagementInCell row={row} />)
        ).not.toThrow();

        expect(warnSpy).toHaveBeenCalledTimes(1);
    });
});
