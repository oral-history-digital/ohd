import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import { PROJECT, MISSING_STILL } from '../constants/archiveConstants'
import ArchiveUtils from "../../../lib/utils";


export default class InterviewPreview extends React.Component {

    renderInterviewSegments() {
        if (this.props.foundSegmentsForInterview.length > 0) {
            return (
                <Link
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                >
                    <p>{this.props.foundSegmentsForInterview.length}</p>
                </Link>
            )
        }
    }

    interviewDetails() {
        if (PROJECT === 'zwar') {

            return (
                <p className={'search-result-data'}>
                    <small>{this.props.interview.forced_labor_groups}</small><br/>
                    <span>{this.props.interview.video}</span> <span>{this.props.interview.formatted_duration}</span><br/>
                    <span>{this.props.interview.languages_string}</span>
                </p>
            );
        }
        else if (PROJECT === 'mog') {
            return (
                <div className={'search-result-data'}>
                    {this.typologies()}
                    {this.content( ArchiveUtils.translate(this.props, 'duration'), this.props.interview.formatted_duration)}
                </div>
            )
        }
        return null;
    }




    content(label, value) {
        return (
            <div>
                {label}:
                <span>{value}</span>
            </div>
        )
    }



    typologies(){
        let interviewee =  this.props.interview.interviewees[0];
        debugger;
        if (interviewee) {
            if (interviewee.typology && interviewee.typology[this.props.locale].length > 1) {
                return this.content(ArchiveUtils.translate(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '), "");
            } else if (interviewee.typology && interviewee.typology[this.props.locale].length == 1) {
                return this.content(ArchiveUtils.translate(this.props, 'typology'), interviewee.typology[this.props.locale][0], "");
            }
        }
    }





    render() {
        return (
            <div className='interview-preview search-result'>
                <Link className={'search-result-link'}
                    onClick={() => {this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id})}}
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                >
                    <div className="search-result-img">
                        <img src={this.props.interview.still_url} onError={(e)=>{e.target.src=MISSING_STILL}}/>
                    </div>
                    <p className={'search-result-name'}>{this.props.interview.short_title[this.props.locale]}</p>

                    {this.interviewDetails()}

                </Link>
            </div>
        );
    }
}

