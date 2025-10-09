export const state = {
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

export const interviewee = {
    id: 0,
    contribution_type: 'interviewee',
    interview_id: 22,
};

export const sound1 = {
    id: 1,
    contribution_type: 'sound',
    interview_id: 22,
};

export const sound2 = {
    id: 2,
    contribution_type: 'sound',
    interview_id: 22,
};

export const interviewer = {
    id: 3,
    contribution_type: 'interviewer',
    interview_id: 22,
};

export const qualityManager = {
    id: 4,
    contribution_type: 'quality_manager_transcription',
    interview_id: 22,
};

export const contributionState = {
    archive: {
        archiveId: 'cd003',
        editView: false,
    },
    data: {
        interviews: {
            cd003: {
                id: 22,
                type: 'Interview',
                contributions: [
                    interviewee,
                    sound1,
                    qualityManager,
                    sound2,
                    interviewer,
                ],
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
                contribution_types: {
                    1: {
                        id: 1,
                        project_id: 1,
                        code: 'cinematographer',
                        order: 2,
                        use_in_details_view: true,
                    },
                    //2: {id: 2, project_id: 1, code: 'interviewee', order: false, use_in_details_view: false},
                    3: {
                        id: 3,
                        project_id: 1,
                        code: 'interviewer',
                        order: 1,
                        use_in_details_view: true,
                    },
                    4: {
                        id: 4,
                        project_id: 1,
                        code: 'other_attender',
                        order: 5,
                        use_in_details_view: true,
                    },
                    5: {
                        id: 5,
                        project_id: 1,
                        code: 'producer',
                        order: 4,
                        use_in_details_view: true,
                    },
                    6: {
                        id: 6,
                        project_id: 1,
                        code: 'research',
                        order: 10,
                        use_in_details_view: true,
                    },
                    7: {
                        id: 7,
                        project_id: 1,
                        code: 'segmentator',
                        order: 8,
                        use_in_details_view: true,
                    },
                    8: {
                        id: 8,
                        project_id: 1,
                        code: 'sound',
                        order: 3,
                        use_in_details_view: true,
                    },
                    9: {
                        id: 9,
                        project_id: 1,
                        code: 'transcriptor',
                        order: 6,
                        use_in_details_view: true,
                    },
                    10: {
                        id: 10,
                        project_id: 1,
                        code: 'translator',
                        order: 7,
                        use_in_details_view: true,
                    },
                    11: {
                        id: 11,
                        project_id: false,
                        code: 'proofreader',
                        order: 9,
                        use_in_details_view: true,
                    },
                    12: {
                        id: 12,
                        project_id: false,
                        code: 'quality_manager_interviewing',
                        order: 11,
                        use_in_details_view: false,
                    },
                    13: {
                        id: 13,
                        project_id: false,
                        code: 'quality_manager_transcription',
                        order: 12,
                        use_in_details_view: false,
                    },
                    14: {
                        id: 14,
                        project_id: false,
                        code: 'quality_manager_translation',
                        order: 13,
                        use_in_details_view: false,
                    },
                    15: {
                        id: 15,
                        project_id: false,
                        code: 'quality_manager_research',
                        order: 14,
                        use_in_details_view: false,
                    },
                },
            },
        },
    },
};

export const projectState = {
    archive: {
        archiveId: 'cd003',
        locale: 'de',
        projectId: 'cdoh',
    },
    data: {
        projects: {
            1: {
                id: 1,
                type: 'Project',
                shortname: 'cdoh',
                translations_attributes: [{ locale: 'de' }, { locale: 'es' }],
                available_locales: ['de', 'en', 'ru'],
                is_catalog: false,
                map_sections: {
                    1: {
                        id: 1,
                        type: 'MapSection',
                        name: 'europe',
                        order: 1,
                    },
                    2: {
                        id: 2,
                        type: 'MapSection',
                        name: 'usa',
                        order: 0,
                    },
                },
            },
        },
    },
};
// export const contributionState = {
//     archive: {
//         archiveId: 'cd003',
//         editView: false,
//     },
//     data: {
//         projects: {
//             1: {
//                 id: 1,
//                 type: 'Project',
//                 identifier: 'cdoh',
//                 available_locales: ['de', 'en', 'ru'],
//                 has_map: true,
//                 root_registry_entry_id: 1,
//                 contribution_types: {
//                     1: {
//                         id: 1,
//                         project_id: 1,
//                         code: 'cinematographer',
//                         order: 2,
//                         use_in_details_view: true,
//                     },
