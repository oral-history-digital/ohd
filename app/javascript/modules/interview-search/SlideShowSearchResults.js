import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setArchiveId, setProjectId } from 'modules/archive';
import { usePathBase } from 'modules/routes';
import SlideShowSearchStats from './SlideShowSearchStats';
import TranscriptResult from './TranscriptResult';

export default function SlideShowSearchResults({
    interview,
    searchResults,
}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    const segments = searchResults.foundSegments;

    if (!segments) {
        return null;
    }

    return (
        <Slider>
            {
                segments.map(data => (
                    <div key={data.id}>
                        <Link
                            key={data.id}
                            onClick={() => dispatch(
                                setProjectId(projectId),
                                setArchiveId(interview.archive_id)
                            )}
                            to={`${pathBase}/interviews/${interview.archive_id}`}
                        >
                            <TranscriptResult data={data} />
                        </Link>
                    </div>
                ))
            }
            <div>
                <SlideShowSearchStats searchResults={searchResults} />
            </div>
        </Slider>
    );
}

SlideShowSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
