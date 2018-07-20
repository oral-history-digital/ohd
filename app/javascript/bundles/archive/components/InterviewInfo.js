import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import {Link, hashHistory} from 'react-router-dom';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import ContributionFormContainer from '../containers/ContributionFormContainer';
import PersonContainer from '../containers/PersonContainer';

export default class InterviewInfo extends React.Component {

    constructor(props, context) {
        super(props, context);
    }

    to() {
        return '/' + this.props.locale + '/interviews/' + this.props.interview.archive_id;
    }

    download(lang, condition) {
        if (!condition) {
            let textKey = this.props.interview.lang === lang ? 'transcript' : 'translation';
            return (
                <p>
                    <a href={`${this.to()}.pdf?lang=${lang}&kind=interview`}>
                        <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download')}></i>
                        <span>{t(this.props, textKey)}</span>
                    </a>
                </p>
            )
        } else {
            return null;
        }
    }


    placeOfInterview(){
        if (this.props.interview.place_of_interview){
            return this.content(t(this.props, 'place_of_interview'), this.props.interview.place_of_interview.descriptor[this.props.locale], "" );
        }
    }

    language(){
        return this.content(t(this.props, 'language'), this.props.interview.languages_array[this.props.locale], "");
    }

    segmentators(){
        return this.contributors('segmentator').map(s => fullname(this.props, s)).join(', ');
    }

    contributors(contributionType) {
        if (this.props.interview && this.props.people) {
            return this.props.interview[`${contributionType}_ids`].map(cId => this.props.people[cId]);
        } else {
            return [];
        }
    }

    tapes(){
        if (this.props.interview.tape_count > 1){
            return this.content(t(this.props, 'tapes'), this.props.interview.tape_count, "")
        }
    }

    info() {
        if (admin(this.props)) {
            return ( 
                <InterviewFormContainer 
                    submitText='edit.interview.edit' 
                    interview={this.props.interview}
                />
            );
        } else {
            return (
                <div>
                    {this.content(t(this.props, 'date'), this.props.interview.created, "figure-letter-spacing")}
                    {this.placeOfInterview()}
                    {this.content(t(this.props, 'duration'), this.props.interview.formatted_duration, "figure-letter-spacing")}
                    {this.tapes()}
                    {this.language()}
                </div>
            );
        }
    }

    content(label, value, className) {
        if (value) {
            return (
                <p>
                    <span className="flyout-content-label">{label}:</span>
                    <span className={"flyout-content-data " + className}>{value}</span>
                </p>
            )
        }
    }

    contributors() {
        let contributors = [];
        if (this.props.interview && this.props.people_status === 'fetched' && this.props.contributionTypes) {
            for (var c in this.props.interview.contributions) {
                let contribution = this.props.interview.contributions[c];
                //if (
                    //contribution && 
                    //(Object.values(this.props.contributionTypes).indexOf(contribution.contribution_type) > -1 || 
                    //admin(this.props))
                //)
                if (contribution !== 'fetched') {
                    contributors.push(<PersonContainer person={this.props.people[contribution.person_id]} contribution={contribution} key={`contribution-${contribution.id}`} />);
                }
            }
        } 
        return contributors;
    }

    addContribution() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.add_contribution')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.add_contribution'),
                        content: <ContributionFormContainer interview={this.props.interview} />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.info()}
                    {this.contributors()}
                    {this.addContribution()}
                    {this.content(t(this.props, 'id'), this.props.archiveId, "")}
                    <AuthShowContainer ifLoggedIn={true}>
                        {this.download(this.props.interview.lang)}
                        {this.download(this.props.locale, (this.props.interview.lang === this.props.locale))}
                    </AuthShowContainer>
                </div>
            );
        } else {
            return null;
        }
    }
}

