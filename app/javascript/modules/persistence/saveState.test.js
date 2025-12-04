import saveState from './saveState';

describe('saveState()', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('should save a state slice to local storage', () => {
        saveState('dummy', 'abc');

        expect(JSON.parse(localStorage.getItem('dummy'))).toEqual('abc');
    });
});
