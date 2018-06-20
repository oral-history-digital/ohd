import {
    REQUEST_INTERVIEW,
    RECEIVE_INTERVIEW,

    REQUEST_INTERVIEW_DATA,
    RECEIVE_INTERVIEW_DATA,

    VIDEO_TIME_CHANGE,
    VIDEO_ENDED,
    SET_NEXT_TAPE,

    TRANSCRIPT_TIME_CHANGE,
    SET_TAPE_AND_TIME,
    TRANSCRIPT_SCROLL,

    SET_LOCALE,
    REQUEST_STATIC_CONTENT,
    RECEIVE_STATIC_CONTENT,

    CHANGE_TO_EDIT_VIEW
} from '../constants/archiveConstants';

const initialState = {
    locale: 'de',
    locales: ['de', 'el'],
    archiveId: null,
    interviews: {},
    tape: 1,
    videoTime: 0,
    videoStatus: 'pause',
    transcriptTime: 0,
    transcriptScrollEnabled: false,

    isFetchingInterview: false,
    isFetchingInterviewLocations: false,

    homeContent: "",
    externalLinks: {},

    editView: false,
}

const archive = (state = initialState, action) => {
    switch (action.type) {
        case REQUEST_INTERVIEW:
            return Object.assign({}, state, {
                isFetchingInterview: true,
                fetchedInterview: false,
            })
        case RECEIVE_INTERVIEW:
            return Object.assign({}, state, {
                isFetchingInterview: false,
                fetchedInterview: true,
                archiveId: action.archiveId,
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        interview: action.interview,
                    }),
                }),
                lastUpdated: action.receivedAt
            })
        case REQUEST_INTERVIEW_DATA:
            return Object.assign({}, state, {
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        [`${action.dataType}_status`]: 'fetching',
                    }),
                }),
            })
        case RECEIVE_INTERVIEW_DATA:
            return Object.assign({}, state, {
                interviews: Object.assign({}, state.interviews, {
                    [action.archiveId]: Object.assign({}, state.interviews[action.archiveId], {
                        [action.dataType]: action.data,
                        [`${action.dataType}_status`]: 'fetched',
                    }),
                }),
                lastUpdated: action.receivedAt
            })
        case VIDEO_TIME_CHANGE:
            return Object.assign({}, state, {
                transcriptTime: action.transcriptTime,
            })
        case VIDEO_ENDED:
            return Object.assign({}, state, {
                videoStatus: 'paused',
                videoTime: 0,
                transcriptTime: 0,
            })
        case SET_NEXT_TAPE:
            return Object.assign({}, state, {
                tape: state.tape + 1,
                videoTime: 0.1,
                videoStatus: 'play',
            })
        case TRANSCRIPT_TIME_CHANGE:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                videoStatus: 'play',
                transcriptTime: action.videoTime,
                tape: action.tape,
                transcriptScrollEnabled: false
            })
        case SET_TAPE_AND_TIME:
            return Object.assign({}, state, {
                videoTime: action.videoTime,
                tape: action.tape,
            })
        case TRANSCRIPT_SCROLL:
            return Object.assign({}, state, {
                transcriptScrollEnabled: action.transcriptScrollEnabled
            })
        case SET_LOCALE:
            return Object.assign({}, state, {
                locale: action.locale
            })
        case REQUEST_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: true
            })
        case RECEIVE_STATIC_CONTENT:
            return Object.assign({}, state, {
                isFetchingExternalLinks: false,
                externalLinks: action.externalLinks,
                homeContent: action.homeContent,
                translations: action.translations,
                country_keys: action.country_keys,
                collections: action.collections,
                languages: action.languages,
                locales: action.locales,
                project: action.project,
                projectDoi: action.projectDoi,
                projectName: action.projectName,
                archiveDomain: action.archiveDomain,
                projectDomain: action.projectDomain
            })
        case CHANGE_TO_EDIT_VIEW:
            return Object.assign({}, state, {
                editView: action.editView
            })

        default:
            return state;
    }
};

export default archive;
