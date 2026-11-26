export const SPREADSHEET_EXTENSIONS = [
    'csv',
    'ods',
    'xlsx',
    'xlsm',
    'xls',
    'xlm',
];
export const SUBTITLE_EXTENSIONS = ['vtt', 'srt'];
export const ODT_EXTENSION = 'odt';

export const ACCEPTED_FORMATS = [
    ...SPREADSHEET_EXTENSIONS,
    ...SUBTITLE_EXTENSIONS,
    ODT_EXTENSION,
]
    .map((extension) => `.${extension}`)
    .join(',');
