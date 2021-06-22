import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import modelsWithResults from './modelsWithResults';
import resultsForModel from './resultsForModel';

export default function SlideShowSearchStats({
    searchResults,
}) {
    const { t } = useI18n();

    const names = modelsWithResults(searchResults);

    return (
        <div className="SearchStats">
            <ul className="SearchStats-list">
                {
                    names.map(name => (
                        <li
                            key={name}
                            className="SearchStats-item"
                        >
                            {resultsForModel(searchResults, name).length}
                            {' '}
                            {t(`${name.toLowerCase()}_results`)}
                        </li>
                    ))
                }
            </ul>
        </div>
    );
}

SlideShowSearchStats.propTypes = {
    searchResults: PropTypes.object,
};
