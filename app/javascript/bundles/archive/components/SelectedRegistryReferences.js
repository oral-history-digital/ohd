import React from 'react';
import RegistryReferencesContainer from '../containers/RegistryReferencesContainer';
import { t, underscore } from 'lib/utils';

export default class SelectedRegistryReferences extends React.Component {

    registryReferencesByType() {
        let registryReferences = [];
        if (this.props.project && this.props.refObject) {
            for (let r in this.props.project.metadata_fields) {
                let metadataField = this.props.project.metadata_fields[r];
                if (
                    metadataField.registry_entry_id &&
                    ((metadataField.use_in_details_view && this.props.account.isLoggedIn) || metadataField.display_on_landing_page) &&
                    metadataField.ref_object_type === this.props.refObject.type
                ) {
                    registryReferences.push(
                        <div key={r} className="RegistryReferences u-mb-small">
                            <span className="RegistryReferences-label flyout-content-label">
                                {metadataField.label[this.props.locale] ||
                                    t(this.props, `activerecord.attributes.${underscore(this.props.refObject.type)}.${metadataField.name}`)}
                                :
                            </span>
                            <RegistryReferencesContainer
                                refObject={this.props.refObject}
                                lowestAllowedRegistryEntryId={(metadataField.registry_reference_type && metadataField.registry_reference_type.registry_entry_id) || 1}
                                registryReferenceTypeId={metadataField.registry_reference_type_id}
                                locale={this.props.locale}
                            />
                        </div>
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
