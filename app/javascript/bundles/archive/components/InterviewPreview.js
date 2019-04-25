import React from 'react';
import {Link} from 'react-router-dom';

import { PROJECT, MISSING_STILL } from '../constants/archiveConstants'
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import Slider from "react-slick";
import '../../../css/slick.css';
import '../../../css/slick-theme.css';
import AuthShowContainer from '../containers/AuthShowContainer';

import { t, admin } from '../../../lib/utils';

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
            this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
        }
    }

    facetToClass(facetname) {
        // e.g. "forced-labor-groups" => "forced_labor_groups[]"
        let query = facetname.replace(/-/g, '_') + '[]';
        return (this.props.query[query] && this.props.query[query].length > 0) ? '' : 'hidden';
    }

    renderBadge() {
        if (this.props.segments.foundSegments != undefined && this.props.segments.foundSegments.length > 0){
            return (
                <div className={'badge'}  onClick={this.handleClick} title={`${t(this.props, 'segment_hits')}: ${this.props.segments.foundSegments.length}`}>
                <i className="fa fa-align-justify" aria-hidden="true" />
                &nbsp;
                {this.props.segments.foundSegments.length}
                </div>
            )
        }
    }

    renderSlider(){
        if (this.props.segments.foundSegments != undefined && this.props.segments.foundSegments.length > 0){
            let settings = {
                infinite: false,
            };
            return (
                <div className='slider'>
                    <div className={'archive-search-found-segments'}>
                        <Slider {...settings}>
                        { this.renderSegments() }
                        </Slider>
                    </div>
                </div>
            )
        }
    }

    renderSegments() {
        return this.props.segments.foundSegments.map( (segment, index) => {
            return (
                <Link 
                    key={"segment-wrapper" + segment.id}
                    onClick={() => {
                        this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                        this.props.setTapeAndTime(1, 0);
                    }}
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
                >
                    <FoundSegmentContainer
                        index={index+1}
                        foundSegmentsAmount={this.props.segments.foundSegments.length}
                        data={segment}
                        key={"segment-" + segment.id}
                        tape_count={this.props.interview.tape_count}
                    />
                </Link>
            )
        })
    }

    interviewDetails() {
        if (this.props.project === 'zwar') {
            return (
                <div className={'search-result-data'}>
                    <span>{this.props.interview.video_array[this.props.locale]}</span> <span>{this.props.interview.formatted_duration}</span><br/>
                    <span>{this.props.interview.languages_array[this.props.locale]}</span>
                    <small className={this.facetToClass("forced-labor-groups")}><br/>{this.props.interview.forced_labor_groups[this.props.locale].join(', ')}</small>
                    <small className={this.facetToClass("year-of-birth")}><br/>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth}</small>
                    <small className={this.facetToClass("forced-labor-fields")}><br/>{this.props.interview.forced_labor_fields[this.props.locale].join(', ')}</small>
                </div>
            );
        }
        else if (this.props.project === 'mog') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    {this.typologies()}
                    {this.content( t(this.props, 'duration'), this.props.interview.formatted_duration)}
                    <small className={this.facetToClass("year-of-birth")}>{t(this.props, 'year_of_birth')} {this.props.interview.year_of_birth}</small>
                </div>
            )
        }
        else if (this.props.project === 'hagen') {
            return (
                <div className={'search-result-data'} lang={this.props.locale}>
                    <span>{this.props.interview.video_array[this.props.locale]}</span> <span>{this.props.interview.formatted_duration}</span><br/>
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
        let interviewee =  this.props.interview.interviewees && this.props.interview.interviewees[0];
        if (interviewee && interviewee.typology && interviewee.typology[this.props.locale]) {
            //if (interviewee.typology[this.props.locale] && interviewee.typology[this.props.locale].length > 1) {
                return this.content(t(this.props, 'typologies'), interviewee.typology[this.props.locale].join(', '), "");
            //} else if (interviewee.typology && interviewee.typology[this.props.locale].length == 1) {
                //return this.content(t(this.props, 'typology'), interviewee.typology[this.props.locale][0], "");
            //}
        }
    }

    renderExportCheckbox() {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return <div onClick={() => {this.props.addRemoveArchiveId(this.props.interview.archive_id)}}>
                <input type='checkbox' />
            </div>
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className={this.state.divClass}>
                {this.renderBadge()}
                <Link className={'search-result-link'}
                    onClick={() => {
                        this.props.searchInInterview({fulltext: this.props.fulltext, id: this.props.interview.archive_id});
                        this.props.setTapeAndTime(1, 0);
                    }}
                    to={'/' + this.props.locale + '/interviews/' + this.props.interview.archive_id}
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
    }
}

