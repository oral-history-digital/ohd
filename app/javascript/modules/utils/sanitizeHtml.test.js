import sanitizeHtml from './sanitizeHtml';

describe('sanitizeHtml', () => {
    describe('PLAIN_TEXT configuration', () => {
        it('strips all HTML tags', () => {
            const input = '<p>Hello <strong>world</strong></p>';
            const result = sanitizeHtml(input, 'PLAIN_TEXT');
            expect(result).toBe('Hello world');
        });

        it('blocks script tags', () => {
            const input = '<script>alert("XSS")</script>Safe text';
            const result = sanitizeHtml(input, 'PLAIN_TEXT');
            expect(result).toBe('Safe text');
        });

        it('blocks event handlers', () => {
            const input = '<img src=x onerror="alert(1)">Text';
            const result = sanitizeHtml(input, 'PLAIN_TEXT');
            expect(result).toBe('Text');
        });

        it('handles empty strings', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            expect(sanitizeHtml('', 'PLAIN_TEXT')).toBe('');
            expect(sanitizeHtml(null, 'PLAIN_TEXT')).toBe('');
            expect(sanitizeHtml(undefined, 'PLAIN_TEXT')).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining('sanitizeHtml called with empty input')
            );
        });

        it('handles number input', () => {
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            expect(sanitizeHtml(1, 'PLAIN_TEXT')).toBe('');
            expect(sanitizeHtml(1.5, 'PLAIN_TEXT')).toBe('');
            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    'sanitizeHtml expected a string but received'
                )
            );
        });
    });

    describe('BASIC configuration', () => {
        it('allows basic formatting tags', () => {
            const input =
                '<p>Hello <strong>world</strong> and <em>friends</em></p>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).toContain('<p>');
            expect(result).toContain('<strong>');
            expect(result).toContain('<em>');
        });

        it('allows links with href', () => {
            const input = '<a href="https://example.com">Link</a>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).toContain('href="https://example.com"');
        });

        it('blocks script tags', () => {
            const input = '<p>Safe</p><script>alert("XSS")</script>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('<script>');
            expect(result).toContain('<p>Safe</p>');
        });

        it('blocks disallowed tags like h1', () => {
            const input = '<h1>Title</h1><p>Content</p>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('<h1>');
            expect(result).toContain('Title');
            expect(result).toContain('<p>Content</p>');
        });

        it('strips dangerous attributes', () => {
            const input = '<p onclick="alert(1)">Click me</p>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('onclick');
            expect(result).toContain('Click me');
        });
    });

    describe('RICH_TEXT configuration', () => {
        it('allows headings', () => {
            const input = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>';
            const result = sanitizeHtml(input, 'RICH_TEXT');
            expect(result).toContain('<h1>');
            expect(result).toContain('<h2>');
            expect(result).toContain('<h3>');
        });

        it('allows lists', () => {
            const input = '<ul><li>Item 1</li><li>Item 2</li></ul>';
            const result = sanitizeHtml(input, 'RICH_TEXT');
            expect(result).toContain('<ul>');
            expect(result).toContain('<li>');
        });

        it('allows blockquotes', () => {
            const input = '<blockquote>Quote text</blockquote>';
            const result = sanitizeHtml(input, 'RICH_TEXT');
            expect(result).toContain('<blockquote>');
        });

        it('blocks script tags', () => {
            const input = '<h1>Title</h1><script>alert(1)</script>';
            const result = sanitizeHtml(input, 'RICH_TEXT');
            expect(result).not.toContain('<script>');
        });

        it('blocks iframe and other dangerous tags', () => {
            const input = '<p>Safe</p><iframe src="evil.com"></iframe>';
            const result = sanitizeHtml(input, 'RICH_TEXT');
            expect(result).not.toContain('<iframe>');
            expect(result).toContain('<p>Safe</p>');
        });
    });

    describe('SEARCH_RESULT configuration', () => {
        it('preserves mark tags for highlighting', () => {
            const input = 'Found <mark>keyword</mark> in text';
            const result = sanitizeHtml(input, 'SEARCH_RESULT');
            expect(result).toContain('<mark>keyword</mark>');
        });

        it('preserves em and strong tags', () => {
            const input = '<em>emphasized</em> and <strong>bold</strong>';
            const result = sanitizeHtml(input, 'SEARCH_RESULT');
            expect(result).toContain('<em>');
            expect(result).toContain('<strong>');
        });

        it('strips other tags like p', () => {
            const input = '<p><mark>keyword</mark></p>';
            const result = sanitizeHtml(input, 'SEARCH_RESULT');
            expect(result).not.toContain('<p>');
            expect(result).toContain('<mark>keyword</mark>');
        });

        it('blocks script tags', () => {
            const input = '<mark>safe</mark><script>alert(1)</script>';
            const result = sanitizeHtml(input, 'SEARCH_RESULT');
            expect(result).not.toContain('<script>');
        });
    });

    describe('Error handling', () => {
        it('defaults to BASIC config for invalid config key', () => {
            const consoleSpy = jest
                .spyOn(console, 'error')
                .mockImplementation();
            const input = '<p>Text</p>';
            const result = sanitizeHtml(input, 'INVALID_CONFIG');

            expect(consoleSpy).toHaveBeenCalledWith(
                expect.stringContaining(
                    'Invalid sanitization config key: INVALID_CONFIG'
                )
            );
            expect(result).toContain('<p>Text</p>');

            consoleSpy.mockRestore();
        });

        it('uses BASIC config as default when no config specified', () => {
            const input = '<p>Text with <strong>formatting</strong></p>';
            const result = sanitizeHtml(input);
            expect(result).toContain('<p>');
            expect(result).toContain('<strong>');
        });

        it('handles non-string input gracefully', () => {
            expect(sanitizeHtml(123, 'BASIC')).toBe('');
            expect(sanitizeHtml({}, 'BASIC')).toBe('');
            expect(sanitizeHtml([], 'BASIC')).toBe('');
        });
    });

    describe('XSS attack prevention', () => {
        it('blocks javascript: URLs', () => {
            const input = '<a href="javascript:alert(1)">Click</a>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('javascript:');
        });

        it('blocks data: URLs with scripts', () => {
            const input =
                '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('data:');
        });

        it('blocks onload and other event handlers', () => {
            const input = '<img src="x" onload="alert(1)" onerror="alert(2)">';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('onload');
            expect(result).not.toContain('onerror');
        });

        it('blocks style attributes with expressions', () => {
            const input =
                '<p style="background:url(javascript:alert(1))">Text</p>';
            const result = sanitizeHtml(input, 'BASIC');
            expect(result).not.toContain('javascript:');
        });
    });
});
