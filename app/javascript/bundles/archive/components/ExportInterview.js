import React from 'react';
import { t } from '../../../lib/utils';

export default class ExportInterviewInfo extends React.Component {

    content() {
        if(this.props.doiResult[this.props.archiveId]) {
            return this.codeToMsg();
        } else {
            return (
                <button onClick={() => this.props.submitDois([this.props.archiveId], this.props.locale)}>
                    {t(this.props, 'export_doi')}
                </button>
            )
        }
    }

    codeToMsg() {
        switch (parseInt(this.props.doiResult[this.props.archiveId])) {
            case 201:
                return t(this.props, 'doi.created');
                break;
            case 422:
                return t(this.props, 'doi.already_registered');
                break;
        }
    }

    render() {
        return (
            <div>
                {this.content()}
            </div>
        );
    }
}

