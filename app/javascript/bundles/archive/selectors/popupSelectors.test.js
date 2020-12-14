import * as selectors from './popupSelectors';

const state = {
    popup: {
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
    expect(selectors.getPopup(state)).toEqual(state.popup);
});

test('getPopupShow retrieves popup visibility status', () => {
    expect(selectors.getPopupShow(state)).toEqual(state.popup.show);
});
