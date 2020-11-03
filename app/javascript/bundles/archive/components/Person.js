import React from 'react';

import PersonFormContainer from '../containers/PersonFormContainer';
import { t, fullname, admin } from '../../../lib/utils';

export default class Person extends React.Component {

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.person.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.person'),
                    content: <PersonFormContainer person={this.props.data} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
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
                        <p>{fullname(this.props, this.props.data)}</p>
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
        if (admin(this.props, this.props.data)) {
            return (
                <span className={'flyout-sub-tabs-content-ico'}>
                    {/* {this.edit()} */}
                    {this.delete()}
                </span>
            )
        }
    }

    render() {
        if (this.props.contribution) {
            return (
              <span className="flyout-content-data">
                {fullname(this.props, this.props.data)}
                {this.buttons()}
              </span>
            );
        } else {
            // search result with highlight:
            return (
                <div>
                    <p>
                        <span className='flyout-content-data' dangerouslySetInnerHTML={{__html: this.props.data.text[this.props.locale]}} />
                    </p>
                </div>
            )
        }
    }
}

