import React from 'react';
//import SegmentFormContainer from '../containers/SegmentFormContainer';
//import SegmentHeadingFormContainer from '../containers/SegmentHeadingFormContainer';
import SegmentRegistryReferencesContainer from '../containers/SegmentRegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import SubmitOnBlurForm from '../containers/form/SubmitOnBlurForm';
import { t, fullname, admin } from "../../../lib/utils";

export default class SegmentEditView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    //shouldComponentUpdate(nextProps, nextState) {
        //if (nextProps.statuses[this.props.segment.id] !== this.props.statuses[this.props.segment.id]) {
            //return true;
        //}
        //if (nextProps.active !== this.props.active) {
            //return true;
        //}

        //return false;
    //}

    //css() {
        //return 'segment ' + (this.props.active ? 'active' : 'inactive');
    //}

    columnElement(columnName) {
        switch (columnName) {
            case 'text_orig': {
                return (
                    <SubmitOnBlurForm
                        data={this.props.segment}
                        scope='segment'
                        translationLocale={this.props.originalLocale}
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
                        translationLocale={this.props.translatedLocale}
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
                        translationLocale={this.props.originalLocale}
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
                        translationLocale={this.props.translatedLocale}
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
                        translationLocale={this.props.originalLocale}
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
                        translationLocale={this.props.translatedLocale}
                        attribute='subheading'
                        type='input'
                    />
                )
                break;
            }
            case 'registry_references': {
                return (
                    <SegmentRegistryReferencesContainer 
                        segment={this.props.segment} 
                        interview={this.props.interview} 
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

