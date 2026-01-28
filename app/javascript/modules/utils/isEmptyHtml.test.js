import isEmptyHtml from './isEmptyHtml';

describe('isEmptyHtml', () => {
    it('returns true for null', () => {
        expect(isEmptyHtml(null)).toBe(true);
    });

    it('returns true for undefined', () => {
        expect(isEmptyHtml(undefined)).toBe(true);
    });

    it('returns true for empty string', () => {
        expect(isEmptyHtml('')).toBe(true);
    });

    it('returns true for whitespace only', () => {
        expect(isEmptyHtml('   ')).toBe(true);
    });

    it('returns true for HTML tags only', () => {
        expect(isEmptyHtml('<p></p>')).toBe(true);
        expect(isEmptyHtml('<div><br/></div>')).toBe(true);
        expect(isEmptyHtml('<span></span>')).toBe(true);
    });

    it('returns true for HTML tags with only whitespace', () => {
        expect(isEmptyHtml('<p>   </p>')).toBe(true);
        expect(isEmptyHtml('<div>  \n  </div>')).toBe(true);
    });

    it('returns false for HTML with text content', () => {
        expect(isEmptyHtml('<p>Hello</p>')).toBe(false);
        expect(isEmptyHtml('<p>Hello World</p>')).toBe(false);
    });

    it('returns false for plain text', () => {
        expect(isEmptyHtml('Hello')).toBe(false);
        expect(isEmptyHtml('Some text')).toBe(false);
    });

    it('returns false for HTML with mixed content', () => {
        expect(isEmptyHtml('<p>Hello <strong>World</strong></p>')).toBe(false);
        expect(isEmptyHtml('<div><p>Content</p></div>')).toBe(false);
    });

    it('returns false for text with minimal HTML', () => {
        expect(isEmptyHtml('<br/>Content')).toBe(false);
        expect(isEmptyHtml('Text<br/>')).toBe(false);
    });

    it('handles special characters and entities', () => {
        expect(isEmptyHtml('<p>&nbsp;</p>')).toBe(false);
        expect(isEmptyHtml('<p>&#160;</p>')).toBe(false);
    });

    it('handles nested HTML structures', () => {
        expect(isEmptyHtml('<div><ul><li></li></ul></div>')).toBe(true);
        expect(isEmptyHtml('<div><ul><li>Item</li></ul></div>')).toBe(false);
    });

    it('handles newlines and tabs', () => {
        expect(isEmptyHtml('<p>\n\t</p>')).toBe(true);
        expect(isEmptyHtml('<p>\n\tText</p>')).toBe(false);
    });
});
