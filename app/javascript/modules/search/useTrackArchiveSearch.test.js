import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme, { mount } from 'enzyme';
import { useShouldTrack, useTrackSiteSearch } from 'modules/analytics';
import { useSearchParams } from 'modules/query-string';

import useTrackArchiveSearch from './useTrackArchiveSearch';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('modules/analytics', () => ({
    useShouldTrack: jest.fn(),
    useTrackSiteSearch: jest.fn(),
}));

jest.mock('modules/query-string', () => ({
    useSearchParams: jest.fn(),
}));

function TestComponent() {
    useTrackArchiveSearch();
    return null;
}

describe('useTrackArchiveSearch', () => {
    let wrapper;
    let trackSiteSearch;

    function setSearchParams(fulltext) {
        useSearchParams.mockReturnValue({
            fulltext,
            fulltextIsSet: fulltext?.length > 0,
        });
    }

    beforeEach(() => {
        trackSiteSearch = jest.fn();
        useTrackSiteSearch.mockReturnValue(trackSiteSearch);
        useShouldTrack.mockReturnValue(true);
    });

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount();
        }
        jest.clearAllMocks();
    });

    it('tracks the search term present in the URL', () => {
        setSearchParams('athen');
        wrapper = mount(<TestComponent />);

        expect(trackSiteSearch).toHaveBeenCalledWith('athen');
    });

    it('does not track when no search term is set', () => {
        setSearchParams(undefined);
        wrapper = mount(<TestComponent />);

        expect(trackSiteSearch).not.toHaveBeenCalled();
    });

    it('does not track the same search term twice', () => {
        setSearchParams('athen');
        wrapper = mount(<TestComponent />);
        wrapper.setProps({});

        expect(trackSiteSearch).toHaveBeenCalledTimes(1);
    });

    it('tracks a changed search term', () => {
        setSearchParams('athen');
        wrapper = mount(<TestComponent />);

        setSearchParams('sparta');
        wrapper.setProps({});

        expect(trackSiteSearch).toHaveBeenCalledTimes(2);
        expect(trackSiteSearch).toHaveBeenLastCalledWith('sparta');
    });

    it('does not track when the user must not be tracked', () => {
        useShouldTrack.mockReturnValue(false);
        setSearchParams('athen');
        wrapper = mount(<TestComponent />);

        expect(trackSiteSearch).not.toHaveBeenCalled();
    });

    it('tracks once the user data has been fetched', () => {
        useShouldTrack.mockReturnValue(false);
        setSearchParams('athen');
        wrapper = mount(<TestComponent />);

        useShouldTrack.mockReturnValue(true);
        wrapper.setProps({});

        expect(trackSiteSearch).toHaveBeenCalledWith('athen');
    });
});
