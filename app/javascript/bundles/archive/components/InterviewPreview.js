import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import { PROJECT, MISSING_STILL } from '../constants/archiveConstants'
import ArchiveUtils from "../../../lib/utils";

import { t } from '../../../lib/utils';

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

    facetToClass(facetname) {
        // e.g. "forced-labor-groups" => "forced_labor_groups[]"
        let query = facetname.replace(/-/g, '_') + '[]';
        return (this.props.query[query] && this.props.query[query].length > 0) ? '' : 'hidden';
    }

    interviewDetails() {
        if (PROJECT === 'zwar') {

            return (
                <p className={'search-result-data'}>
                    <span>{this.props.interview.video_array[this.props.locale]}</span> <span>{this.props.interview.formatted_duration}</span><br/>
                    <span>{this.props.interview.languages_array[this.props.locale]}</span>
                    <small className={this.facetToClass("forced-labor-groups")}><br/>{this.props.interview.forced_labor_groups[this.props.locale].join(', ')}</small>
                    <small className={this.facetToClass("decade-of-birth")}><br/>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth}</small>
                    <small className={this.facetToClass("forced-labor-fields")}><br/>{this.props.interview.forced_labor_fields[this.props.locale].join(', ')}</small>
                </p>
            );
        }
        else if (PROJECT === 'mog') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
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
                {label}:&nbsp;
                <span>{value}</span>
            </div>
        )
    }



    typologies(){
        let interviewee =  this.props.interview.interviewees[0];
        if (interviewee && interviewee.typology && interviewee.typology[this.props.locale]) {
            //if (interviewee.typology[this.props.locale] && interviewee.typology[this.props.locale].length > 1) {
                return this.content(ArchiveUtils.translate(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '), "");
            //} else if (interviewee.typology && interviewee.typology[this.props.locale].length == 1) {
                //return this.content(ArchiveUtils.translate(this.props, 'typology'), interviewee.typology[this.props.locale][0], "");
            //}
        }
    }





    render() {
        return (
            <div className='interview-preview search-result'>
                <Link className={'search-result-link'}
                    onClick={() => {
                        this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                        this.props.setTapeAndTime(1, 0);
                    }}
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

