import { humanTimeToSeconds } from './humanTimeToSeconds';

test('converts human time string to seconds', () => {
    const actual = humanTimeToSeconds('02h35m12s');
    const expected = 9312;
    expect(actual).toEqual(expected);
});

test('also accepts single digit numbers', () => {
    const actual = humanTimeToSeconds('1h5m3s');
    const expected = 3903;
    expect(actual).toEqual(expected);
});

test('throws error if format is not acceptable', () => {
    expect(() => {
        humanTimeToSeconds('345x');
    }).toThrow(TypeError);
});

test('throws error if minutes is above 59', () => {
    expect(() => {
        humanTimeToSeconds('2h60m05s');
    }).toThrow(RangeError);
});

test('throws error if seconds is above 59', () => {
    expect(() => {
        humanTimeToSeconds('2h30m60s');
    }).toThrow(RangeError);
});
