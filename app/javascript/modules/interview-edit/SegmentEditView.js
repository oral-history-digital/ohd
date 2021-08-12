import { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
        const { segment, active, sendTimeChangeRequest, originalLocale, translationLocale,
            locale } = this.props;

        switch (columnName) {
            case 'timecode': {
              return (
                    <div
                        id={`segment_${segment.id}`}
                        className={classNames('segment', active ? 'active' : 'inactive')}
                        onClick={() => sendTimeChangeRequest(segment.tape_nbr, segment.time)}
                    >
                        {`${segment.tape_nbr} - ${this.segmentTime()}`}
                    </div>
              );
            }
            case 'text_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='text'
                        type='textarea'
                    />
                );
            }
            case 'text_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='text'
                        type='textarea'
                    />
                );
            }
            case 'mainheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='mainheading'
                        type='input'
                    />
                );
            }
            case 'mainheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='mainheading'
                        type='input'
                    />
                );
            }
            case 'subheading_orig': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={originalLocale}
                        attribute='subheading'
                        type='input'
                    />
                );
            }
            case 'subheading_translated': {
                return (
                    <SubmitOnBlurForm
                        data={segment}
                        scope='segment'
                        locale={translationLocale}
                        attribute='subheading'
                        type='input'
                    />
                );
            }
            case 'registry_references': {
                return (
                    <RegistryReferencesContainer
                        refObject={segment}
                        parentEntryId={1}
                        locale={locale}
                    />
                );
            }
            case 'annotations': {
                return (
                    <Annotations segment={segment} contentLocale={locale} />
                );
            }
        }
    }

    row(){
        const { account, editView, project, interview, selectedInterviewEditViewColumns,
            segment } = this.props;
        const { visible } = this.state;

        let columns = selectedInterviewEditViewColumns.filter(
            v => permittedColumns({ account, editView, project }, interview.id).includes(v)
        );

        return columns.map((column, i) => (
            <td key={`${segment.id}-column-${i}`}>
                {visible && this.columnElement(column)}
            </td>
        ));
    }

    render() {
        return (
            <VizSensor
                partialVisibility
                onChange={(isVisible) => {
                    this.setState({visible: isVisible})
                }}
            >
                <tr className="segment-row">
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
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    project: PropTypes.object.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
};
