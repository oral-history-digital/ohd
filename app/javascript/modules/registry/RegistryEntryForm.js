import { Component } from 'react';
import PropTypes from 'prop-types';

import { Form } from 'modules/forms';
import { t } from 'modules/i18n';
import RegistryNameContainer from './RegistryNameContainer';
import RegistryNameFormContainer from './RegistryNameFormContainer';

export default class RegistryEntryForm extends Component {

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
                        this.props?.onSubmit();
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
                            values: ['preliminary', 'public', 'rejected'],
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
    closeArchivePopup: PropTypes.func.isRequired,
};
