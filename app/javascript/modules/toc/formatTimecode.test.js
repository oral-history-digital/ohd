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
