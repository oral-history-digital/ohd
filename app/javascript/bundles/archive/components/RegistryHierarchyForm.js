import React from 'react';
import { Form } from 'modules/forms';
import { t } from '../../../lib/utils';

export default class RegistryHierarchyForm extends React.Component {

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
                    onSubmit={function(params){_this.props.submitData(_this.props, params); _this.props.closeArchivePopup()}}
                    data={this.props.registryHierarchy}
                    values={{
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
