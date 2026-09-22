import { findProjectByDomain, normalizeDomain } from './domainUtils';

describe('normalizeDomain', () => {
    test('removes trailing slashes and surrounding whitespace', () => {
        expect(
            normalizeDomain(' http://portal.example.localhost:3000/// ')
        ).toBe('http://portal.example.localhost:3000');
    });

    test('returns empty string for nullish input', () => {
        expect(normalizeDomain(null)).toBe('');
        expect(normalizeDomain(undefined)).toBe('');
    });
});

describe('findProjectByDomain', () => {
    const projects = {
        1: {
            id: 1,
            shortname: 'ohd',
            is_umbrella: true,
            archive_domain: 'http://portal.oral-history.localhost:3000/',
        },
        2: {
            id: 2,
            shortname: 'test',
            archive_domain: 'http://portal.test.localhost:3000',
        },
    };

    test('finds project even when stored domain has trailing slash', () => {
        const project = findProjectByDomain(
            projects,
            'http://portal.oral-history.localhost:3000'
        );

        expect(project?.shortname).toBe('ohd');
    });

    test('returns undefined when no project matches domain', () => {
        const project = findProjectByDomain(
            projects,
            'http://portal.unknown.localhost:3000'
        );

        expect(project).toBeUndefined();
    });

    test('falls back to umbrella project on the portal domain', () => {
        const projectsWithoutUmbrellaArchiveDomain = {
            1: {
                id: 1,
                shortname: 'portal',
                is_umbrella: true,
                archive_domain: null,
            },
            2: {
                id: 2,
                shortname: 'test',
                archive_domain: 'http://portal.test.localhost:3000',
            },
        };

        const project = findProjectByDomain(
            projectsWithoutUmbrellaArchiveDomain,
            'http://portal.oral-history.localhost:3000',
            'http://portal.oral-history.localhost:3000'
        );

        expect(project?.shortname).toBe('portal');
    });
});
