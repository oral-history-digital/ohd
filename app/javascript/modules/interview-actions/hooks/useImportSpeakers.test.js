import { act, renderHook, waitFor } from '@testing-library/react';

import { useImportSpeakers } from './useImportSpeakers';

const response = (speakers = ['AM']) => ({
    status: 200,
    json: async () => ({ speakers }),
});

beforeEach(() => {
    window.fetch = jest.fn().mockResolvedValue(response());
    document.head.innerHTML = '<meta name="csrf-token" content="test-token">';
});

test('reads labels on file selection using only the scoped archive ID and file', async () => {
    const file = new File(['text'], 'transcript.csv');
    const { result, rerender } = renderHook(
        ({ file }) =>
            useImportSpeakers(
                '/adg/de',
                'transcripts',
                'transcript',
                'adg001',
                file
            ),
        { initialProps: { file: null } }
    );
    expect(fetch).not.toHaveBeenCalled();
    rerender({ file });
    await waitFor(() => expect(result.current.options).toEqual(['AM']));
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('/adg/de/transcripts/speakers');
    expect(options.headers['X-CSRF-Token']).toBe('test-token');
    expect(options.body.get('transcript[archive_id]')).toBe('adg001');
    expect(options.body.get('transcript[data]')).toBe(file);
    expect(options.body.has('transcript[tape_number]')).toBe(false);
});

test('discards obsolete labels when file, project, or interview changes and on unmount', async () => {
    const finish = [];
    fetch.mockImplementation(
        () => new Promise((resolve) => finish.push(resolve))
    );
    const file = new File(['text'], 'transcript.csv');
    const { result, rerender, unmount } = renderHook(
        ({ file, path, archiveId }) =>
            useImportSpeakers(
                path,
                'transcripts',
                'transcript',
                archiveId,
                file
            ),
        { initialProps: { file, path: '/adg/de', archiveId: 'adg001' } }
    );
    const firstSignal = fetch.mock.calls[0][1].signal;
    rerender({
        file: new File(['new'], 'new.csv'),
        path: '/other/de',
        archiveId: 'other001',
    });
    expect(firstSignal.aborted).toBe(true);
    await act(async () => finish[0](response(['OLD'])));
    expect(result.current.options).toBeNull();
    await act(async () => finish[1](response(['NEW'])));
    expect(result.current.options).toEqual(['NEW']);
    rerender({ file, path: '/other/de', archiveId: 'other002' });
    unmount();
    expect(fetch.mock.calls[2][1].signal.aborted).toBe(true);
    await act(async () => finish[2](response(['OBSOLETE'])));
});

test.each([403, 422, 500])(
    'falls back to manual input after an HTTP %p',
    async (status) => {
        fetch.mockResolvedValue({
            status,
            json: async () => ({ speakers: ['PRIVATE'] }),
        });
        const file = new File(['x'], 'table.csv');
        const { result } = renderHook(() =>
            useImportSpeakers(
                '/adg/de',
                'edit_tables',
                'edit_table',
                'adg001',
                file
            )
        );
        await waitFor(() => expect(result.current.error).toBe(true));
        expect(result.current.options).toBeNull();
    }
);
