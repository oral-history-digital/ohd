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

    collection(){
        if(this.props.collections){
            let collection_id = this.props.interview.collection_id;
            let collection_name = this.props.collections.filter(collection => collection.value === collection_id)[0].name[this.props.locale];
            return this.content(t(this.props, 'activerecord.models.collection.one'), collection_name, "")
        }
    }

    tapes(){
        if (this.props.interview.tape_count > 1){
            return this.content(t(this.props, 'tapes'), this.props.interview.tape_count, "")
        }
    }

    info() {
        if (admin(this.props, {type: 'Interview', action: 'update'})) {
            return ( 
                <InterviewFormContainer 
                    submitText='edit.interview.edit' 
                    interview={this.props.interview}
                />
            );
        } else {
            return (
                <div>
                    {this.content(t(this.props, 'date'), this.props.interview.interview_date, "")}
                    {this.placeOfInterview()}
                    {this.content(t(this.props, 'duration'), this.props.interview.formatted_duration, "")}
                    {this.tapes()}
                    {this.language()}
                    {this.collection()}
                    {/*this.content(t(this.props, 'observations'), this.props.interview.observations[this.props.locale], "")*/}
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

