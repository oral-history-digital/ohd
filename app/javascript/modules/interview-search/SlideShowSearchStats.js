import PropTypes from 'prop-types';

import modelsWithResults from './modelsWithResults';
import resultsForModel from './resultsForModel';

export default function SlideShowSearchStats({
    searchResults,
}) {
    const names = modelsWithResults(searchResults);

    return (
        <>
            <h3 className="u-mt-none">
                Suchergebnisse
            </h3>
            <ul>
                {
                    names.map(name => (
                        <li key={name}>
                            {resultsForModel(searchResults, name).length}
                            {' '}
                            {name}
                        </li>
                    ))
                }
            </ul>
        </>
    );
}

SlideShowSearchStats.propTypes = {
    searchResults: PropTypes.object,
};
