import { resolveCurrentProject } from './resolveCurrentProject';

describe('resolveCurrentProject', () => {
    it('resolves by route shortname from cache first', () => {
        const projectA = {
            id: 10,
            shortname: 'alpha',
            archive_domain: 'https://alpha.example.org',
        };
        const projectB = {
            id: 20,
            shortname: 'beta',
            archive_domain: 'https://beta.example.org',
        };

        const result = resolveCurrentProject({
            projects: {
                10: projectA,
                20: projectB,
            },
            routeProjectShortname: 'beta',
            domainOrigin: 'https://alpha.example.org',
        });

        expect(result).toEqual({
            project: projectB,
            projectShortname: 'beta',
            projectDbId: 20,
            source: 'route-cache',
        });
    });

    it('resolves by domain when route shortname is absent', () => {
        const project = {
            id: 11,
            shortname: 'domain-proj',
            archive_domain: 'https://domain.example.org',
        };

        const result = resolveCurrentProject({
            projects: { 11: project },
            routeProjectShortname: null,
            domainOrigin: 'https://domain.example.org',
        });

        expect(result).toEqual({
            project,
            projectShortname: 'domain-proj',
            projectDbId: 11,
            source: 'domain-cache',
        });
    });

    it('uses fallback project when cache is unresolved', () => {
        const fallbackProject = {
            id: '35',
            shortname: 'fallback-proj',
        };

        const result = resolveCurrentProject({
            projects: {},
            routeProjectShortname: 'route-shortname',
            domainOrigin: 'https://domain.example.org',
            fallbackProject,
        });

        expect(result).toEqual({
            project: fallbackProject,
            projectShortname: 'fallback-proj',
            projectDbId: 35,
            source: 'swr',
        });
    });

    it('returns unresolved with normalized route shortname when nothing matches', () => {
        const result = resolveCurrentProject({
            projects: {},
            routeProjectShortname: '  some-shortname  ',
            domainOrigin: 'https://domain.example.org',
            fallbackProject: null,
        });

        expect(result).toEqual({
            project: null,
            projectShortname: 'some-shortname',
            projectDbId: null,
            source: 'unresolved',
        });
    });

    it('returns unresolved with null shortname for invalid route shortname values', () => {
        const result = resolveCurrentProject({
            projects: {},
            routeProjectShortname: {},
            domainOrigin: null,
            fallbackProject: null,
        });

        expect(result).toEqual({
            project: null,
            projectShortname: null,
            projectDbId: null,
            source: 'unresolved',
        });
    });
});
