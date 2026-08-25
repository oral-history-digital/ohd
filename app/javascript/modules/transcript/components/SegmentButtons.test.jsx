import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SegmentButtons from './SegmentButtons';

jest.mock('modules/i18n', () => ({
    useI18n: () => ({
        t: (key) => key,
    }),
}));

describe('SegmentButtons', () => {
    const baseSegment = {
        id: 123,
        has_heading: false,
        registry_references_count: 0,
        annotations: {},
    };

    function renderComponent(props = {}) {
        return render(
            <SegmentButtons
                segment={baseSegment}
                contentLocale="en"
                onEditStart={jest.fn()}
                onViewContentType={jest.fn()}
                onBookmarkCreate={jest.fn()}
                isEditingSegment={false}
                canEditSegment={false}
                hasBookmarks={false}
                {...props}
            />
        );
    }

    it('opens bookmarks viewer when bookmark exists', async () => {
        const user = userEvent.setup();
        const onViewContentType = jest.fn();
        const onBookmarkCreate = jest.fn();
        renderComponent({
            hasBookmarks: true,
            onViewContentType,
            onBookmarkCreate,
        });

        await user.click(screen.getByTestId('segment-button-bookmarks'));

        expect(onViewContentType).toHaveBeenCalledWith('bookmarks');
        expect(onBookmarkCreate).not.toHaveBeenCalled();
    });

    it('opens create-bookmark flow when no bookmark exists', async () => {
        const user = userEvent.setup();
        const onViewContentType = jest.fn();
        const onBookmarkCreate = jest.fn();
        renderComponent({
            hasBookmarks: false,
            onViewContentType,
            onBookmarkCreate,
        });

        await user.click(screen.getByTestId('segment-button-bookmarks'));

        expect(onBookmarkCreate).toHaveBeenCalledWith(baseSegment);
        expect(onViewContentType).not.toHaveBeenCalled();
    });

    it('does not render bookmark modal component in row buttons', () => {
        renderComponent({ hasBookmarks: false });

        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('hides unbookmarked star by default', () => {
        renderComponent({ hasBookmarks: false });

        expect(screen.getByTestId('segment-button-bookmarks')).toHaveClass(
            'Segment-hiddenButton'
        );
    });

    it('keeps bookmarked star visible', () => {
        renderComponent({ hasBookmarks: true });

        expect(screen.getByTestId('segment-button-bookmarks')).not.toHaveClass(
            'Segment-hiddenButton'
        );
    });
});
