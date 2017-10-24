import { 
    POST_USER_CONTENT,
    PUT_USER_CONTENT,
    ADD_USER_CONTENT,
    UPDATE_USER_CONTENT,
    REMOVE_USER_CONTENT,
    RECEIVE_USER_CONTENT,
    REQUEST_USER_CONTENTS,
    RECEIVE_USER_CONTENTS,
} from '../constants/archiveConstants';

const initialState = {
    contents: [],
    fetched: false
}

const userContent = (state = initialState, action) => {
    switch (action.type) {
        case POST_USER_CONTENT:
            return Object.assign({}, state, {
                isPostingUserContent: true,
            })
        case PUT_USER_CONTENT:
            return Object.assign({}, state, {
                isPuttingUserContent: true,
            })
        case ADD_USER_CONTENT:
            return Object.assign({}, state, {
                isFetchingUserContents: false,
                contents: [
                    ...state.contents,
                    {
                        id: 'newItem',
                        title: action.params.title,
                        description: action.params.description,
                        reference_id: action.params.reference_id,
                        reference_type: action.params.reference_type,
                        type: action.params.type,
                        properties: action.params.properties,
                        media_id: action.params.media_id,
                    }
                ]
            })
        case UPDATE_USER_CONTENT:
            return Object.assign({}, state, {
                contents: state.contents.map((userContent, index) => {
                    if (userContent.id === action.params.id) {
                        return Object.assign({}, userContent, {
                            title: action.params.title,
                            description: action.params.description,
                            properties: action.params.properties,
                            workflow_state: action.params.publish === 'on' ? 'proposed' : action.params.workflow_state,
                        })
                    }
                    return userContent
                })
            })
        case REMOVE_USER_CONTENT:
            return Object.assign({}, state, {
                contents: state.contents.filter(item => action.id !== item.id)
            })
        case RECEIVE_USER_CONTENT:
            return Object.assign({}, state, {
                isFetchingUserContents: false,
                contents: [
                    ...state.contents, action.userContent
                ]
            })
        case REQUEST_USER_CONTENTS:
            return Object.assign({}, state, {
                isFetchingUserContents: true,
            })
        case RECEIVE_USER_CONTENTS:
            return Object.assign({}, state, {
                isFetchingUserContents: false,
                fetched: true,
                contents: Object.assign([], state.contents, action.userContents)
            })

        default:
            return state;
    }
};

export default userContent;
