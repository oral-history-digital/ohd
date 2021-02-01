import { NAME } from './constants';
import * as selectors from './selectors';

const state = {
    [NAME]: {
        show: false,
        title: 'bla',
        big: false,
        content: 'bla bla',
        className: 'popup',
        closeOnOverlayClick: true,
        buttons: {
            left: ['cancel'],
            right: ['ok'],
        },
    },
};

test('getPopup retrieves popup object', () => {
    expect(selectors.getPopup(state)).toEqual(state[NAME]);
});

test('getPopupShow retrieves popup visibility status', () => {
    expect(selectors.getPopupShow(state)).toEqual(state[NAME].show);
});
