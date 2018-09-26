import React from 'react';
import { t, admin } from '../../../lib/utils';
import InterviewFormContainer from '../containers/InterviewFormContainer';

export default class InterviewInfo extends React.Component {

    placeOfInterview(){
        if (this.props.interview.place_of_interview){
            return this.content(t(this.props, 'place_of_interview'), this.props.interview.place_of_interview.name[this.props.locale], "" );
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
                    {this.content(t(this.props, 'date'), this.props.interview.interview_date, "figure-letter-spacing")}
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

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.content(t(this.props, 'id'), this.props.archiveId, "")}
                    {this.info()}
                </div>
            );
        } else {
            return null;
        }
    }
}

