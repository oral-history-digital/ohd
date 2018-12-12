import React from 'react';
import {Link} from 'react-router-dom';

import { PROJECT, MISSING_STILL } from '../constants/archiveConstants'
import FoundSegmentContainer from '../containers/FoundSegmentContainer';
import Slider from "react-slick";
import '../../../css/slick.css';
import '../../../css/slick-theme.css';

import { t } from '../../../lib/utils';

export default class InterviewPreview extends React.Component {

    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        let openState = false;
        this.state = {
            open: openState,
            class: openState ? "accordion active" : "accordion",
            panelClass: openState ? "panel open" : "panel"
        };
    }

    handleClick(event) {
        if (event !== undefined) event.preventDefault();
        if (this.state.open) {
            this.setState({
                ['open']: false,
                ['class']: "accordion",
                ['panelClass']: "panel"
            });
        } else {
            this.setState({
                ['open']: true,
                ['class']: "accordion active",
                ['panelClass']: "panel open"
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

    renderSlider(){
        if (this.props.segments.foundSegments != undefined && this.props.segments.foundSegments.length > 0){
            let settings = {
                infinite: false,
            };
            return (
                <div>
                    <div className={this.state.class + ' hits-count'} onClick={this.handleClick}>
                        <small>{t(this.props, 'segment_hits')}: {this.props.segments.foundSegments.length}</small>
                    </div>
                    <div className={this.state.panelClass + ' archive-search-found-segments'}>
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
                <div key={"segment-wrapper" + segment.id}>
                <FoundSegmentContainer
                    data={segment}
                    key={"segment-" + segment.id}
                    tape_count={this.props.interview.tape_count}
                />
                </div>
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
                    {/* <small className={(this.props.totalFoundSegments == 0)? 'hidden' : 'visible'}><br/>{t(this.props, 'segment_hits')}: {this.props.foundSegments.length}/{this.props.totalFoundSegments}</small> */}
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
                        <img src={this.props.interview.still_url || 'missing_still'} onError={(e)=>{e.target.src=MISSING_STILL}}/>
                    </div>
                    <p className={'search-result-name'}>{this.props.interview.short_title && this.props.interview.short_title[this.props.locale]}</p>

                    {this.interviewDetails()}
                </Link>
                {this.renderSlider()}
                <div onClick={() => {this.props.addRemoveArchiveId(this.props.interview.archive_id)}}>
                    <input type='checkbox' />
                </div>
            </div>
        );
    }
}

