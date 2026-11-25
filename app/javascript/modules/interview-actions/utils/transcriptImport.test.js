import { getFileExtension, prepareTranscriptParams } from './transcriptImport';

describe('getFileExtension', () => {
    test.each([
        ['transcript.csv', 'csv'],
        ['interview.part.XLSX', 'xlsx'],
        ['subtitles.SRT', 'srt'],
        ['', ''],
        ['csv', ''],
        ['transcript.', ''],
    ])('reads the extension of %j as %j', (filename, expected) => {
        expect(getFileExtension(filename)).toBe(expected);
    });
});

describe('prepareTranscriptParams', () => {
    test.each(['csv', 'ods', 'xlsx', 'xlsm', 'xls', 'xlm', 'CSV'])(
        'includes the selected frame rate for a %s spreadsheet in frame mode',
        (extension) => {
            const data = new File([], `transcript.${extension}`);
            expect(
                prepareTranscriptParams({
                    data,
                    use_frame_timecodes: true,
                    timecode_frame_rate: '25',
                })
            ).toEqual({ transcript: { data, timecode_frame_rate: '25' } });
        }
    );

    test.each([false, undefined])(
        'omits the frame rate when frame mode is %s',
        (useFrames) => {
            const data = new File([], 'transcript.csv');
            expect(
                prepareTranscriptParams({
                    data,
                    use_frame_timecodes: useFrames,
                    timecode_frame_rate: '25',
                })
            ).toEqual({ transcript: { data } });
        }
    );

    test.each([
        'transcript.vtt',
        'transcript.SRT',
        'transcript.odt',
        'transcript.txt',
        'transcript.csv.bak',
        'csv',
    ])('does not send spreadsheet frame settings for %s', (filename) => {
        const data = new File([], filename);
        expect(
            prepareTranscriptParams({
                data,
                use_frame_timecodes: true,
                timecode_frame_rate: '25',
            })
        ).toEqual({ transcript: { data } });
    });

    test('handles an unselected file without adding frame settings', () => {
        expect(
            prepareTranscriptParams({
                archive_id: 'adg001',
                use_frame_timecodes: true,
                timecode_frame_rate: '25',
            })
        ).toEqual({ transcript: { archive_id: 'adg001' } });
    });

    test('preserves import settings and original values while removing the frontend flag', () => {
        const data = new File([], 'transcript.csv');
        const contributions = Object.freeze([
            { id: 7, speaker_designation: 'IP' },
        ]);
        const attributes = {
            data,
            archive_id: 'adg001',
            transcript_language_id: '1',
            tape_number: '2',
            delete_existing: false,
            update_only_speakers: true,
            contributions_attributes: contributions,
        };
        const values = Object.freeze({
            ...attributes,
            use_frame_timecodes: true,
            timecode_frame_rate: '30',
        });

        const { transcript } = prepareTranscriptParams(values);

        expect(transcript).toEqual({
            ...attributes,
            timecode_frame_rate: '30',
        });
        expect(transcript).not.toBe(values);
        expect(transcript.data).toBe(data);
        expect(transcript.contributions_attributes).toBe(contributions);
        expect(values).toEqual({
            ...attributes,
            use_frame_timecodes: true,
            timecode_frame_rate: '30',
        });
    });
});
