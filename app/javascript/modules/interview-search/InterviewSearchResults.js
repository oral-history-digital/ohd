import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import classNames from 'classnames';

import { pluralize } from 'modules/strings';
import { useI18n } from 'modules/i18n';
import ResultListContainer from './ResultListContainer';
import { MODEL_NAMES } from './constants';
import reducer from './reducer';

export default function InterviewSearchResults({
    interview,
    searchResults,
}) {
    const modelsWithResults = MODEL_NAMES
        .filter(name => searchResults?.[`found${pluralize(name)}`]?.length > 0)

    const initialState = modelsWithResults.reduce((acc, name) => {
        acc[name] = false;
        return acc;
    }, {});

    const [state, dispatch] = useReducer(reducer, initialState);
    const { t } = useI18n();

    function handleClick(model) {
        dispatch({
            type: 'TOGGLE',
            payload: model,
        });
    }

    if (!searchResults) {
        return null;
    }

    if (modelsWithResults.length === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    return modelsWithResults.map(modelName => (
        <div
            key={modelName}
            className="Disclosure u-mt"
        >
            <button
                type="button"
                className="Disclosure-toggle"
                aria-label="Toggle results"
                onClick={() => handleClick(modelName)}
            >
                {state[modelName] ?
                    <FaMinus className="Disclosure-icon" /> :
                    <FaPlus className="Disclosure-icon" />
                }
                <h3 className="Disclosure-heading">
                    {searchResults[`found${pluralize(modelName)}`].length}
                    {' '}
                    {t(modelName.toLowerCase() + '_results')}
                </h3>
            </button>
            <div className={classNames('Disclosure-content', { 'is-expanded': state[modelName] })}>
                <ResultListContainer
                    model={modelName}
                    searchResults={searchResults[`found${pluralize(modelName)}`]}
                    interview={interview}
                />
            </div>
        </div>
    ));
}

InterviewSearchResults.propTypes = {
    interview: PropTypes.object.isRequired,
    searchResults: PropTypes.object,
};
