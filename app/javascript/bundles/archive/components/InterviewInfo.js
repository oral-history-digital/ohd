import React from 'react';
import { t, fullname, admin } from '../../../lib/utils';
import {Link, hashHistory} from 'react-router-dom';
import AuthShowContainer from '../containers/AuthShowContainer';
import InterviewFormContainer from '../containers/InterviewFormContainer';
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

    //contributors() {
        //if (this.props.interview && this.props.people_status === 'fetched') {
            //return ['interviewer', 'cinematographer', 'transcriptor', 'translator'].map((contributionType, index) => {
                //for (var first in this.props.interview[`${contributionType}_contributions`]) break;
                //let contribution = this.props.interview[`${contributionType}_contributions`][first];
                //if (contribution)
                    //return <PersonContainer person={this.props.people[contribution.person_id]} contribution={contribution} key={`${contribution.contribution_type}-${index}`} />;
            //})
        //} else {
            //return null;
        //}
    //}

    //segmentators(){
        //if (this.props.interview && this.props.people_status === 'fetched') {
            //let segmentators = [];
            //for(var s  in this.props.interview.segmentator_contributions) {
                //let contribution = this.props.interview.segmentator_contributions[s];
                //segmentators.push(<PersonContainer person={this.props.people[contribution.person_id]} contribution={contribution} key={`segmentator-${s}`}/>);
            //}
            //return segmentators;
        //} else {
            //return null;
        //}
    //}

    contributors() {
        let contributors = [];
        if (this.props.interview && this.props.people_status === 'fetched') {
            for (var c in this.props.interview.contributions) {
                let contribution = this.props.interview.contributions[c];
                if (
                    contribution && 
                    (['interviewer', 'cinematographer', 'transcriptor', 'translator', 'segmentator'].indexOf(contribution.contribution_type) > -1 || 
                    this.props.editView)
                )
                    contributors.push(<PersonContainer person={this.props.people[contribution.person_id]} contribution={contribution} key={`contribution-${contribution.id}`} />);
            }
        } 
        return contributors;
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.info()}
                    {this.contributors()}
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

