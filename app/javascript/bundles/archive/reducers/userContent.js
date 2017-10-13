import { 
    POST_USER_CONTENT,
    RECEIVE_USER_CONTENT,
} from '../constants/archiveConstants';

const userContent = (state = {}, action) => {
    switch (action.type) {
        case POST_USER_CONTENT:
            return Object.assign({}, state, {
                isPostingUserContent: true,
            })
        case RECEIVE_USER_CONTENT:
            return Object.assign({}, state, {
                isPostingUserContent: false,
                [action.userContent.id]: action.userContent
            })

        default:
            return state;
    }
};

export default userContent;
