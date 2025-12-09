import loadState from './loadState';

describe('loadState()', () => {
    afterEach(() => {
        localStorage.clear();
    });

    it('should return state slice if it exists', () => {
        localStorage.setItem('dummy', JSON.stringify('abc'));

        expect(loadState('dummy')).toEqual('abc');
    });

    it('should return undefined if state slice does not exist', () => {
        expect(loadState('dummy')).toBeUndefined();
    });
});
