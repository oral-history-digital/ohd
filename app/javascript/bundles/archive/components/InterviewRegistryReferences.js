import React from 'react';
import RegistryEntrySearchFacetsContainer from '../containers/RegistryEntrySearchFacetsContainer';
import RegistryReferenceTypeSearchFacetsContainer from '../containers/RegistryReferenceTypeSearchFacetsContainer';

export default class InterviewRegistryReferences extends React.Component {

    searchFacets() {
        let facets = [];
        for (var r in this.props.registryEntrySearchFacetIds) {
            facets.push(
                <RegistryEntrySearchFacetsContainer 
                    key={`this.props.registry-entry-search-facets-${r}`} 
                    parentEntryId={this.props.registryEntrySearchFacetIds[r]} 
                    interview={this.props.interview} 
                />
            );
        }
        for (var r in this.props.registryReferenceTypeSearchFacets) {
            facets.push(
                <RegistryReferenceTypeSearchFacetsContainer
                    key={`this.props.registry-reference-type-search-facets-${r}`} 
                    referenceType={this.props.registryReferenceTypeSearchFacets[r]} 
                    interview={this.props.interview}
                />
            );
        }
        return facets;
    }

    registryReferences() {
        if (this.props.registryEntrySearchFacetIds || this.props.registryReferenceTypeSearchFacets) {
            return (
                <div>
                    {this.searchFacets()}
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        if (this.props.interview) {
            return (
                <div>
                    {this.registryReferences()}
                </div>
            );
        } else {
            return null;
        }
    }
}

