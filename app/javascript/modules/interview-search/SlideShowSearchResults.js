import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setArchiveId, setProjectId } from 'modules/archive';
import SlideShowSearchStats from './SlideShowSearchStats';
import TranscriptResult from './TranscriptResult';

export default function SlideShowSearchResults({
    interview,
    searchResults,
    hrefOrPath,
    projectId,
}) {
    const dispatch = useDispatch();

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
                            onClick={() => {
                                setProjectId(projectId);
                                setArchiveId(interview.archive_id);
                            }}
                            to={hrefOrPath}
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
