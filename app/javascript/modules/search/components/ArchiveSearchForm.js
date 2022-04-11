import { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'form-serialize';
import { FaSearch, FaUndo } from 'react-icons/fa';

import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import { AuthShowContainer } from 'modules/auth';
import { isMobile, isIOS } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import ArchiveFacets from './ArchiveFacets';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

export default class ArchiveSearchForm extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReset = this.handleReset.bind(this);
    }

    handleChange(event) {
        const { map, setQueryParams } = this.props;

        const value = event.target.value;
        const name = event.target.name;
        if (map){
            setQueryParams('map', {[name]: value});
        } else {
            setQueryParams('archive', {[name]: value});
        }
    }

    handleReset(event) {
        const { hideSidebar, resetQuery, setMapQuery, searchInArchive, map } = this.props;

        this.form.reset();
        if (isMobile()) {
            hideSidebar();
        }
        if (map) {
            resetQuery('map');
            setMapQuery({});
        } else {
            resetQuery('archive');
            let url = `${pathBase(this.props)}/searches/archive`;
            searchInArchive(url, {});
        }
    }

    handleSubmit(event) {
        const { hideSidebar } = this.props;

        if (event !== undefined) event.preventDefault();
        let params = serialize(this.form, {hash: true});
        params = this.getValueFromDataList(params, event);
        params = this.prepareQuery(params);
        params['page'] = 1;
        if (isMobile()) {
            hideSidebar();
        }
        this.submit(params);
    }

    getValueFromDataList(params, event) {
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

    arrayToRange(min, max) {
        let array = [];
        if (min <= max) {
            for (let i = min; i <= max; i++){
                array.push(i)
            }
        }
        return array;
    }

    prepareQuery(params) {
        const { facets } = this.props;

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
            preparedQuery['year_of_birth[]'] = this.arrayToRange( params['year_of_birth_min'], params['year_of_birth_max'] )
        }
        return preparedQuery;
    }

    submit(params) {
        const { map, isArchiveSearching, searchInArchive, clearSearch, clearAllInterviewSearch, setMapQuery } = this.props;

        if(map) {
            setMapQuery(params);
        } else if (!map && !isArchiveSearching) {
            let url = `${pathBase(this.props)}/searches/archive`;
            clearSearch();
            clearAllInterviewSearch();
            searchInArchive(url, params);
        }
    }

    renderInputField() {
        const { map, query, projectId } = this.props;

        let fulltext = query.fulltext ? query.fulltext : "";
        if (map !== true) {
            return (
                <div className="flyout-search-input">
                    <input
                        className="search-input"
                        type="text"
                        name="fulltext"
                        value={fulltext}
                        placeholder={t(this.props, (projectId === 'dg' ? 'enter_field_dg' : 'enter_field'))}
                        onChange={this.handleChange}
                        list='allInterviewTitles'
                    />
                    {this.renderDataList()}
                    <button
                        type="submit"
                        id="search-button"
                        className="Button Button--transparent Button--icon search-button"
                        title={t(this.props, 'archive_search')}
                    >
                        <FaSearch />
                    </button>
                </div>
            )
        } else {
            return fulltext;
        }
    }

    renderDataList() {
        if( !isIOS() ) {
            return (
                <datalist id="allInterviewTitles">
                    <select>
                        {this.renderOptions()}
                    </select>
                </datalist>
            );
        } else {
            return null;
        }
    }

    renderOptions() {
        const { allInterviewsTitles, allInterviewsPseudonyms, locale } = this.props;

        const titles = allInterviewsTitles ? allInterviewsTitles
            .concat(allInterviewsPseudonyms)
            .map(title => title?.[locale])
            .filter(title => title)
            .filter(title => title !== 'no interviewee given')
            .filter(onlyUnique) : [];

        return titles.map(title => (
            <option key={title} value={`"${title}"`} />
        ));
    }

    render() {
        const { isArchiveSearching, query, projectId, searchInArchive, facets, map } = this.props;

        if (!facets) {
            if (!isArchiveSearching) {
                let url = `${pathBase(this.props)}/searches/archive`;
                searchInArchive(url, query);
            }
            return <Spinner withPadding />;
        }

        return (
            <div>
                <form
                    ref={(form) => { this.form = form; }}
                    id="archiveSearchForm"
                    className="flyout-search"
                    onSubmit={this.handleSubmit}
                >
                    {
                        (projectId === 'mog') ?
                            this.renderInputField()
                        :
                        <AuthShowContainer ifLoggedIn ifCatalog ifNoProject>
                            {this.renderInputField()}
                        </AuthShowContainer>
                    }
                    <button
                        type="button"
                        className="Button reset"
                        onClick={this.handleReset}
                    >
                        {t(this.props, 'reset')}
                        <FaUndo className="Icon" />
                    </button>

                    <ArchiveFacets
                        query={query}
                        facets={facets}
                        map={map}
                        handleSubmit={this.handleSubmit}
                    />
                </form>
            </div>
        );
    }
}

ArchiveSearchForm.propTypes = {
    allInterviewsTitles: PropTypes.array.isRequired,
    allInterviewsPseudonyms: PropTypes.array.isRequired,
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
