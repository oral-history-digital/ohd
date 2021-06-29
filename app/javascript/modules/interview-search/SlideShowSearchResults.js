import PropTypes from 'prop-types';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setArchiveId } from 'modules/archive';
import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import SlideShowSearchStats from './SlideShowSearchStats';
import TranscriptResult from './TranscriptResult';

export default function SlideShowSearchResults({
    interview,
    searchResults,
}) {
    const dispatch = useDispatch();
    const pathBase = usePathBase();
    const { locale } = useI18n();

    const segments = searchResults.foundSegments;

    if (!segments) {
        return null;
    }

    const filteredSegments = segments.filter(segment => segment.text[locale] !== '');

    return (
        <Slider>
            {
                filteredSegments.map(data => (
                    <div key={data.id}>
                        <Link
                            key={data.id}
                            onClick={() => dispatch(setArchiveId(interview.archive_id))}
                            to={`${pathBase}/interviews/${interview.archive_id}`}
                        >
                            <TranscriptResult data={data} />
                        </Link>
                    </div>
                ))
            }
            <div>
                <SlideShowSearchStats
                    interview={interview}
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
