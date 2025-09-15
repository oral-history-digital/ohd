import {
    getContributionTypesForCurrentProject,
    getCurrentInterview,
    getCurrentProject,
    getData,
    getInterviews,
    getProjects,
} from './baseSelectors';

const state = {
    archive: {
        archiveId: 'cd003',
        projectId: 'cdoh',
    },
    data: {
        users: {
            current: {
                id: 45,
                admin: true,
            },
        },
        statuses: {
            users: {
                current: 'fetched',
                resultPagesCount: 1,
            },
            collections: {
                for_projects_1: 'fetched',
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
                for_projects_1: 'fetched',
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
                for_interviews_cd003: 'fetched-Mon',
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
                for_projects_1: 'fetched',
            },
        },
        projects: {
            1: {
                id: 1,
                type: 'Project',
                identifier: 'cdoh',
                available_locales: ['de', 'en', 'ru'],
                has_map: true,
                root_registry_entry_id: 1,
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
                task_types: {
                    3: {
                        id: 3,
                        type: 'TaskType',
                        key: 'protocol',
                        abbreviation: 'Pro',
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
                media_streams: {
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
                ref_tree: {
                    id: 1,
                    type: 'node',
                    children: [
                        {
                            id: 11786,
                            type: 'node',
                            children: [
                                {
                                    type: 'leafe',
                                    time: 25.2,
                                    tape_nbr: 1,
                                },
                                {
                                    id: 11310,
                                    type: 'node',
                                    children: [
                                        {
                                            type: 'leafe',
                                            time: 1472.18,
                                            tape_nbr: 1,
                                        },
                                        {
                                            type: 'leafe',
                                            time: 2103.32,
                                            tape_nbr: 1,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                segments: {
                    1: {
                        199498: {
                            id: 199498,
                            type: 'Segment',
                            text: {
                                de: 'dummy',
                                'de-public': 'dummy',
                                ru: 'dummy',
                                'ru-public': 'dummy',
                            },
                        },
                    },
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
        random_featured_interviews: {
            cd009: {
                id: 23,
                type: 'Interview',
            },
        },
    },
};

test('getData gets data object', () => {
    expect(getData(state)).toEqual(state.data);
});

test('getProjects gets projects object', () => {
    expect(getProjects(state)).toEqual(state.data.projects);
});

describe('getCurrentProject', () => {
    test("gets currently selected project's object", () => {
        expect(getCurrentProject(state)).toEqual(state.data.projects[1]);
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

        expect(getCurrentProject(state)).toBeNull();
    });
});

test('getInterviews retrieves all interviews', () => {
    expect(getInterviews(state)).toEqual(state.data.interviews);
});

test('getCurrentInterview retrieves current interview', () => {
    expect(getCurrentInterview(state)).toEqual(state.data.interviews.cd003);
});

test('getContributionTypesForCurrentProject retrieves contributionTypes object', () => {
    expect(getContributionTypesForCurrentProject(state)).toEqual(
        state.data.projects[1].contribution_types
    );
});
