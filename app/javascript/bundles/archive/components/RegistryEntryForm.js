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

    showRegistryName(registryName) {
        return <RegistryNameContainer registryName={registryName} />;
    }

    registryNames() {
        if (this.props.registryEntry) {
            return this.props.registryEntry.registry_names.map(registryName => {
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
                    key={`registry-entry-form-${this.props.registryEntry && this.props.registryEntry.id}`}
                    scope='registry_entry'
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.registryEntry && this.props.registryEntry.id,
                        parent_id: this.props.registryEntryParent && this.props.registryEntryParent.id,
                    }}
                    elements={[
                        {
                            attribute: 'latitude',
                            value: this.props.registryEntry && this.props.registryEntry.latitude,
                        },
                        {
                            attribute: 'longitude',
                            value: this.props.registryEntry && this.props.registryEntry.longitude,
                        },
                        {
                            elementType: 'select',
                            attribute: 'workflow_state',
                            values: ['preliminary', 'checked', 'rejected'],
                            value: (this.props.registryEntry && this.props.registryEntry.workflow_state) || 'preliminary',
                            withEmpty: true,
                            optionsScope: 'workflow_states',
                        }
                    ]}
                    subForm={RegistryNameFormContainer}
                    subFormProps={{registryEntryId: this.props.registryEntry && this.props.registryEntry.id}}
                    subFormScope='registry_name'
                    subScopeRepresentation={this.showRegistryName}
                />
            </div>
        );
    }
}
