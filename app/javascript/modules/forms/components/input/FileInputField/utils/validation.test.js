import { acceptsFile, validateFiles } from './validation';

test('matches MIME types, wildcard MIME types, and extensions', () => {
    const png = new File(['image'], 'image.png', { type: 'image/png' });
    const icon = new File(['icon'], 'favicon.ico', { type: '' });

    expect(acceptsFile(png, 'image/png')).toBe(true);
    expect(acceptsFile(png, 'image/*')).toBe(true);
    expect(acceptsFile(icon, ['.ico'])).toBe(true);
});

test('validates file count, empty files, type, and size', () => {
    const valid = new File(['valid'], 'valid.pdf', {
        type: 'application/pdf',
    });
    const empty = new File([], 'empty.pdf', { type: 'application/pdf' });
    const image = new File(['image'], 'image.png', { type: 'image/png' });

    expect(validateFiles([valid, valid], { maxFiles: 1 }).code).toBe(
        'too_many_files'
    );
    expect(
        validateFiles([valid], { maxFiles: 1, currentFileCount: 1 }).code
    ).toBe('too_many_files');
    expect(validateFiles([empty], {}).code).toBe('empty_file');
    expect(validateFiles([image], { accept: 'application/pdf' }).code).toBe(
        'invalid_type'
    );
    expect(validateFiles([valid], { maxSize: 1 }).code).toBe('file_too_large');
});
