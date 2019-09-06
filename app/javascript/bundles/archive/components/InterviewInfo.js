import React from 'react';
import { t, admin } from '../../../lib/utils';
import InterviewFormContainer from '../containers/InterviewFormContainer';
import MetadataRegistryReferenceTypeContainer from '../containers/MetadataRegistryReferenceTypeContainer';

export default class InterviewInfo extends React.Component {

    // placeOfInterview(){
    //     if (this.props.interview.place_of_interview){
    //         return this.content(t(this.props, 'place_of_interview'), this.props.interview.place_of_interview.name[this.props.locale], "" );
    //     }
    // }

    language(){
        return this.content(t(this.props, 'language'), this.props.interview.language[this.props.locale], "");
    }

    collection(){
        let c = this.props.collections && this.props.collections[this.props.interview.collection_id]
        if(c){
            return this.content(t(this.props, 'activerecord.models.collection.one'), c.name[this.props.locale], "")
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
                    {/* {this.placeOfInterview()} */}
                    {this.content(t(this.props, 'search_facets.media_type'), t(this.props, `search_facets.${this.props.interview.video ? 'video' : 'audio'}`), "")}
                    {this.content(t(this.props, 'duration'), this.props.interview.duration, "")}
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
                    {this.content(t(this.props, 'id'), this.props.archiveId, "")}
                    {this.info()}
                    {this.metadataFields()}
                </div>
            );
        } else {
            return null;
        }
    }
}

