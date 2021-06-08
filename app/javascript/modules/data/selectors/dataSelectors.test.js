import dotProp from 'dot-prop-immutable';
import * as selectors from './dataSelectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
    },
    data: {
        accounts: {
            current: {
                id: 45,
                admin: true,
            },
        },
        collections: {
            1: {
                id: 1,
                type: 'Collection',
            },
        },
        people: {
            4: {
                id: 4,
                type: 'Person',
            },
        },
        statuses: {
            accounts: {
                current: 'fetched',
            },
            collections: {
                all: 'fetched',
            },
            contributions: {
                14: 'fetched-Mon',
            },
            headings: {
                for_interviews_cd003: 'fetched-Mon',
            },
            interviews: {
                za283: 'fetched',
            },
            languages: {
                all: 'fetched',
            },
            mark_text: {
                for_interviews_za003: 'fetched-Mon',
            },
            people: {
                12: 'fetched',
                contributors_for_interview_22: 'fetched',
            },
            permissions: {
                page_1: 'fetched-Mon',
            },
            projects: {
                all: 'fetched',
            },
            random_featured_interviews: {
                all: 'fetched-Thu Dec 17 2020 18:20:22 GMT+0100 (Central European Standard Time)',
            },
            ref_tree: {
                for_interviews_za003: 'fetched-Mon',
            },
            registry_entries: {
                1: 'fetched-Thu Jan 07 2021 21:17:39 GMT+0100 (Central European Standard Time)',
            },
            roles: {
                page_1: 'fetched-Mon',
            },
            segments: {
                for_interviews_za003: 'fetched-Mon',
                for_interviews_cd003: 'fetched-Tue',
            },
            speaker_designations: {
                for_interviews_za003: 'first_step_explanation',
            },
            tasks: {
                35: 'processed',
            },
            task_types: {
                all: 'fetched',
            },
            user_contents: {
                all: 'fetched-Mon',
            },
            user_registrations: {
                resultPagesCount: 1,
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
                root_registry_entry_id: 1,
            },
        },
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                lang: 'ru',
                languages: ['ru', 'de'],
                contributions: {
                    1345: {
                        id: 1345,
                        type: 'Contribution',
                        contribution_type: 'interviewee',
                        person_id: 4,
                        interview_id: 22,
                    },
                },
                first_segments_ids: {
                    1: 199498,
                },
                segments: {
                    1: {
                        199498: {
                            id: 199498,
                            type: 'Segment',
                            text: {
                                'de': 'dummy',
                                'de-public': 'dummy',
                                'ru': 'dummy',
                                'ru-public': 'dummy',
                            },
                        },
                    }
                },
                headings: {
                    0: {
                        id: 19499,
                        type: 'Segment',
                    },
                },
            },
        },
        languages: {
            2: {
                id: 2,
                type: 'Language',
            },
        },
        registry_entries: {
            1: {
                id: 1,
            },
            23: {
                id: 23,
                type: 'RegistryEntry',
                name: {
                    de: 'Russland',
                    en: 'Russia',
                },
                children_count: 77,
            },
        },
        registry_name_types: {
            2: {
                id: 2,
                type: 'RegistryNameType',
                code: 'first_name',
                name: 'Vorname',
            },
        },
        roles: {
            1: {
                id: 1,
                type: 'Role',
            },
        },
        permissions: {
            92: {
                id: 92,
                type: 'Permission',
            },
        },
        segments: {
            99015: {
                type: 'Segment',
            },
        },
        tasks: {
            35: {
                id: 35,
                type: 'Task',
            },
        },
        task_types: {
            3: {
                id: 3,
                type: 'TaskType',
                key: 'protocol',
                abbreviation: 'Pro',
            },
        },
        user_contents: {
            3596: {
                id: 3596,
                type: 'InterviewReference',
                user_account_id: 45,
                media_id: 'za003',
            },
        },
        user_registrations: {},
        random_featured_interviews: {
            'cd009': {
                id: 23,
                type: 'Interview',
            },
        },
        contribution_types: {
            1: {
                id: 1,
                type: 'ContributionType',
                code: 'interviewee',
                project_id: 1,
                label: {
                    de: 'Interviewte*r',
                    en: 'Interviewee',
                },
            },
        },
        MediaStream: {
            1: {
                id: 1,
                type: 'MediaStream',
                project_id: 1,
                path: 'https://medien.cedis.fu-berlin.de/zwar/zwar/#{archive_id}/#{archive_id}_#{tape_count}_0#{tape_number}_sd480p.mp4',
                media_type: 'video',
                resolution: '480p',
            },
        },
    },
};

test('getData gets data object', () => {
    expect(selectors.getData(state)).toEqual(state.data);
});

test('getLanguages gets languages object', () => {
    expect(selectors.getLanguages(state)).toEqual(state.data.languages);
});

