import React from 'react';
import { t } from '../../../lib/utils';

export default class ExportInterviewInfo extends React.Component {

    render() {
        return (
            <div>
                <button onClick={() => this.props.submitDois([this.props.archiveId], this.props.locale)}>
                    {t(this.props, 'export_doi')}
                </button>
            </div>
        );
    }
}

