import React from 'react';
import { t } from '../../../lib/utils';

export default class ExportInterviewInfo extends React.Component {

    messages() {
        return Object.keys(this.props.doiResult).map((archiveId) => {
            return (
                <div>
                    {`${archiveId}: ${this.props.doiResult[archiveId]}`}
                </div>
            )
        }) 
    }

    exportDOI() {
        this.props.submitDois(this.props.archiveIds, this.props.locale)
        this.props.closeArchivePopup();
    }

    links(archiveIds) {
        return archiveIds.map((archiveId, i) => [
            i > 0 && ", ",
            <a href={`/${this.props.locale}/interviews/${archiveId}.xml`} target='_blank' key={`link-to-${archiveId}`}>{archiveId}</a>
        ])
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
                        {t(this.props, 'doi.text1') + ' '}
                        {this.links(this.props.archiveIds)}
                        {' ' + t(this.props, 'doi.text2')}
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

