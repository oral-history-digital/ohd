import { act, renderHook } from '@testing-library/react';

import { useImportValidation } from './useImportValidation';

const prepare = (values) => ({ transcript: values });
const response = (valid = true, issues = []) => ({
    status: valid ? 200 : 422,
    json: async () => ({ valid, issues }),
});

beforeEach(() => {
    window.fetch = jest.fn();
    document.head.innerHTML = '<meta name="csrf-token" content="test-token">';
});

test('only checks on demand with Rails multipart fields', async () => {
    fetch.mockResolvedValue(response());
    const values = {
        data: new File(['text'], 'file.csv'),
        tape_number: '1',
        delete_existing: false,
    };
    const { result } = renderHook(() =>
        useImportValidation('/adg/de', 'transcripts', prepare)
    );
    expect(fetch).not.toHaveBeenCalled();
    let valid;
    await act(async () => {
        valid = await result.current.check(values);
    });
    expect(valid).toBe(true);
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe('/adg/de/transcripts/validate');
    expect(options.headers['X-CSRF-Token']).toBe('test-token');
    expect(options.body.get('transcript[data]')).toBe(values.data);
    expect(options.body.get('transcript[delete_existing]')).toBe('false');
});

test('reset clears issues without checking again and invalidates in-flight results', async () => {
    let finish;
    fetch.mockImplementationOnce(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            })
    );
    const { result } = renderHook(() =>
        useImportValidation('/adg/de', 'transcripts', prepare)
    );
    let check;
    act(() => {
        check = result.current.check({ data: new File(['old'], 'file.csv') });
    });
    expect(result.current.status).toBe('checking');
    act(() => result.current.reset());
    expect(fetch.mock.calls[0][1].signal.aborted).toBe(true);
    let valid;
    await act(async () => {
        finish(response());
        valid = await check;
    });
    expect(valid).toBe(false);
    expect(result.current.status).toBe('idle');
    expect(fetch).toHaveBeenCalledTimes(1);

    fetch.mockResolvedValueOnce(
        response(false, [{ code: 'bad', params: {}, location: {} }])
    );
    await act(async () => {
        await result.current.check({ data: new File(['new'], 'file.csv') });
    });
    expect(result.current.status).toBe('invalid');
    act(() => result.current.reset());
    expect(result.current.issues).toEqual([]);
});

test('handles non-JSON failures and allows another explicit submission', async () => {
    fetch.mockResolvedValueOnce({
        status: 403,
        json: async () => {
            throw new Error('HTML');
        },
    });
    fetch.mockResolvedValueOnce(response());
    const values = { data: new File(['text'], 'file.csv') };
    const { result } = renderHook(() =>
        useImportValidation('/adg/de', 'transcripts', prepare)
    );
    let valid;
    await act(async () => {
        valid = await result.current.check(values);
    });
    expect(valid).toBe(false);
    expect(result.current.status).toBe('error');
    await act(async () => {
        valid = await result.current.check(values);
    });
    expect(valid).toBe(true);
});

test('route changes and unmounting invalidate checks even if fetch ignores abort', async () => {
    let finish;
    fetch.mockImplementation(
        () =>
            new Promise((resolve) => {
                finish = resolve;
            })
    );
    const { result, rerender, unmount } = renderHook(
        ({ path }) => useImportValidation(path, 'transcripts', prepare),
        {
            initialProps: { path: '/adg/de' },
        }
    );
    let check;
    act(() => {
        check = result.current.check({ data: new File(['text'], 'file.csv') });
    });
    rerender({ path: '/other/de' });
    expect(result.current.status).toBe('idle');
    let valid;
    await act(async () => {
        finish(response());
        valid = await check;
    });
    expect(valid).toBe(false);
    act(() => {
        check = result.current.check({ data: new File(['text'], 'file.csv') });
    });
    unmount();
    await act(async () => {
        finish(response());
        valid = await check;
    });
    expect(valid).toBe(false);
});
