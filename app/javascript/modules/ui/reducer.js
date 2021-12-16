import { CLOSE_POPUP } from './action-types';

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
        case CLOSE_POPUP:
            return Object.assign({}, state, {show: false})

        default:
            return state;
    }
};

export default popup;
