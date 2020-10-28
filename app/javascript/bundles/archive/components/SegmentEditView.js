import React from 'react';
import VizSensor from 'react-visibility-sensor';
import RegistryReferencesContainer from '../containers/RegistryReferencesContainer';
import AnnotationsContainer from '../containers/AnnotationsContainer';
import SubmitOnBlurForm from '../containers/form/SubmitOnBlurForm';
import { t, fullname } from "../../../lib/utils";
import moment from 'moment';

export default class SegmentEditView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {visible:  false};
    }

    segmentTime() {
        return moment.utc(this.props.segment.time * 1000).format("HH:mm:ss");
    }

    columnElement(columnName) {
        switch (columnName) {
            case 'timecode': {
              return (
                  <div id={`segment_${this.props.segment.id}`} className={this.css()} onClick={() => this.props.setTapeAndTime(this.props.segment.tape_nbr, this.props.segment.time)}>
                      {`${this.props.segment.tape_nbr} - ${this.segmentTime()}`}
                  </div>
              )
              break;
            }
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
                    {_this.state.visible && _this.columnElement(column)}
                </td>
            )
        })
    }

    css() {
        return 'segment ' + (this.props.active ? 'active' : 'inactive');
    }

    render() {
        return (
            <VizSensor
                partialVisibility={true}
                onChange={(isVisible) => {
                    this.setState({visible: isVisible})
                }}
            >
                <tr className='segment-row' key={`${this.props.segment.id}-row`}>
                    {this.row()}
                </tr>
            </VizSensor>
        )
    }
}
