import React from 'react';
import { t, admin, contentField } from '../../../lib/utils';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import MetadataRegistryReferenceTypeContainer from '../containers/MetadataRegistryReferenceTypeContainer';

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
                    {contentField(t(this.props, 'search_facets.media_type'), t(this.props, `search_facets.${this.props.interview.video ? 'video' : 'audio'}`), "", true)}
                    {contentField(t(this.props, 'duration'), this.props.interview.duration, "", true)}
                    {this.tapes()}
                    {contentField(t(this.props, 'search_facets.camps'), this.props.interview.camps && this.props.interview.camps[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'search_facets.accessibility'), this.props.interview.accessibility && this.props.interview.accessibility[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'search_facets.groups'), this.props.interview.groups && this.props.interview.groups[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'language'), this.props.interview.language && this.props.interview.language[this.props.locale], "", this.props.projectId !== 'mog')}
                    {contentField(t(this.props, 'activerecord.models.collection.one'), this.props.interview.collection_id && this.props.interview.collection_id[this.props.locale], "", this.props.projectId !== 'mog', )}

                    {/*contentField(t(this.props, 'observations'), this.props.interview.observations[this.props.locale], "", true)*/}
                </div>
            );
        }
    }

    metadataFields() {
        let metadataFields = [];
        for (var r in this.props.registryReferenceTypeMetadataFields) {
            if (this.props.registryReferenceTypeMetadataFields[r]["ref_object_type"] == this.props.refObjectType && (this.props.account.email || this.props.registryReferenceTypeMetadataFields[r]['display_on_landing_page'])) {
                metadataFields.push(  
                    <MetadataRegistryReferenceTypeContainer
                    key={`this.props.registry-reference-type-search-facets-${r}`} 
                    referenceType={this.props.registryReferenceTypeMetadataFields[r]} 
                    interview={this.props.interview}
                    refObjectType={this.props.refObjectType}
                    />  
                );
            }
        }
        return metadataFields;
    }

    render() {
        if (this.props.interview && this.props.interview.language) {
            return (
                <div>
                    {contentField(t(this.props, 'id'), this.props.archiveId, "", true)}
                    {this.info()}
                    {this.metadataFields()}
                </div>
            );
        } else {
            return null;
        }
    }
}

