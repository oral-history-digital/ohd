import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { useDispatch } from 'react-redux';

import { LinkOrA } from 'modules/routes';
import { formatTimecode } from 'modules/interview-helpers';
import { setArchiveId, setProjectId } from 'modules/archive';
import SlideShowSearchStats from './SlideShowSearchStats';
import DumbTranscriptResult from './DumbTranscriptResult';

export default function SlideShowSearchResults({
    interview,
    searchResults,
    projectId,
    project,
}) {
    const dispatch = useDispatch();

    const segments = searchResults.found_segments;

    if (!Array.isArray(segments)) {
        return null;
    }

    if (segments.length === 0) {
        return <SlideShowSearchStats searchResults={searchResults}/>;
    }

    return (
        <Slider
            className="Slider Slider--thumbnail"
            dots={false}
        >
            <div>
                <SlideShowSearchStats searchResults={searchResults} />
            </div>
            {
                segments.map(segment => {
                    let lang;
                    for (const [key, value] of Object.entries(segment.text)) {
                        if (value?.length > 0) {
                            if (key === 'orig') {
                                lang = interview.alpha3;
                            } else {
                                lang = key;
                            }
                            break;
                        }
                    }

                    const timeCode = formatTimecode(segment.time, true);

                    return (
                        <div key={segment.id}>
                            <div style={{marginBottom: '24px'}}>
                                <LinkOrA
                                    key={segment.id}
                                    project={project}
                                    onLinkClick={() => dispatch(
                                        setProjectId(projectId),
                                        setArchiveId(interview.archive_id)
                                    )}
                                    to={`interviews/${interview.archive_id}?tape=${segment.tape_nbr}&time=${timeCode}`}
                                >
                                    <DumbTranscriptResult
                                        highlightedText={Object.values(segment.text).find(text => text?.length > 0)}
                                        tapeNumber={segment.tape_nbr}
                                        time={segment.time}
                                        lang={lang}
                                        transcriptCoupled={interview.transcript_coupled}
                                    />
                                </LinkOrA>
                            </div>
                        </div>
                    );
                })
            }
        </Slider>
    );
}

SlideShowSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
};
