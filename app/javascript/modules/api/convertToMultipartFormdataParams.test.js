import convertToMultipartFormdataParams from './convertToMultipartFormdataParams';

test('checks for argument type', () => {
    expect(() => {
        convertToMultipartFormdataParams(2)
    }).toThrow(TypeError);
});

test('formats simple params correctly', () => {
    const params = {
        "id": 1,
    };
    const actual = convertToMultipartFormdataParams(params);
    const expected = [
        ["id", 1],
    ];
    expect(actual).toEqual(expected);
});
