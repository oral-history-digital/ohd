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
        //let msg; 
        //switch (parseInt(this.props.doiResult[archiveId])) {
            //case 201:
                //msg = 'doi.created';
                ////return t(this.props, 'doi.created');
                //break;
            //case 400:
                //msg = 'doi.bad';
                //break;
            //case 422:
                //msg = 'doi.already_registered';
                ////return t(this.props, 'doi.already_registered');
                //break;
        //}
        //return `${archiveId}: ${t(this.props, msg)}`
        return `${archiveId}: ${this.props.doiResult[archiveId]}`
    }

    exportDOI() {
        this.props.submitDois(this.props.archiveIds, this.props.locale)
        this.props.closeArchivePopup();
    }

    doiButton() {
        let title = t(this.props, 'doi.title');
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={title}
            onClick={() => this.props.openArchivePopup({
                title: title,
                content: (
                    <div>
                        {t(this.props, 'doi.text1') + this.props.archiveIds.join(', ') + t(this.props, 'doi.text2')}
                        <div className='any-button' onClick={() => this.exportDOI()}>
                            {t(this.props, 'doi.ok')}
                        </div>
                    </div>
                )
            })}
        >
            {t(this.props, 'doi.title')}
        </div>
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

