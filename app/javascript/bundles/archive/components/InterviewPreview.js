import React from 'react';
import {Link} from 'react-router-dom';

import { PROJECT, MISSING_STILL } from '../constants/archiveConstants'
import InterviewSearchResultsContainer from '../containers/InterviewSearchResultsContainer';
import AuthShowContainer from '../containers/AuthShowContainer';

import { t, admin, pathBase } from '../../../lib/utils';

export default class InterviewPreview extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        let detailedState = false;
        this.state = {
            open: detailedState,
            divClass: detailedState ? "interview-preview search-result detailed" : "interview-preview search-result",
        };
    }

    handleClick(event) {
        if (event !== undefined) event.preventDefault();
        if (this.state.open) {
            this.setState({
                ['open']: false,
                ['divClass']: "interview-preview search-result",
            });
        } else {
            this.setState({
                ['open']: true,
                ['divClass']: "interview-preview search-result detailed",
            });
        }
    }

    componentDidMount() {
        if(this.props.fulltext) {
            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
        } else {
            // Is there any reason to run the empty search and thus drag down performance?
            //this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: '', id: this.props.interview.archive_id});
        }
    }

    facetToClass(facetname) {
        // e.g. "forced-labor-group" => "forced_labor_group[]"
        let query = facetname.replace(/-/g, '_') + '[]';
        return (this.props.query[query] && this.props.query[query].length > 0) ? '' : 'hidden';
    }

    resultsCount() {
        let count = 0; 
        if (this.interviewSearchResults() && this.interviewSearchResults().foundSegments) {
            count += this.interviewSearchResults().foundSegments.length + 
                this.interviewSearchResults().foundPeople.length +
                this.interviewSearchResults().foundRegistryEntries.length +
                this.interviewSearchResults().foundBiographicalEntries.length;
        }
        return count;
    }

    renderBadge() {
        if (this.resultsCount() > 0) {
            return (
                <div className={'badge'}  onClick={this.handleClick} title={`${t(this.props, 'segment_hits')}: ${this.resultsCount()}`}>
                    <i className="fa fa-align-justify" aria-hidden="true" />
                    &nbsp;
                    {this.resultsCount()}
                </div>
            )
        }
    }

    interviewSearchResults() {
        return this.props.interviewSearchResults[this.props.interview.archive_id];
    }

    renderSlider(){
        if (this.resultsCount()) {
            return (
                <div className='slider'>
                    <div className={'archive-search-found-segments'}>
                        <InterviewSearchResultsContainer 
                            interview={this.props.interview}
                            searchResults={this.interviewSearchResults()}
                            asSlideShow={true} 
                        />
                    </div>
                </div>
            )
        }
    }

    interviewDetails() {
        if (this.props.projectId === 'zwar') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    <span>{t(this.props, `search_facets.${this.props.interview.media_type}`)}</span> <span>{this.props.interview.duration_human}</span><br/>
                    <span>{this.props.interview.language[this.props.locale]}</span>
                    <small className={this.facetToClass("forced-labor-group")}><br/>{this.props.interview.forced_labor_group[this.props.locale]}</small>
                    <small className={this.facetToClass("year-of-birth")}><br/>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth[this.props.locale]}</small>
                    <small className={this.facetToClass("forced-labor-field")}><br/>{this.props.interview.forced_labor_field[this.props.locale]}</small>
                </div>
            );
        }
        else if (this.props.projectId === 'mog') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    {this.content( t(this.props, 'duration'), this.props.interview.duration_human)}
                    {this.content(t(this.props, 'typologies'), this.props.interview.typology[this.props.locale])}
                    <small className={this.facetToClass("year-of-birth")}>{this.content( t(this.props, 'year_of_birth'), this.props.interview.year_of_birth[this.props.locale])}</small>
                {/*<small className={this.facetToClass("year-of-birth")}>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth[this.props.locale]}</small>*/}
                </div>
            )
        }
        else if (this.props.projectId === 'dg') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    <span>{this.props.interview.duration_human}</span><br/>
                    <small className={this.facetToClass("year-of-birth")}>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth[this.props.locale]}</small>
                </div>
            )
        } else { 
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    <span>{t(this.props, `search_facets.${this.props.interview.media_type}`)}</span> <span>{this.props.interview.duration_human}</span><br/>
                    <span>{this.props.interview.language[this.props.locale]}</span>
                </div>
            );
        }
    }

    content(label, value) {
        return (
            <div>
                {label}:&nbsp;
                <span>{value}</span>
            </div>
        )
    }

    renderExportCheckbox() {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return <div>
                <input 
                    type='checkbox' 
                    className='export-checkbox' 
                    checked={this.props.selectedArchiveIds.indexOf(this.props.interview.archive_id) > 0} 
                    onChange={() => {this.props.addRemoveArchiveId(this.props.interview.archive_id)}}
                />
            </div>
        } else {
            return null;
        }
    }

    render() {
        if (this.props.statuses && this.props.statuses[this.props.interview.archive_id] !== 'deleted') {
            return (
                <div className={this.state.divClass}>
                    {this.renderBadge()}
                    <Link className={'search-result-link'}
                        onClick={() => { 
                            this.props.setArchiveId(this.props.interview.archive_id); 
                            this.props.setTapeAndTime(1, 0) 
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                    >
                        <div className="search-result-img">
                            <img src={this.props.interview.still_url || 'missing_still'} onError={(e)=>{e.target.src=MISSING_STILL}}/>
                        </div>
                        
                        <AuthShowContainer ifLoggedIn={true}>
                            <p className={'search-result-name'}>{this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}</p>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true}>
                            <p className={'search-result-name'}>{this.props.interview.anonymous_title && this.props.interview.anonymous_title[this.props.locale]}</p>
                        </AuthShowContainer> 
                        
                        {this.interviewDetails()} 
                    </Link>
                    {this.renderSlider()}
                    {this.renderExportCheckbox()}
                </div>
            );
        } else {
            return null;
        }
    }
}

