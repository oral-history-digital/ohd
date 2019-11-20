import React from 'react';
import RegistryReferencesContainer from '../containers/RegistryReferencesContainer';
import { t, admin, toUnderscoreCase } from '../../../lib/utils';

export default class SelectedRegistryReferences extends React.Component {

    registryReferencesByType() {
        let registryReferences = [];
        if (this.props.project && this.props.refObject) {
            for (let r in this.props.project.metadata_fields) {
                let metadataField = this.props.project.metadata_fields[r];
                if (
                    metadataField.registry_entry_id && 
                    metadataField.use_in_details_view &&
                    metadataField.ref_object_type === this.props.refObject.type 
                ) {
                    registryReferences.push(
                        <p>
                            <span className={'flyout-content-label'}>
                                {metadataField.label[this.props.locale] || 
                                    t(this.props, `activerecord.attributes.${toUnderscoreCase(this.props.refObject.type)}.${metadataField.name}`)}
                                :
                            </span>
                            <RegistryReferencesContainer 
                                refObject={this.props.refObject} 
                                parentEntryId={metadataField.registry_entry_id}
                                registryReferenceTypeId={metadataField.registry_reference_type_id}
                                locale={this.props.locale} 
                                key={`interview-registry-references-for-metadata-field-${r}`}
                            />
                        </p>
                    )
                }
            }
        }
        return registryReferences;
    }

    render() {
        if (this.props.interview) {
            return this.registryReferencesByType();
        } else {
            return null;
        }
    }
}

