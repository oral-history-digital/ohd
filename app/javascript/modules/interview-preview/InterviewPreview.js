import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { InterviewSearchResultsContainer } from 'modules/interview-search';
import { AuthShowContainer, admin } from 'modules/auth';
import { humanReadable } from 'lib/utils';
import { pathBase } from 'modules/routes';
import { t } from 'modules/i18n';
import missingStill from 'assets/images/missing_still.png';
import loadIntervieweeWithAssociations from './loadIntervieweeWithAssociations';

export default class InterviewPreview extends React.Component {

    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);

        this.state = { open: false };
    }

    handleClick() {
        this.setState(prevState => ({ open: !prevState.open }));
    }

    componentDidMount() {
        loadIntervieweeWithAssociations(this.props);
        if(this.props.fulltext) {
            this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: this.props.fulltext, id: this.props.interview.archive_id});
        } else {
            // Is there any reason to run the empty search and thus drag down performance?
            //this.props.searchInInterview(`${pathBase(this.props)}/searches/interview`, {fulltext: '', id: this.props.interview.archive_id});
        }
    }

    componentDidUpdate() {
        loadIntervieweeWithAssociations(this.props);
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
                <div className={'badge'} onClick={this.handleClick} title={`${t(this.props, 'segment_hits')}: ${this.resultsCount()}`}>
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

    unsharedIcon() {
        if (this.props.interview.workflow_state === 'unshared') {
            return(<i className="fa fa-eye-slash  fa-lg"  aria-hidden="true"></i>)
        }
    }

    customMetadataFields() {
        const { interviewee } = this.props;

        return this.props.project.grid_fields.map((field, i) => {
            let obj = (field.ref_object_type === 'Interview' || field.source === 'Interview') ?
                this.props.interview :
                interviewee;
            return (
                <li
                    key={field.name}
                    className={classNames('DetailList-item', {
                        'DetailList-item--shortened': field.name === 'description',
                    })}
                >
                    {humanReadable(obj, field.name, this.props, this.state, '') + ' '}
                </li>
            );
        });
    }

    interviewDetails() {
        const { interviewee } = this.props;

        if (interviewee && interviewee.associations_loaded && !this.state.open) {
            return (
                <ul className="DetailList" lang={this.props.locale}>
                    {this.customMetadataFields()}
                </ul>
            )
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
        if (admin(this.props, {type: 'Interview', action: 'update', interview_id: this.props.interview.id})) {
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
                <div className={classNames('interview-preview', 'search-result', {
                    'detailed': this.state.open,
                })}>
                    {this.renderBadge()}
                    <Link className={'search-result-link'}
                        onClick={() => {
                            this.props.setArchiveId(this.props.interview.archive_id);
                            this.props.setTapeAndTime(1, 0)
                        }}
                        to={pathBase(this.props) + '/interviews/' + this.props.interview.archive_id}
                    >
                        <div className="search-result-img aspect-ratio">
                          <img className="aspect-ratio__inner"
                               src={this.props.interview.still_url || 'missing_still'}
                               onError={ (e) => { e.target.src = missingStill; }}/>
                        </div>

                        <AuthShowContainer ifLoggedIn={true}>
                            <p className={'search-result-name'}>
                                {this.unsharedIcon()}
                                {this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}
                            </p>
                        </AuthShowContainer>
                        <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                            <p className={'search-result-name'}>
                                {this.unsharedIcon()}
                                {this.props.project.fullname_on_landing_page ? this.props.interview.title[this.props.locale] : this.props.interview.anonymous_title[this.props.locale]}
                            </p>
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

InterviewPreview.propTypes = {
    interviewee: PropTypes.object.isRequired,
};
