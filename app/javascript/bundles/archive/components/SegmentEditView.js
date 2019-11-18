import React from 'react';
import RegistryReferencesContainer from '../containers/RegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import SubmitOnBlurForm from '../containers/form/SubmitOnBlurForm';
import { t, fullname, admin } from "../../../lib/utils";

export default class SegmentEditView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    columnElement(columnName) {
        switch (columnName) {
            case 'text_orig': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.originalLocale}
                        attribute='text'
                        type='textarea'
                    />
                )
                break;
            }
            case 'text_translated': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.translationLocale}
                        attribute='text'
                        type='textarea'
                    />
                )
                break;
            }
            case 'mainheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.originalLocale}
                        attribute='mainheading'
                        type='input'
                    />
                )
                break;
            }
            case 'mainheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.translationLocale}
                        attribute='mainheading'
                        type='input'
                    />
                )
                break;
            }
            case 'subheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.originalLocale}
                        attribute='subheading'
                        type='input'
                    />
                )
                break;
            }
            case 'subheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        locale={this.props.translationLocale}
                        attribute='subheading'
                        type='input'
                    />
                )
                break;
            }
            case 'registry_references': {
                return (
                    <RegistryReferencesContainer 
                        refObject={this.props.segment} 
                        parentEntryId={1}
                        locale={this.props.locale} 
                    />
                )
                break;
            }
            case 'annotations': {
                return (
                    <AnnotationsContainer segment={this.props.segment} locale={this.props.locale} />
                )
                break;
            }
        }
    }

    row(){
        let _this = this;
        return this.props.selectedInterviewEditViewColumns.map(function(column, i){
            return (
                <td key={`${_this.props.segment.id}-column-${i}`}>
                    {_this.columnElement(column)}
                </td>
            )
        })
    }

    render() {
        return <tr key={`${this.props.segment.id}-row`}>
            {this.row()}
        </tr>
    }
}

