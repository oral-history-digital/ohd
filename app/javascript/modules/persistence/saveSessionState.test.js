import saveSessionState from './saveSessionState';

describe('saveSessionState()', () => {
    afterEach(() => {
        sessionStorage.clear();
    });

    it('should save a state slice to local storage', () => {
        saveSessionState('dummy', 'abc');

        expect(JSON.parse(sessionStorage.getItem('dummy'))).toEqual('abc');
    });
});
