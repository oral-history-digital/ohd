import { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { t } from 'modules/i18n';
import RegistryNameFormContainer from './RegistryNameFormContainer';
import NormDatumFormContainer from './NormDatumFormContainer';

export default class RegistryEntryForm extends Component {

    constructor(props) {
        super(props);
        this.showRegistryName = this.showRegistryName.bind(this);
        this.showNormDatum = this.showNormDatum.bind(this);
    }

    // get registry_entry via it`s id from state.
    // like this it will always be the newest version.
    //
    registryEntry() {
        return this.props.registryEntries[this.props.registryEntryId];
    }

    showRegistryName(registryName) {
        if (!registryName)
            return null;
        let translation = registryName.translations_attributes.find(t => t.locale === this.props.locale);
        return (
            <span>{translation.descriptor}</span>
        )
    }

    showNormDatum(normDatum) {
        const { normDataProviders } = this.props;
        return (
            <span>{`${normDataProviders[normDatum.norm_data_provider_id].name} - ${normDatum.nid} `}</span>
        )
    }

    parentRegistryEntry() {
        if (this.props.registryEntryParent){
            return (
                <div>
                    <span><b>{t(this.props, 'edit.registry_entry.parent') + ': '}</b></span>
                    <span>{this.props.registryEntryParent.name[this.props.locale]}</span>
                </div>
            )
        }
    }

    render() {
        const { submitData, onSubmit, onCancel } = this.props;

        return (
            <div>
                {this.parentRegistryEntry()}
                <Form
                    key={this.props.registryEntryId}
                    scope='registry_entry'
                    onSubmit={params => {
                        submitData(this.props, params);
                        if (typeof onSubmit === 'function') {
                            onSubmit();
                        }
                    }}
                    onCancel={onCancel}
                    data={this.registryEntry()}
                    values={{
                        parent_id: this.props.registryEntryParent && this.props.registryEntryParent.id,
                        workflow_state: this.registryEntry() && this.registryEntry().workflow_state || 'preliminary',
                    }}
                    elements={[
                        {
                            attribute: 'latitude',
                        },
                        {
                            attribute: 'longitude',
                        },
                        {
                            attribute: 'code',
                        },
                        {
                            elementType: 'select',
                            attribute: 'workflow_state',
                            values: ['preliminary', 'public', 'rejected'],
                            value: (this.registryEntry() && this.registryEntry().workflow_state) || 'preliminary',
                            withEmpty: true,
                            optionsScope: 'workflow_states',
                        }
                    ]}

                    nestedScopeProps={[
                        {
                            formComponent: RegistryNameFormContainer,
                            formProps: {registryEntryId: this.props.registryEntryId},
                            parent: this.registryEntry(),
                            scope: 'registry_name',
                            elementRepresentation: this.showRegistryName,
                        },
                        {
                            formComponent: NormDatumFormContainer,
                            formProps: {registryEntryId: this.props.registryEntryId},
                            parent: this.registryEntry(),
                            scope: 'norm_datum',
                            elementRepresentation: this.showNormDatum,
                        }
                    ]}
                />
            </div>
        );
    }
}

RegistryEntryForm.propTypes = {
    registryEntryId: PropTypes.number,
    registryEntryParent: PropTypes.object,
    registryEntries: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    onSubmit: PropTypes.func,
    submitData: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
};