test('getCollections gets collections object', () => {
    expect(selectors.getCollections(state)).toEqual(state.data.collections);
});

test('getPeople gets people object', () => {
    expect(selectors.getPeople(state)).toEqual(state.data.people);
});

test('getStatuses gets statuses object', () => {
    expect(selectors.getStatuses(state)).toEqual(state.data.statuses);
});

test('getAccountsStatus gets accounts status object', () => {
    expect(selectors.getAccountsStatus(state)).toEqual(state.data.statuses.accounts);
});

test('getCollectionsStatus gets collections status object', () => {
    expect(selectors.getCollectionsStatus(state)).toEqual(state.data.statuses.collections);
});

test('getContributionsStatus gets contributions status object', () => {
    expect(selectors.getContributionsStatus(state)).toEqual(state.data.statuses.contributions);
});

test('getHeadingsStatus gets headings status object', () => {
    expect(selectors.getHeadingsStatus(state)).toEqual(state.data.statuses.headings);
});

test('getHeadingsFetched gets if headings of current interview are fetched', () => {
    expect(selectors.getHeadingsFetched(state)).toBeTruthy();
});

test('getHeadings gets headings object of current interview', () => {
    expect(selectors.getHeadings(state)).toEqual(state.data.interviews.cd003.headings);
})

test('getLanguagesStatus gets languages status object', () => {
    expect(selectors.getLanguagesStatus(state)).toEqual(state.data.statuses.languages);
});

test('getMarkTextStatus gets mark text status object', () => {
    expect(selectors.getMarkTextStatus(state)).toEqual(state.data.statuses.mark_text);
});

test('getPeopleStatus gets people status object', () => {
    expect(selectors.getPeopleStatus(state)).toEqual(state.data.statuses.people);
});

test('getPermissionsStatus gets permissions status object', () => {
    expect(selectors.getPermissionsStatus(state)).toEqual(state.data.statuses.permissions);
});

test('getProjectsStatus gets projects status object', () => {
    expect(selectors.getProjectsStatus(state)).toEqual(state.data.statuses.projects);
});

test('getInterviewsStatus gets interviews status object', () => {
    expect(selectors.getInterviewsStatus(state)).toEqual(state.data.statuses.interviews);
});

test('getRefTreeStatus gets ref tree status object', () => {
    expect(selectors.getRefTreeStatus(state)).toEqual(state.data.statuses.ref_tree);
});

test('getRegistryEntriesStatus gets registry entries status object', () => {
    expect(selectors.getRegistryEntriesStatus(state)).toEqual(state.data.statuses.registry_entries);
});

test('getRolesStatus gets roles status object', () => {
    expect(selectors.getRolesStatus(state)).toEqual(state.data.statuses.roles);
});

test('getSegmentsStatus gets segments status object', () => {
    expect(selectors.getSegmentsStatus(state)).toEqual(state.data.statuses.segments);
});

test('getSpeakerDesignationsStatus gets speaker designations status object', () => {
    expect(selectors.getSpeakerDesignationsStatus(state)).toEqual(state.data.statuses.speaker_designations);
});

test('getTasksStatus gets tasks status object', () => {
    expect(selectors.getTasksStatus(state)).toEqual(state.data.statuses.tasks);
});

test('getTaskTypesStatus gets task types status object', () => {
    expect(selectors.getTaskTypesStatus(state)).toEqual(state.data.statuses.task_types);
});

test('getUserContentsStatus gets user contents status object', () => {
    expect(selectors.getUserContentsStatus(state)).toEqual(state.data.statuses.user_contents);
});

test('getUserRegistrationsStatus gets user registrations status object', () => {
    expect(selectors.getUserRegistrationsStatus(state)).toEqual(state.data.statuses.user_registrations);
});

test('getProjects gets projects object', () => {
    expect(selectors.getProjects(state)).toEqual(state.data.projects);
});

test('getAccounts gets accounts object', () => {
    expect(selectors.getAccounts(state)).toEqual(state.data.accounts);
});

test('getCurrentAccount gets account object of current user', () => {
    expect(selectors.getCurrentAccount(state)).toEqual(state.data.accounts.current);
});

test('getPermissions gets permissions object', () => {
    expect(selectors.getPermissions(state)).toEqual(state.data.permissions);
});

test('getRoles gets roles object', () => {
    expect(selectors.getRoles(state)).toEqual(state.data.roles);
});

test('getRegistryEntries gets registry entries object', () => {
    expect(selectors.getRegistryEntries(state)).toEqual(state.data.registry_entries);
});

test('getRootRegistryEntry gets root registry entry', () => {
    expect(selectors.getRootRegistryEntry(state)).toEqual(state.data.registry_entries[1]);
});

test('getRootRegistryEntryFetched is true if entry is fetched', () => {
    expect(selectors.getRootRegistryEntryFetched(state)).toBeTruthy();
});

