import { formatFileSize } from '../utils';

test('formatFileSize returns null for non-number input', () => {
    expect(formatFileSize('not a number')).toBeNull();
    expect(formatFileSize(null)).toBeNull();
    expect(formatFileSize(undefined)).toBeNull();
});

test('formatFileSize returns correct format for sizes less than 1 KB', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
});

test('formatFileSize returns correct format for sizes between 1 KB and 1 MB', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(2048)).toBe('2 KB');
    expect(formatFileSize(1048575)).toBe('1024 KB'); // 1 MB - 1 byte
});

test('formatFileSize returns correct format for sizes greater than or equal to 1 MB', () => {
    expect(formatFileSize(1048576)).toBe('1.0 MB'); // 1 MB
    expect(formatFileSize(2097152)).toBe('2.0 MB'); // 2 MB
    expect(formatFileSize(3145728)).toBe('3.0 MB'); // 3 MB
});
