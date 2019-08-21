import React from 'react';
import RegistryEntrySearchFacetsContainer from '../containers/RegistryEntrySearchFacetsContainer';
import MetadataRegistryReferenceTypeContainer from '../containers/MetadataRegistryReferenceTypeContainer';

export default class InterviewRegistryReferences extends React.Component {

    searchFacets() {
        let facets = [];
        for (var r in this.props.registryEntrySearchFacets) {
            if (this.props.account.email || this.props.registryEntrySearchFacets[r]['display_on_landing_page']) {
                facets.push(
                    <RegistryEntrySearchFacetsContainer 
                        key={`this.props.registry-entry-search-facets-${this.props.registryEntrySearchFacets[r]['id']}`} 
                        parentEntryId={this.props.registryEntrySearchFacets[r]['id']} 
                        interview={this.props.interview} 
                        label={this.props.registryEntrySearchFacets[r]['label']}
                        />
                );
            }
        }
        for (var r in this.props.registryReferenceTypeMetadataFields) {
            if (this.props.registryReferenceTypeMetadataFields[r]['ref_object_type'] === this.props.refObjectType && this.props.account.email || this.props.registryReferenceTypeMetadataFields[r]['display_on_landing_page']) {
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
        return facets;
    }

    //registryReferences() {
        //if (this.props.registryEntrySearchFacets || this.props.registryReferenceTypeMetadataFields) {
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
        if (this.props.interview && (this.props.registryEntrySearchFacets || this.props.registryReferenceTypeMetadataFields)) {
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

