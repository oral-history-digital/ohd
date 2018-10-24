import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryEntryForm extends React.Component {

    constructor(props) {
        super(props);
    }

    descendantRegistryEntry() {
        if (this.props.descendantRegistryEntry){
            return (
                <div>
                    <span><b>{t(this.props, 'edit.registry_entry.add_parent') + ': '}</b></span>
                    <span>{this.props.descendantRegistryEntry.name[this.props.locale]}</span>
                </div>
            )
        }
    }

    render() {
        let _this = this;
        return (
            <div>
                {this.descendantRegistryEntry()}
                <Form 
                    key={`registry-hierarchy-form-${this.props.descendantRegistryEntry && this.props.descendantRegistryEntry.id}`}
                    scope='registry_hierarchy'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.registryHierarchy && this.props.registryHierarchy.id,
                        descendant_id: this.props.descendantRegistryEntry && this.props.descendantRegistryEntry.id,
                    }}
                    elements={[
                        {
                            attribute: 'ancestor_id',
                        },
                    ]}
                />
            </div>
        );
    }
}
