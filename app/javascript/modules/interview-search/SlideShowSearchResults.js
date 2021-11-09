import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useDispatch } from 'react-redux';

import { LinkOrA } from 'modules/routes';
import { setArchiveId, setProjectId } from 'modules/archive';
import { usePathBase } from 'modules/routes';
import SlideShowSearchStats from './SlideShowSearchStats';
import DumbTranscriptResult from './DumbTranscriptResult';

export default function SlideShowSearchResults({
    interview,
    searchResults,
    projectId,
    project,
}) {
    const dispatch = useDispatch();

    const segments = searchResults.foundSegments;

    if (!segments) {
        return null;
    }

    return (
        <Slider
            className="Slider Slider--thumbnail"
            dots={false}
        >
            {
                segments.map(data => (
                    <div key={data.id}>
                        <div style={{marginBottom: '24px'}}>
                        <LinkOrA
                            key={data.id}
                            project={project}
                            onLinkClick={() => dispatch(
                                setProjectId(projectId),
                                setArchiveId(interview.archive_id)
                            )}
                            to={`interviews/${interview.archive_id}`}
                        >
                            <DumbTranscriptResult
                                highlightedText={Object.values(data.text).find(text => text?.length > 0)}
                                tapeNumber={data.tape_nbr}
                                time={data.time}
                            />
                        </LinkOrA>
                        </div>
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
    projectId: PropTypes.string.isRequired,
};
