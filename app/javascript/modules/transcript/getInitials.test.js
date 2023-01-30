import getInitials from "./getInitials";

describe('getInitials', () => {
    it('calculates initials for normal names', () => {
        const actual = getInitials('Alice', 'Henderson', 'de');
        const expected = 'AH';
        expect(actual).toEqual(expected);
    });

    it('calculates initials for two last names', () => {
        const actual = getInitials('Alice', 'claire Henderson', 'de');
        const expected = 'AC';
        expect(actual).toEqual(expected);
    });
});
