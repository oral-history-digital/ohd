import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaUndo } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import useSearchParams from '../useSearchParams';
import useArchiveSearch from '../useArchiveSearch';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

export default function ArchiveSearchForm({
    map,
    projectId,
    hideSidebar,
    clearAllInterviewSearch,
}) {
    const { t } = useI18n();
    const formEl = useRef(null);
    const { facets } = useArchiveSearch();

    const { fulltext, setFulltext, resetSearchParams } = useSearchParams();

    const [fulltextInput, setFulltextInput] = useState(fulltext);

    function handleReset() {
        resetSearchParams();

        if (isMobile()) {
            hideSidebar();
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        setFulltext(fulltextInput?.trim());

        if(!map) {
            clearAllInterviewSearch();
        }

        if (isMobile()) {
            hideSidebar();
        }
    }

    function arrayToRange(min, max) {
        let array = [];
        if (min <= max) {
            for (let i = min; i <= max; i++){
                array.push(i)
            }
        }
        return array;
    }

    function prepareQuery(params) {
        // Set params[key] to empty array. Otherwise Object.assign in reducer would not reset it.
        // Thus the last checkbox would never uncheck.
        // Send list values. e.g. key[] = ["a", "b"]
        let preparedQuery = {};
        if (params['fulltext']) preparedQuery['fulltext'] = params['fulltext'];
        for (let [key, value] of Object.entries(facets)) {
            preparedQuery[`${key}[]`] = params[key] && !(typeof params[key] == "string") ? params[key] : []
        }
        // create list of years for year_of_birth
        if (params['year_of_birth_min']) {
            preparedQuery['year_of_birth[]'] = arrayToRange( params['year_of_birth_min'], params['year_of_birth_max'] )
        }
        return preparedQuery;
    }

    return (
        <div>
            <form
                ref={formEl}
                id="archiveSearchForm"
                className="flyout-search"
                onSubmit={handleSubmit}
            >
                {!map && projectId === 'mog' && (
                    <ArchiveSearchFormInput
                        value={fulltextInput}
                        projectId={projectId}
                        onChange={setFulltextInput}
                    />
                )}
                {!map && projectId !== 'mog' && (
                    <AuthShowContainer ifLoggedIn ifCatalog ifNoProject>
                       <ArchiveSearchFormInput
                            value={fulltextInput}
                            projectId={projectId}
                            onChange={setFulltextInput}
                        />
                    </AuthShowContainer>
                )}
                <button
                    type="button"
                    className="Button reset"
                    onClick={handleReset}
                >
                    {t('reset')}
                    <FaUndo className="Icon" />
                </button>

                {
                    facets ? (
                        <ArchiveFacets
                            map={map}
                            handleSubmit={handleSubmit}
                        />
                    ) :
                    <Spinner withPadding />
                }
            </form>
        </div>
    );
}

ArchiveSearchForm.propTypes = {
    projectId: PropTypes.string,
    map: PropTypes.bool,
    hideSidebar: PropTypes.func.isRequired,
    clearAllInterviewSearch: PropTypes.func.isRequired,
};