test('getRegistryNameTypes gets registry name types object', () => {
    expect(selectors.getRegistryNameTypes(state)).toEqual(state.data.registry_name_types);
});

test('getSegments gets segments object', () => {
    expect(selectors.getSegments(state)).toEqual(state.data.segments);
});

test('getTasks gets tasks object', () => {
    expect(selectors.getTasks(state)).toEqual(state.data.tasks);
});

test('getTaskTypes gets task types object', () => {
    expect(selectors.getTaskTypes(state)).toEqual(state.data.task_types);
});

test('getUserContents gets user contents object', () => {
    expect(selectors.getUserContents(state)).toEqual(state.data.user_contents);
});

test('getUserRegistrations gets user registrations object', () => {
    expect(selectors.getUserRegistrations(state)).toEqual(state.data.user_registrations);
});

test('getRandomFeaturedInterviews gets featured interviews object', () => {
    expect(selectors.getRandomFeaturedInterviews(state)).toEqual(state.data.random_featured_interviews);
});

describe('getFeaturedInterviewsArray', () => {
    test('gets featured interviews array', () => {
        const actual = selectors.getFeaturedInterviewsArray(state);
        const expected = [{ id: 23, type: 'Interview' }];
        expect(actual).toEqual(expected);
    });

    test('gets empty array if interviews are not available', () => {
        const _state = dotProp.set(state, 'data.random_featured_interviews', undefined);
        const actual = selectors.getFeaturedInterviewsArray(_state);
        const expected = [];
        expect(actual).toEqual(expected);
    });
});

test('getCurrentUserIsAdmin gets admin status of current account', () => {
    expect(selectors.getCurrentUserIsAdmin(state)).toEqual(state.data.accounts.current.admin);
});

describe('getCurrentProject', () => {
    test('gets currently selected project\'s object', () => {
        expect(selectors.getCurrentProject(state)).toEqual(state.data.projects[1]);
    });

    test('returns null if project cannot be found', () => {
        const state = {
            archive: {
                projectId: 'cdoh',
            },
            data: {
                projects: {},
            },
        };

        expect(selectors.getCurrentProject(state)).toBeNull();
    });
});

test('getInterviews retrieves all interviews', () => {
    expect(selectors.getInterviews(state)).toEqual(state.data.interviews);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(selectors.getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

test('getCurrentInterviewFetched retrieves if current interview has been fetched', () => {
    expect(selectors.getCurrentInterviewFetched(state)).toBe(true);
});

test('getCurrentInterviewee retrieves first interviewee of current interview', () => {
    expect(selectors.getCurrentInterviewee(state)).toEqual(state.data.people[4]);
});

test('getInterviewee retrieves first interviewee of a given interview', () => {
    const props = {
        interview: {
            id: 22,
            type: 'Interview',
            contributions: {
                1345: {
                    id: 1345,
                    type: 'Contribution',
                    contribution_type: 'interviewee',
                    person_id: 4,
                    interview_id: 22,
                },
            },
        },
    };
    expect(selectors.getInterviewee(state, props)).toEqual(state.data.people[4]);
});

describe('getTranscriptFetched', () => {
    test('returns true if transcript has been fetched', () => {
        expect(selectors.getTranscriptFetched(state)).toBeTruthy();
    });

    test('returns false if transcript has not been fetched', () => {
        const _state = dotProp.set(state, 'archive.archiveId', 'za085');
        expect(selectors.getTranscriptFetched(_state)).toBeFalsy();
    });
});

describe('getTranscriptLocale', () => {
    test('returns original locale if prop is set', () => {
        const props = { originalLocale: true };
        expect(selectors.getTranscriptLocale(state, props)).toBe('ru');
    });

    test('returns first translated locale if prop is set', () => {
        const props = { originalLocale: false };
        expect(selectors.getTranscriptLocale(state, props)).toBe('de');
    });
});

describe('getHasTranscript', () => {
    test('returns true if there is at least one segment with text in original locale', () => {
        const props = { originalLocale: true };
        expect(selectors.getHasTranscript(state, props)).toBeTruthy();
    });

    test('returns true if there is at least one segment with text in translation', () => {
        const props = { originalLocale: false };
        expect(selectors.getHasTranscript(state, props)).toBeTruthy();
    });
});

test('getContributorsFetched retrieves if contributors for current interview have been fetched', () => {
    expect(selectors.getContributorsFetched(state)).toBe(true);
});

test('getFeaturedInterviewsFetched retrieves if featured interviews have been fetched', () => {
    expect(selectors.getFeaturedInterviewsFetched(state)).toBe(true);
});

test('getContributionTypes retrieves contributionTypes object', () => {
    expect(selectors.getContributionTypes(state)).toEqual(state.data.contribution_types);
});

test('getMediaStreams retrieves media streams', () => {
    expect(selectors.getMediaStreams(state)).toEqual(state.data.mediaStreams);
});
