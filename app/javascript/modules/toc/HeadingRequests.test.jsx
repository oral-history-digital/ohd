/* eslint-disable react/prop-types */
import { render, screen } from '@testing-library/react';
import { submitData } from 'modules/data';
import { Form } from 'modules/forms';
import { usePathBase } from 'modules/routes';
import { useSegmentSaveNotification } from 'modules/transcript/hooks';

import InterviewSearch from '../interview-search/InterviewSearch';
import SegmentHeadingForm from './SegmentHeadingForm';
import TableOfContents from './TableOfContents';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('modules/data', () => ({
    submitData: jest.fn(() => ({ type: 'save' })),
}));
jest.mock('modules/forms', () => ({
    Form: jest.fn(() => <p>Heading form</p>),
}));
jest.mock('modules/routes', () => ({ usePathBase: jest.fn() }));
jest.mock('modules/transcript/hooks', () => ({
    useSegmentSaveNotification: jest.fn(),
}));
jest.mock('modules/archive', () => ({ useIsEditor: () => false }));
jest.mock('modules/help-text', () => ({ HelpText: () => null }));
jest.mock('modules/user-agent', () => ({
    ScrollToTop: ({ children }) => children,
}));
jest.mock('modules/i18n', () => ({ useI18n: () => ({ t: (key) => key }) }));
jest.mock('modules/spinners', () => ({ Spinner: () => <p>Loading</p> }));
jest.mock(
    '../interview-search/InterviewSearchForm',
    () =>
        function SearchForm() {
            return null;
        }
);
jest.mock(
    '../interview-search/InterviewSearchResultsContainer',
    () =>
        function SearchResults() {
            return null;
        }
);
jest.mock(
    './HeadingContainer',
    () =>
        function Heading({ data }) {
            return <p>{data.heading}</p>;
        }
);

beforeEach(() => {
    jest.clearAllMocks();
    usePathBase.mockReturnValue('/pilot/en');
    useSegmentSaveNotification.mockReturnValue({ handleSaveStart: jest.fn() });
});

test.each(['/pilot/en', '/de'])(
    'loads reference trees and headings using %s and public interview IDs',
    (pathBase) => {
        usePathBase.mockReturnValue(pathBase);
        const fetchData = jest.fn();
        const { rerender } = render(
            <InterviewSearch
                archiveId="pilot001"
                refTreeStatus="n/a"
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenCalledWith(
            { pathBase },
            'interviews',
            'pilot001',
            'ref_tree'
        );
        rerender(
            <InterviewSearch
                archiveId="pilot001"
                refTreeStatus="fetching"
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenCalledTimes(1);
        rerender(
            <TableOfContents
                archiveId="pilot001"
                headingsFetched={false}
                isIdle={false}
                fetchData={fetchData}
            />
        );
        expect(screen.getByText('Loading')).toBeInTheDocument();
        expect(fetchData).toHaveBeenLastCalledWith(
            { pathBase },
            'interviews',
            'pilot001',
            'headings'
        );
        rerender(
            <TableOfContents
                archiveId="pilot002"
                headingsFetched={false}
                isIdle={false}
                fetchData={fetchData}
            />
        );
        expect(fetchData).toHaveBeenLastCalledWith(
            { pathBase },
            'interviews',
            'pilot002',
            'headings'
        );
    }
);

test('shows headings in the selected language and preserves empty-language messages', () => {
    const headings = {
        1: {
            mainheading: { eng: 'Chapter' },
            subheading: {},
            tape_nbr: 1,
            time: 0,
        },
    };
    const props = {
        archiveId: 'pilot001',
        headingsFetched: true,
        isIdle: false,
        fetchData: jest.fn(),
    };
    const { rerender } = render(
        <TableOfContents {...props} headings={headings} alpha3="eng" />
    );
    expect(screen.getByText('Chapter')).toBeInTheDocument();
    expect(props.fetchData).not.toHaveBeenCalled();
    rerender(<TableOfContents {...props} headings={headings} alpha3="deu" />);
    expect(screen.getByText('without_index_locale')).toBeInTheDocument();
    rerender(<TableOfContents {...props} headings={{}} alpha3="eng" />);
    expect(screen.getByText('without_index')).toBeInTheDocument();
});

test('saves heading translations through the route prefix with callbacks and notifications intact', () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const handleSaveStart = jest.fn();
    const dismissSaveNotification = jest.fn();
    const saveNotification = { variant: 'success' };
    useSegmentSaveNotification.mockReturnValue({
        isSaving: true,
        handleSaveStart,
        saveNotification,
        dismissSaveNotification,
    });
    const segment = {
        id: 7,
        translations_attributes: [{ locale: 'eng', mainheading: 'Chapter' }],
    };
    render(
        <SegmentHeadingForm
            segment={segment}
            onSubmit={onSubmit}
            onCancel={onCancel}
        />
    );
    expect(useSegmentSaveNotification).toHaveBeenCalledWith(7);
    const form = Form.mock.calls.at(-1)[0];
    expect(form).toMatchObject({
        values: { translations_attributes: segment.translations_attributes },
        fetching: true,
        notification: saveNotification,
        onDismissNotification: dismissSaveNotification,
        onCancel,
    });
    const params = {
        segment: {
            id: 7,
            translations_attributes: segment.translations_attributes,
        },
    };
    form.onSubmit(params);
    expect(handleSaveStart).toHaveBeenCalledTimes(1);
    expect(submitData).toHaveBeenCalledWith(
        { pathBase: '/pilot/en' },
        params,
        {},
        onSubmit
    );
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'save' });
});
