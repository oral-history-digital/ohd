import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { FaSearch, FaUndo } from 'react-icons/fa';

import { usePathBase } from 'modules/routes';
import { useI18n } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import useSearchParams from '../useSearchParams';
import useSearchSuggestions from '../useSearchSuggestions';
import ArchiveFacets from './ArchiveFacets';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export default function ArchiveSearchForm({
    clearAllInterviewSearch,
    clearSearch,
    facets,
    hideSidebar,
    isArchiveSearching,
    locale,
    map,
    projectId,
    query,
    resetQuery,
    searchInArchive,
    setMapQuery,
    setQueryParams,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const formEl = useRef(null);
    const { allInterviewsPseudonyms, allInterviewsTitles } = useSearchSuggestions();

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
            let url = `${pathBase}/searches/archive`;
            searchInArchive(url, {});
        }
    }

    function handleSubmit(event) {
        setFulltext(fulltextInput?.trim());

        if (event !== undefined) event.preventDefault();
        let params = serialize(formEl.current, {hash: true});
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
        if(map) {
            setMapQuery(params);
        } else if (!map && !isArchiveSearching) {
            let url = `${pathBase}/searches/archive`;
            clearSearch();
            clearAllInterviewSearch();
            searchInArchive(url, params);
        }
    }

    function renderInputField() {
        let titles = [];
        if (allInterviewsTitles && allInterviewsPseudonyms) {
            titles = allInterviewsTitles
                .concat(allInterviewsPseudonyms)
                .map(title => title?.[locale])
                .filter(title => title)
                .filter(title => title !== 'no interviewee given')
                .filter(onlyUnique);
        }

        if (map) {
            return fulltext;  // why?
        }

        return (
            <div className="flyout-search-input">
                <input
                    className="search-input"
                    type="text"
                    name="fulltext"
                    value={fulltextInput}
                    placeholder={t(projectId === 'dg' ? 'enter_field_dg' : 'enter_field')}
                    onChange={event => setFulltextInput(event.target.value)}
                    list='allInterviewTitles'
                />
                <datalist id="allInterviewTitles">
                    {
                        titles.map(title => (
                            <option key={title} value={`"${title}"`} />
                        ))
                    }
                </datalist>
                <button
                    type="submit"
                    id="search-button"
                    className="Button Button--transparent Button--icon search-button"
                    title={t('archive_search')}
                >
                    <FaSearch />
                </button>
            </div>
        );
    }

    if (!facets) {
        if (!isArchiveSearching) {
            let url = `${pathBase}/searches/archive`;
            searchInArchive(url, query);
        }
        return <Spinner withPadding />;
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
                        renderInputField()
                    :
                    <AuthShowContainer ifLoggedIn ifCatalog ifNoProject>
                        {renderInputField()}
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

                <ArchiveFacets
                    query={query}
                    facets={facets}
                    map={map}
                    handleSubmit={handleSubmit}
                />
            </form>
        </div>
    );
}

ArchiveSearchForm.propTypes = {
    locale: PropTypes.string.isRequired,
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
