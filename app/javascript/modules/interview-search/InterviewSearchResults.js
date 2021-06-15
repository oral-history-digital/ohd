import { useReducer } from 'react';
import PropTypes from 'prop-types';
import { FaPlus, FaMinus } from 'react-icons/fa';
import classNames from 'classnames';

import { useI18n } from 'modules/i18n';
import ResultListContainer from './ResultListContainer';
import reducer from './reducer';
import modelsWithResults from './modelsWithResults';
import resultsForModel from './resultsForModel';

export default function InterviewSearchResults({
    interview,
    searchResults,
}) {
    const filteredModelNames = modelsWithResults(searchResults);

    const initialState = filteredModelNames.reduce((acc, name) => {
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

    if (filteredModelNames.length === 0) {
        return (
            <div>{t('modules.interview_search.no_results')}</div>
        );
    }

    return filteredModelNames.map(modelName => (
        <div
            key={modelName}
            className="Disclosure u-mt"
        >
            <button
                type="button"
                className="Disclosure-toggle"
                onClick={() => handleClick(modelName)}
            >
                {state[modelName] ?
                    <FaMinus className="Disclosure-icon" /> :
                    <FaPlus className="Disclosure-icon" />
                }
                <h3 className="Disclosure-heading">
                    {resultsForModel(searchResults, modelName).length}
                    {' '}
                    {t(modelName.toLowerCase() + '_results')}
                </h3>
            </button>
            <div className={classNames('Disclosure-content', 'u-ml', { 'is-expanded': state[modelName] })}>
                <ResultListContainer
                    model={modelName}
                    searchResults={resultsForModel(searchResults, modelName)}
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
