import React from 'react';
import { t, admin, contentField } from '../../../lib/utils';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import SelectedRegistryReferencesContainer from '../containers/SelectedRegistryReferencesContainer';

export default class InterviewInfo extends React.Component {

    // placeOfInterview(){
    //     if (this.props.interview.place_of_interview){
    //         return contentField(t(this.props, 'place_of_interview'), this.props.interview.place_of_interview.name[this.props.locale], "", true );
    //     }
    // }

    tapes(){
        if (this.props.interview.tape_count > 1){
            return contentField(t(this.props, 'tapes'), this.props.interview.tape_count, "", true)
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
                    {contentField(t(this.props, 'date'), this.props.interview.interview_date, "", true)}
                    {/* {this.placeOfInterview()} */}
                    {contentField(t(this.props, 'search_facets.media_type'), this.props.interview.media_type && t(this.props, `search_facets.${this.props.interview.media_type}`), "", true)}
                    {contentField(t(this.props, 'duration'), (this.props.interview.duration[this.props.locale]||this.props.interview.duration), "", true)}
                    {this.tapes()}
                    {contentField(t(this.props, 'search_facets.accessibility'), this.props.interview.accessibility && this.props.interview.accessibility[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'language'), this.props.interview.language && this.props.interview.language[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'interview_location'), this.props.interview.interview_location && this.props.interview.interview_location[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'activerecord.models.collection.one'), this.props.interview.collection && this.props.interview.collection[this.props.locale], "", this.props.projectId !== 'mog', this.props.collections[this.props.interview.collection_id] )}

                    {/*contentField(t(this.props, 'observations'), this.props.interview.observations[this.props.locale], "", true)*/}
                </div>
            );
        }
    }

    render() {
        if (this.props.interview && this.props.interview.language) {
            return (
                <div>
                    {contentField(t(this.props, 'id'), this.props.archiveId, "", true)}
                    {this.info()}
                    <SelectedRegistryReferencesContainer refObject={this.props.interview} />
                </div>
            );
        } else {
            return null;
        }
    }
}

