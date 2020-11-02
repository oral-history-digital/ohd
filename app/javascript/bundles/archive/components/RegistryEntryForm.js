import React from 'react';
import Form from '../containers/form/Form';
import RegistryNameFormContainer from '../containers/RegistryNameFormContainer';
import RegistryNameContainer from '../containers/RegistryNameContainer';
import { t } from '../../../lib/utils';

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
        return <RegistryNameContainer registryName={registryName} />;
    }

    registryNames() {
        if (this.registryEntry()) {
            return this.registryEntry().registry_names.map(registryName => {
                return <RegistryNameContainer registryName={registryName} />;
            })
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

    render() {
        let _this = this;
        return (
            <div>
                {this.parentRegistryEntry()}
                {this.registryNames()}
                <Form 
                    key={`registry-entry-form-${this.props.registryEntryId}`}
                    scope='registry_entry'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    data={this.registryEntry()}
                    values={{
                        parent_id: this.props.registryEntryParent && this.props.registryEntryParent.id,
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
                    subForm={RegistryNameFormContainer}
                    subFormProps={{registryEntryId: this.props.registryEntryId}}
                    subFormScope='registry_name'
                    subScopeRepresentation={this.showRegistryName}
                />
            </div>
        );
    }
}
