import { normalizeCurrentFiles, normalizeSelectedFiles } from './normalization';

test('normalizes selected files based on the `multiple` prop', () => {
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });

    expect(normalizeSelectedFiles(file, false)).toEqual([file]);
    expect(normalizeSelectedFiles([file], true)).toEqual([file]);
    expect(normalizeSelectedFiles(null, false)).toEqual([]);
    expect(normalizeSelectedFiles(null, true)).toEqual([]);
});

test('normalizes current files to an array', () => {
    const file = new File(['content'], 'file.txt', { type: 'text/plain' });

    expect(normalizeCurrentFiles(file)).toEqual([file]);
    expect(normalizeCurrentFiles([file])).toEqual([file]);
    expect(normalizeCurrentFiles(null)).toEqual([]);
});
