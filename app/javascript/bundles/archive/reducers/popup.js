import { 
    OPEN_POPUP,
    CLOSE_POPUP,
} from '../constants/archiveConstants';

const initialState = {
    show: false,
    title: 'bla',
    big: false,
    content: 'bla bla',
    className: 'popup',
    closeOnOverlayClick: true,
    buttons: {
        left: ['cancel'],
        right: ['ok']
    }
}

const popup = (state = initialState, action) => {
    switch (action.type) {
        case OPEN_POPUP:
            return Object.assign({}, action, {show: true})
        case CLOSE_POPUP:
            return Object.assign({}, state, {show: false})

        default:
            return state;
    }
};

export default popup;
