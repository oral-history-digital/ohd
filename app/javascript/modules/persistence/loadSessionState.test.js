import loadSessionState from './loadSessionState';

describe('loadSessionState()', () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it('should return state slice if it exists', () => {
    sessionStorage.setItem('dummy', JSON.stringify('abc'));

    expect(loadSessionState('dummy')).toEqual('abc');
  });

  it('should return undefined if state slice does not exist', () => {
    expect(loadSessionState('dummy')).toBeUndefined();
  });
});
