import { getProjectIdentities } from './projectDetails';
import { projectAccessContext } from './projectRequests';

test('prefers current Redux identity fields and retains bootstrap routing without exposing project content', () => {
    const state = {
        data: {
            projects: {
                identities: {
                    1: {
                        id: 1,
                        shortname: 'portal',
                        is_umbrella: true,
                        name: { en: 'Bootstrap portal' },
                    },
                    7: {
                        id: 7,
                        shortname: 'old',
                        archive_domain: 'https://old.example.org',
                        access_config: { id: 2 },
                    },
                },
                records: {
                    7: {
                        id: 7,
                        shortname: 'new',
                        archive_domain: 'https://new.example.org',
                        is_umbrella: false,
                        edit: { contact_email: 'private@example.org' },
                    },
                    8: {
                        id: 8,
                        shortname: 'other',
                        archive_domain: null,
                        is_umbrella: false,
                    },
                },
            },
        },
    };
    state.data.projects.context = projectAccessContext(state);
    expect(getProjectIdentities(state)).toEqual({
        1: {
            id: 1,
            shortname: 'portal',
            archive_domain: undefined,
            is_umbrella: true,
        },
        7: {
            id: 7,
            shortname: 'new',
            archive_domain: 'https://new.example.org',
            is_umbrella: false,
        },
        8: {
            id: 8,
            shortname: 'other',
            archive_domain: null,
            is_umbrella: false,
        },
    });
    const changedAccess = { ...state, user: { isLoggedIn: true } };
    const identities = getProjectIdentities(changedAccess);
    expect(identities[7].shortname).toBe('old');
    expect(identities[8]).toBeUndefined();
    expect(identities[1].shortname).toBe('portal');
});
