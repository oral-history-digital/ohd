import React from 'react';
import Form from '../containers/form/Form';
import { t } from '../../../lib/utils';

export default class RegistryEntryForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lang: this.selectLanguageBy('locale', this.props.locale)
        };
        this.handleLanguageChange = this.handleLanguageChange.bind(this);
    }

    handleLanguageChange(name, value) {
        let lang = this.selectLanguageBy('value', value);
        this.setState({lang: this.selectLanguageBy('value', value)})
    }

    selectLanguageBy(attribute, value) {
        if (this.props.languages) {
            for (var l in this.props.languages) {
                if (this.props.languages[l][attribute] === value) {
                    return this.props.languages[l];
                    break;
                }
            }
        } else {
            // fallback to german
            return {value: 1, locale: 'de', name: 'Deutsch'};
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

    //formElements() {
        //let elements = [];
        //for (var i in this.props.locales) {
            //elements.push({ 
                //elementType: 'input',
                //attribute: `[descriptors]$this.props.locales[i]`,
                //label: `${t(this.props, 'edit.registry_entries.descriptor_for_locale')} ${this.props.locales[i]}`,
                ////attribute: '[registry_names_attributes][]descriptor',
                //value: this.props.registryEntry && this.props.registryEntry.name[this.props.locales[i]],
                //type: 'text',
                ////validate: function(v){return v.length > 1} 
            //});
        //}
        //elements.push({ 
        //});
        //return elements;
    //}
        
    render() {
        let _this = this;
        return (
            <div>
                {this.parentRegistryEntry()}
                <Form 
                    key={`registry-entry-form-${this.props.registryEntry && this.props.registryEntry.id}-${this.state.lang.locale}`}
                    scope='registry_entry'
                    onSubmit={function(params, locale){_this.props.submitData(params, locale); _this.props.closeArchivePopup()}}
                    values={{
                        id: this.props.registryEntry && this.props.registryEntry.id,
                        workflow_state: this.props.registryEntry && this.props.registryEntry.workflow_state || 'preliminary',
                        parent_id: this.props.registryEntryParent && this.props.registryEntryParent.id,
                        name_position: '0',
                        registry_name_type_id: 4,
                        //workflow_state: this.props.registryEntry && this.props.registryEntry.workflow_state || 'preliminary',
                        //'[parents][]id': this.props.registryEntryParent && this.props.registryEntryParent.id,
                        //'[registry_names_attributes][]name_position': '0',
                        //'[registry_names_attributes][]registry_name_type_id': 4,
                    }}
                    elements={[
                        //{
                            //elementType: 'select',
                            //attribute: 'parent',
                            //values: this.props.parents,
                            //value: this.props.parent && this.props.parent.id,
                            //withEmpty: true,
                            //validate: function(v){return v !== ''} 
                        //},
                        {
                            elementType: 'select',
                            attribute: 'lang',
                            values: this.props.languages,
                            value: this.state.lang.value,
                            withEmpty: true,
                            handlechangecallback: this.handleLanguageChange,
                            validate: function(v){return v !== ''} 
                        },
                        {
                            elementType: 'input',
                            attribute: 'descriptor',
                            value: this.props.registryEntry && this.props.registryEntry.name[this.state.lang.locale],
                            type: 'text',
                            validate: function(v){return v.length > 1} 
                        },
                        {
                            elementType: 'textarea',
                            attribute: 'notes',
                            value: this.props.registryEntry && this.props.registryEntry.notes[this.state.lang.locale],
                        },
                        {
                            attribute: 'latitude',
                            value: this.props.registryEntry && this.props.registryEntry.latitude,
                        },
                        {
                            attribute: 'longitude',
                            value: this.props.registryEntry && this.props.registryEntry.longitude,
                        },
                    ]}
                />
            </div>
        );
    }
}
