import { Component } from 'react';
import PropTypes from 'prop-types';
import VizSensor from 'react-visibility-sensor/visibility-sensor';
import moment from 'moment';

import { RegistryReferencesContainer } from 'modules/registry-references';
import { Annotations } from 'modules/annotations';
import { SubmitOnBlurForm } from 'modules/forms';
import permittedColumns from './permittedColumns';

export default class SegmentEditView extends Component {
    constructor(props) {
        super(props);
        this.state = {visible: false};
    }

    segmentTime() {
        return moment.utc(this.props.segment.time * 1000).format("HH:mm:ss");
    }

    columnElement(columnName) {
        switch (columnName) {
            case 'timecode': {
              return (
                    <div
                        id={`segment_${this.props.segment.id}`}
                        className={this.css()}
                        onClick={() => this.props.sendTimeChangeRequest(this.props.segment.tape_nbr, this.props.segment.time)}
                    >
                        {`${this.props.segment.tape_nbr} - ${this.segmentTime()}`}
                    </div>
              );
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
                );
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
                );
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
                );
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
                );
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
                );
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
                );
            }
            case 'registry_references': {
                return (
                    <RegistryReferencesContainer
                        refObject={this.props.segment}
                        parentEntryId={1}
                        locale={this.props.locale}
                    />
                );
            }
            case 'annotations': {
                return (
                    <Annotations segment={this.props.segment} contentLocale={this.props.locale} />
                );
            }
        }
    }

    row(){
        let _this = this;
        let columns = this.props.selectedInterviewEditViewColumns.filter(v => permittedColumns(this.props, this.props.interview.id).includes(v))
        return columns.map(function(column, i){
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

SegmentEditView.propTypes = {
    segment: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    originalLocale: PropTypes.string.isRequired,
    translationLocale: PropTypes.string.isRequired,
    selectedInterviewEditViewColumns: PropTypes.array.isRequired,
    interview: PropTypes.object.isRequired,
    active: PropTypes.bool.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
