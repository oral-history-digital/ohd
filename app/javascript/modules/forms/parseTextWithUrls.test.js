import parseTextWithUrls from './parseTextWithUrls';

test('returns array with text and url parts respectively', () => {
    const text = 'Click on this url: http://www.example.com and read the text.';

    const actual = parseTextWithUrls(text);
    const expected = [
        'Click on this url: ',
        'http://www.example.com',
        ' and read the text.',
    ];
    expect(actual).toEqual(expected);
});

test('does not find urls without protocol', () => {
    const text = 'Click on this url: www.example.com and read the text.';

    const actual = parseTextWithUrls(text);
    const expected = ['Click on this url: www.example.com and read the text.'];
    expect(actual).toEqual(expected);
});

test('returns text if no url is found', () => {
    const text = 'Click on this url and read the text.';

    const actual = parseTextWithUrls(text);
    const expected = ['Click on this url and read the text.'];
    expect(actual).toEqual(expected);
});

test('does not crash when text is null', () => {
    const actual = parseTextWithUrls(null);
    const expected = [];
    expect(actual).toEqual(expected);
});

test('works with multiple urls', () => {
    const text =
        'https://www.fu-berlin.de/dummy Click on this url: http://www.example.com and read the text. http://www.google.com';

    const actual = parseTextWithUrls(text);
    const expected = [
        'https://www.fu-berlin.de/dummy',
        ' Click on this url: ',
        'http://www.example.com',
        ' and read the text. ',
        'http://www.google.com',
    ];
    expect(actual).toEqual(expected);
});
