import React from 'react';
//import SegmentFormContainer from '../containers/SegmentFormContainer';
//import SegmentHeadingFormContainer from '../containers/SegmentHeadingFormContainer';
import SegmentRegistryReferencesContainer from '../containers/SegmentRegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import SubmitOnFocusOutForm from '../containers/form/SubmitOnFocusOutForm';
import { t, fullname, admin } from "../../../lib/utils";

export default class SegmentEditView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.statuses[this.props.segment.id] !== this.props.statuses[this.props.segment.id]) {
            return true;
        }
        if (nextProps.active !== this.props.active) {
            return true;
        }

        return false;
    }

    css() {
        return 'segment ' + (this.props.active ? 'active' : 'inactive');
    }

    references(locale) {
        return <SegmentRegistryReferencesContainer 
                   segment={this.props.segment} 
                   interview={this.props.interview} 
                   locale={locale} 
                   setOpenReference={true}
               />
    }

    annotations(locale) {
        if (this.state.contentType == 'annotations') {
            return <AnnotationsContainer segment={this.props.segment} locale={locale} />
        }
    }

    //renderLinks(locale) {
        //if (
            //admin(this.props, {type: 'RegistryReference', action: 'update'}) || 
            //(Object.values(this.props.segment.annotations).length > 0 || this.props.segment.references_count > 0 || this.props.segment.user_annotation_ids.length)
        //) {
            //let icoCss = this.state.contentOpen ? 'content-trans-text-ico active' : 'content-trans-text-ico';
            //let annotionCss = admin(this.props, {type: 'Annotation', action: 'update'}) || Object.values(this.props.segment.annotations).length > 0 || this.props.segment.user_annotation_ids.length > 0 ? 'content-trans-text-ico-link' : 'hidden';
            //let referenceCss = admin(this.props, {type: 'RegistryReference', action: 'update'}) || this.props.segment.references_count > 0 ? 'content-trans-text-ico-link' : 'hidden';

            //return (
                //<div className={icoCss}>
                    //{this.edit(locale)}
                    //{this.editHeadings(locale)}
                    //<div className={annotionCss} title={t(this.props, 'annotations')}
                         //onClick={() => this.toggleAdditionalContent('annotations')}><i
                        //className="fa fa-sticky-note-o"></i>
                    //</div>
                    //<div className={referenceCss} title={t(this.props, (this.props.project === 'mog') ? 'keywords_mog' : 'keywords')}
                         //onClick={() => this.toggleAdditionalContent('references')}><i className="fa fa-tag"></i>
                    //</div>
                //</div>
            //)
        //}
    //}

    columnElement(columnName) {
        switch (columnName) {
            case 'text_orig': {
                return (
                    <SubmitOnFocusOutForm
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
                    <SubmitOnFocusOutForm
                        data={this.props.segment}
                        scope='segment'
                        translationLocale={this.props.translatedLocale}
                        attribute='text'
                        type='textarea'
                    />
                )
                break;
            }
            case 'heading_orig': {
                return (
                    <SubmitOnFocusOutForm
                        data={this.props.segment}
                        scope='segment'
                        translationLocale={this.props.originalLocale}
                        attribute='mainheading'
                        type='input'
                    />
                )
                break;
            }
            case 'heading_translated': {
                return (
                    <SubmitOnFocusOutForm
                        data={this.props.segment}
                        scope='segment'
                        translationLocale={this.props.translatedLocale}
                        attribute='mainheading'
                        type='input'
                    />
                )
                break;
            }
        }
    }

    row(){
        let _this = this;
        return this.props.columns.map(function(column, i){
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

