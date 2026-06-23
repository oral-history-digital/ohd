import { renderToStaticMarkup } from 'react-dom/server';

import ArchiveManagementInCell from './ArchiveManagementInCell';

describe('<ArchiveManagementInCell />', () => {
    let warnSpy;

    beforeEach(() => {
        warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warnSpy.mockRestore();
    });

    it('uses user role project payload for shortname tooltip and missing project fallback', () => {
        const row = {
            original: {
                id: 17,
                user_roles: {
                    1: {
                        id: 1,
                        name: 'Archive Manager',
                        archive_management: true,
                        project_id: 1,
                        project_shortname: 'ohd',
                        project_name: 'Oral-History.Digital',
                    },
                    2: {
                        id: 2,
                        name: 'Archive Manager',
                        archive_management: true,
                        project_id: 999,
                    },
                },
            },
        };

        const html = renderToStaticMarkup(
            <ArchiveManagementInCell row={row} />
        );

        expect(html).toContain('ohd');
        expect(html).toContain('title="Oral-History.Digital (ID: 1)"');
        expect(html).toContain('>, Unknown project (ID: 999)<');
        expect(html).toContain('Unknown project (ID: 999)');
        expect(warnSpy).toHaveBeenCalledWith(
            '[ArchiveManagementInCell] Missing project for user role',
            expect.objectContaining({
                roleId: 2,
                projectId: 999,
            })
        );
    });

    it('does not throw when no matching role project payload is available', () => {
        const row = {
            original: {
                user_roles: {
                    3: {
                        id: 3,
                        name: 'Archive Manager',
                        archive_management: true,
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
