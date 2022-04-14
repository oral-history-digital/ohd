import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { FaUndo } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import useSearchParams from '../useSearchParams';
import ArchiveFacets from './ArchiveFacets';
import ArchiveSearchFormInput from './ArchiveSearchFormInput';

export default function ArchiveSearchForm({
    clearAllInterviewSearch,
    clearSearch,
    facets,
    hideSidebar,
    isArchiveSearching,
    map,
    projectId,
    query,
    resetQuery,
    setMapQuery,
    setQueryParams,
}) {
    const { t } = useI18n();
    const formEl = useRef(null);

    const { fulltext, setFulltext } = useSearchParams();

    const [fulltextInput, setFulltextInput] = useState(fulltext);

    function handleChange(event) {
        const value = event.target.value;
        const name = event.target.name;
        if (map){
            setQueryParams('map', {[name]: value});
        } else {
            setQueryParams('archive', {[name]: value});
        }
    }

    function handleReset() {
        formEl.current.reset();
        if (isMobile()) {
            hideSidebar();
        }
        if (map) {
            resetQuery('map');
            setMapQuery({});
        } else {
            setFulltextInput('');
            setFulltext('');

            resetQuery('archive');
        }
    }

    function handleSubmit(event) {
        setFulltext(fulltextInput?.trim());

        if (event !== undefined) event.preventDefault();
        let params = serialize(formEl.current, {hash: true});

        console.log(params);

        params = getValueFromDataList(params, event);
        params = prepareQuery(params);
        params['page'] = 1;

        if (isMobile()) {
            hideSidebar();
        }
        submit(params);
    }

    function getValueFromDataList(params, event) {
        if (event && event.currentTarget.list) {
            for (let i = 0; i < event.currentTarget.list.children.length; i++) {
                if (event.currentTarget.list.children[i].innerText === event.currentTarget.value) {
                    let facet = event.currentTarget.name;
                    let facetValue = event.currentTarget.list.children[i].dataset[facet];
                    params[facet] = [facetValue];
                }
            }
        }
        return params;
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

    function submit(params) {
        console.log(params);

        if(map) {
            setMapQuery(params);
        } else if (!map && !isArchiveSearching) {
            clearSearch();
            clearAllInterviewSearch();
        }
    }

    return (
        <div>
            <form
                ref={formEl}
                id="archiveSearchForm"
                className="flyout-search"
                onSubmit={handleSubmit}
            >
                {
                    (projectId === 'mog') ?
                        <ArchiveSearchFormInput
                            value={fulltextInput}
                            projectId={projectId}
                            onChange={setFulltextInput}
                        />
                    :
                    <AuthShowContainer ifLoggedIn ifCatalog ifNoProject>
                       <ArchiveSearchFormInput
                            value={fulltextInput}
                            projectId={projectId}
                            onChange={setFulltextInput}
                        />
                    </AuthShowContainer>
                }
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
                            query={query}
                            facets={facets}
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
    query: PropTypes.object.isRequired,
    facets: PropTypes.object.isRequired,
    projectId: PropTypes.string,
    isArchiveSearching: PropTypes.bool.isRequired,
    map: PropTypes.bool,
    searchInArchive: PropTypes.func.isRequired,
    setMapQuery: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    resetQuery: PropTypes.func.isRequired,
    clearSearch: PropTypes.func.isRequired,
    clearAllInterviewSearch: PropTypes.func.isRequired,
};
