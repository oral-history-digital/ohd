import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';

import SegmentButtons from './SegmentButtons';

Enzyme.configure({ adapter: new Adapter() });

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
        return mount(
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

    it('opens bookmarks viewer when bookmark exists', () => {
        const onViewContentType = jest.fn();
        const onBookmarkCreate = jest.fn();
        const wrapper = renderComponent({
            hasBookmarks: true,
            onViewContentType,
            onBookmarkCreate,
        });

        wrapper
            .find('[data-testid="segment-button-bookmarks"]')
            .simulate('click');

        expect(onViewContentType).toHaveBeenCalledWith('bookmarks');
        expect(onBookmarkCreate).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('opens create-bookmark flow when no bookmark exists', () => {
        const onViewContentType = jest.fn();
        const onBookmarkCreate = jest.fn();
        const wrapper = renderComponent({
            hasBookmarks: false,
            onViewContentType,
            onBookmarkCreate,
        });

        wrapper
            .find('[data-testid="segment-button-bookmarks"]')
            .simulate('click');

        expect(onBookmarkCreate).toHaveBeenCalledWith(baseSegment);
        expect(onViewContentType).not.toHaveBeenCalled();
        wrapper.unmount();
    });

    it('does not render bookmark modal component in row buttons', () => {
        const wrapper = renderComponent({ hasBookmarks: false });

        expect(wrapper.find('BookmarkSegmentModal')).toHaveLength(0);
        wrapper.unmount();
    });

    it('hides unbookmarked star by default', () => {
        const wrapper = renderComponent({ hasBookmarks: false });

        expect(
            wrapper
                .find('[data-testid="segment-button-bookmarks"]')
                .hasClass('Segment-hiddenButton')
        ).toBe(true);
        wrapper.unmount();
    });

    it('keeps bookmarked star visible', () => {
        const wrapper = renderComponent({ hasBookmarks: true });

        expect(
            wrapper
                .find('[data-testid="segment-button-bookmarks"]')
                .hasClass('Segment-hiddenButton')
        ).toBe(false);
        wrapper.unmount();
    });
});
