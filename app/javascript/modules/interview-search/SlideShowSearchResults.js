import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setArchiveId } from 'modules/archive';
import { usePathBase } from 'modules/routes';
import { FoundSegmentContainer } from 'modules/transcript';
import { pluralize } from 'modules/strings';
import SlideShowSearchStats from './SlideShowSearchStats';

const SEGMENT_NAME = 'Segment';

export default function SlideShowSearchResults({
    interview,
    searchResults,
}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    const searchResultsForSegment = searchResults[`found${pluralize(SEGMENT_NAME)}`];

    if (!searchResultsForSegment) {
        return null;
    }

    return (
        <Slider>
            {
                searchResultsForSegment.map(data => (
                    <div key={data.id}>
                        <Link
                            key={data.id}
                            onClick={() => dispatch(setArchiveId(interview.archive_id))}
                            to={`${pathBase}/interviews/${interview.archive_id}`}
                        >
                            <FoundSegmentContainer data={data} />
                        </Link>
                    </div>
                ))
            }
            <div>
                <SlideShowSearchStats
                    searchResults={searchResults}
                />
            </div>
        </Slider>
    );
}

SlideShowSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
