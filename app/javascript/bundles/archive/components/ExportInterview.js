import React from 'react';
import { t } from '../../../lib/utils';

export default class ExportInterviewInfo extends React.Component {

    messages() {
        return Object.keys(this.props.doiResult).map((archiveId) => {
            return (
                <div>
                    {this.codeToMsg(archiveId)}
                </div>
            )
        }) 
    }

    codeToMsg(archiveId) {
        let msg; 
        switch (parseInt(this.props.doiResult[archiveId])) {
            case 201:
                msg = 'doi.created';
                //return t(this.props, 'doi.created');
                break;
            case 422:
                msg = 'doi.already_registered';
                //return t(this.props, 'doi.already_registered');
                break;
        }
        return `${archiveId}: ${t(this.props, msg)}`
    }

    doiButton() {
        return (
            <button onClick={() => this.props.submitDois(this.props.archiveIds, this.props.locale)}>
                {t(this.props, 'export_doi')}
            </button>
        )
    }

    render() {
        return (
            <div>
                {this.messages()}
                {this.doiButton()}
            </div>
        );
    }
}

