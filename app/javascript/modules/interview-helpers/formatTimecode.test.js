import formatTimecode from './formatTimecode';

test('displays seconds correctly', () => {
    const actual = formatTimecode(25.3);
    const expected = '0:00:25';
    expect(actual).toEqual(expected);
});

test('displays minutes correctly', () => {
    const actual = formatTimecode(645.2);
    const expected = '0:10:45';
    expect(actual).toEqual(expected);
});

test('displays hours correctly', () => {
    const actual = formatTimecode(9905.9);
    const expected = '2:45:05';
    expect(actual).toEqual(expected);
});

test('can use hms format,', () => {
    const actual = formatTimecode(9905.9, true);
    const expected = '2h45m05s';
    expect(actual).toEqual(expected);
});

test('does not crash when input is null', () => {
    const actual = formatTimecode(null, true);
    const expected = '0h00m00s';
    expect(actual).toEqual(expected);
});

test('does not crash when input is undefined', () => {
    const actual = formatTimecode(undefined, true);
    const expected = 'NaNhNaNmNaNs';
    expect(actual).toEqual(expected);
});

test('does not crash when input is empty string', () => {
    const actual = formatTimecode('', true);
    const expected = '0h00m00s';
    expect(actual).toEqual(expected);
});
