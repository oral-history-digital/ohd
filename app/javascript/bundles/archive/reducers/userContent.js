import { 
    POST_USER_CONTENT,
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
        case RECEIVE_USER_CONTENT:
            return Object.assign({}, state, {
                isFetchingUserContents: false,
                contents: Object.assign([], state.contents, action.userContent)
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
