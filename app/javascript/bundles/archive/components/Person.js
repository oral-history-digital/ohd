import React from 'react';
import {Link, hashHistory} from 'react-router-dom';

import PersonFormContainer from '../containers/PersonFormContainer';
import { t, fullname, admin } from '../../../lib/utils';

export default class Person extends React.Component {

    //form() {
        //return <PersonFormContainer person={this.props.person} />; 
    //}

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.person.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.person'),
                    //content: this.form()
                    content: <PersonFormContainer person={this.props.person} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('interviews', this.props.archiveId, 'contributions', this.props.contribution.id);
        //this.props.deleteData('interviews', this.props.archiveId, `${this.props.contribution.contribution_type}_contributions`, this.props.contribution.id);
        this.props.closeArchivePopup();
    }

    delete() {
        return <div
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
        </div>
    }

    buttons() {
        if (admin(this.props)) {
            return (
                <div className={'flyout-sub-tabs-content-ico'}>
                    {this.edit()}
                    {this.delete()}
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <p>
                    <span className='flyout-content-label'>{t(this.props, `contributions.${this.props.contribution.contribution_type}`)}:</span>
                    <span className='flyout-content-data'>{fullname(this.props, this.props.person)}</span>
                </p>
                {this.buttons()}
            </div>
        )
    }
}

