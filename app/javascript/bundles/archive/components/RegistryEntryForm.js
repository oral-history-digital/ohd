import React from 'react';
import Form from '../containers/form/Form';
import RegistryNameFormContainer from '../containers/RegistryNameFormContainer';
import RegistryNameContainer from '../containers/RegistryNameContainer';
import { t } from 'lib/utils';

export default class RegistryEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.showRegistryName = this.showRegistryName.bind(this);
    }

    // get registry_entry via it`s id from state.
    // like this it will always be the newest version.
    //
    registryEntry() {
        return this.props.registryEntries[this.props.registryEntryId];
    }

    showRegistryName(registryName) {
        let translation = registryName.translations_attributes.find(t => t.locale === this.props.locale);
        return (
            <span>{translation.descriptor}</span>
        )
    }

    registryNames() {
        if (this.registryEntry()) {
            return (
                <div>
                    <h4 className="u-mb-none">
                        {t(this.props, 'registry_names.title')}
                    </h4>
                    {
                        this.registryEntry().registry_names.map(registryName => (
                            <RegistryNameContainer
                                registryName={registryName}
                                registryEntryId={this.props.registryEntryId}
                                formClasses={'nested-form default'}
                                key={registryName.id}
                            />
                        ))
                    }
                </div>
            );
        }
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

    nestedFormProps() {
        let props = {registryEntryId: this.props.registryEntryId};
        if (this.props.registryEntryId)
            props.submitData = this.props.submitData;
        return props;
    }

    render() {
        return (
            <div>
                {this.parentRegistryEntry()}
                {this.registryNames()}
                <Form
                    key={`registry-entry-form-${this.props.registryEntryId}`}
                    scope='registry_entry'
                    onSubmit={params => {
                        this.props.submitData(this.props, params);
                        this.props.closeArchivePopup();
                    }}
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
                            elementType: 'select',
                            attribute: 'workflow_state',
                            values: ['preliminary', 'checked', 'rejected'],
                            value: (this.registryEntry() && this.registryEntry().workflow_state) || 'preliminary',
                            withEmpty: true,
                            optionsScope: 'workflow_states',
                        }
                    ]}
                    nestedForm={RegistryNameFormContainer}
                    nestedFormProps={this.nestedFormProps()}
                    nestedFormScope='registry_name'
                    nestedScopeRepresentation={this.showRegistryName}
                />
            </div>
        );
    }
}
