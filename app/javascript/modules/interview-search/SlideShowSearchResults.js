import PropTypes from 'prop-types';
import Slider from "react-slick";

import ResultListContainer from './ResultListContainer';
import { MODEL_NAMES } from './constants';

export default function SlideShowSearchResults({
    interview,
    searchResults,
}) {
    return (
        <Slider infinite={false}>
            {MODEL_NAMES.map(model => (
                <ResultListContainer
                    key={model}
                    model={model}
                    searchResults={searchResults}
                    interview={interview}
                    withLink
                />
            ))}
        </Slider>
    );
}

SlideShowSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
