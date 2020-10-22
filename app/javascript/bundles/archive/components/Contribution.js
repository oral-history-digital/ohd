import React from 'react';

import ContributionFormContainer from '../containers/ContributionFormContainer';
import { t, fullname, admin } from '../../../lib/utils';

export default class Contribution extends React.Component {

    edit() {
        return (
            <span
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.contribution.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.contribution.edit'),
                    content: <ContributionFormContainer 
                        contribution={this.props.contribution} 
                        submitData={this.props.submitData} 
                        withSpeakerDesignation={this.props.withSpeakerDesignation}
                    />
                })}
            >
                <i className="fa fa-pencil"></i>
            </span>
        )
    }

    destroy() {
        this.props.deleteData(this.props, 'interviews', this.props.archiveId, 'contributions', this.props.contribution.id);
        this.props.closeArchivePopup();
    }

    delete() {
        return <span
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: `${t(this.props, 'delete')} ${t(this.props, 'contributions.' + this.props.contribution.contribution_type)}`,
                content: (
                    <div>
                        <p>{fullname(this.props, this.props.person)}</p>
                        <div className='any-button' onClick={() => this.destroy()}>
                            {t(this.props, 'delete')}
                        </div>
                    </div>
                )
            })}
        >
            <i className="fa fa-trash-o"></i>
        </span>
    }

    buttons() {
        if (admin(this.props, {type: 'Contribution', action: 'update'})) {
            return (
                <span className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </span>
            )
        }
    }

    speakerDesignation() {
        if (this.props.withSpeakerDesignation) {
            return <span>{`: ${this.props.contribution.speaker_designation || t(this.props, 'edit.update_speaker.no_speaker_designation')}`}</span>;
        }
    }

    render() {
        if (
            this.props.contribution.workflow_state === 'public' ||
            admin(this.props, this.props.contribution) 
        ){ 
            return (
                <span className="flyout-content-data">
                    {fullname(this.props, this.props.person)}
                    {this.speakerDesignation()}
                    {this.buttons()}
                </span>
            );
        } else {
            return null;
        }
    }
}

