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

test('includes milliseconds when requested', () => {
    const actual = formatTimecode(25.3, false, true);
    const expected = '0:00:25.300';
    expect(actual).toEqual(expected);
});

test('includes milliseconds for minutes correctly', () => {
    const actual = formatTimecode(645.123, false, true);
    const expected = '0:10:45.123';
    expect(actual).toEqual(expected);
});

test('includes milliseconds for hours correctly', () => {
    const actual = formatTimecode(9905.9, false, true);
    const expected = '2:45:05.900';
    expect(actual).toEqual(expected);
});

test('does not include milliseconds when flag is false', () => {
    const actual = formatTimecode(25.999, false, false);
    const expected = '0:00:25';
    expect(actual).toEqual(expected);
});

test('milliseconds parameter is honored in HMS format', () => {
    const actual = formatTimecode(645.123, true, true);
    const expected = '0h10m45.123s';
    expect(actual).toEqual(expected);
});

test('handles zero milliseconds correctly', () => {
    const actual = formatTimecode(60, false, true);
    const expected = '0:01:00.000';
    expect(actual).toEqual(expected);
});
