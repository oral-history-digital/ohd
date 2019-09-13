import React from 'react';
import RegistryEntryMetadataFieldsContainer from '../containers/RegistryEntryMetadataFieldsContainer';
import MetadataRegistryReferenceTypeContainer from '../containers/MetadataRegistryReferenceTypeContainer';

export default class InterviewRegistryReferences extends React.Component {

    searchFacets() {
        let facets = [];
        for (var r in this.props.registryEntryMetadataFields) {
            if (this.props.account.email || this.props.registryEntryMetadataFields[r]['display_on_landing_page']) {
                facets.push(
                    <RegistryEntryMetadataFieldsContainer
                        key={`this.props.registry-entry-search-facets-${this.props.registryEntryMetadataFields[r]['id']}`} 
                        parentEntryId={this.props.registryEntryMetadataFields[r]['id']} 
                        interview={this.props.interview} 
                        label={this.props.registryEntryMetadataFields[r]['label']}
                        code={this.props.registryEntryMetadataFields[r]['code']}
                    />
                );
            }
        }
        for (var r in this.props.registryReferenceTypeMetadataFields) {
            if(this.props.refObjectType && this.props.registryReferenceTypeMetadataFields[r]['ref_object_type']) {
                if (this.props.registryReferenceTypeMetadataFields[r]['ref_object_type'].toLowerCase() === this.props.refObjectType.toLowerCase() && this.props.account.email || this.props.registryReferenceTypeMetadataFields[r]['display_on_landing_page']) {
                    facets.push(  
                        <MetadataRegistryReferenceTypeContainer
                        key={`this.props.registry-reference-type-search-facets-${r}`} 
                        referenceType={this.props.registryReferenceTypeMetadataFields[r]} 
                        interview={this.props.interview}
                        refObjectType={this.props.refObjectType}
                        />  
                    );
                }
            }
        }
        return facets;
    }

    //registryReferences() {
        //if (this.props.registryEntryMetadataFields || this.props.registryReferenceTypeMetadataFields) {
            //return (
                //<div>
                    //{this.searchFacets()}
                //</div>
            //);
        //} else {
            //return null;
        //}
    //}

    render() {
        if (this.props.interview && (this.props.registryEntryMetadataFields || this.props.registryReferenceTypeMetadataFields)) {
            return (
                <div>
                    {this.searchFacets()}
                </div>
            );
        } else {
            return null;
        }
    }
}

