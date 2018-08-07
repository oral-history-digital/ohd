import React from 'react';

import HistoryFormContainer from '../containers/HistoryFormContainer';
import { t, admin } from '../../../lib/utils';

export default class History extends React.Component {

    edit() {
        return (
            <div
                className='flyout-sub-tabs-content-ico-link'
                title={t(this.props, 'edit.history.edit')}
                onClick={() => this.props.openArchivePopup({
                    title: t(this.props, 'edit.history.edit'),
                    content: <HistoryFormContainer history={this.props.history} />
                })}
            >
                <i className="fa fa-pencil"></i>
            </div>
        )
    }

    destroy() {
        this.props.deleteData('people', this.props.history.person_id, 'histories', this.props.history.id);
        this.props.closeArchivePopup();
    }

    delete() {
        return <div
            className='flyout-sub-tabs-content-ico-link'
            title={t(this.props, 'delete')}
            onClick={() => this.props.openArchivePopup({
                title: `${t(this.props, 'delete')}`,
                content: (
                    <div>
                        <p>{this.props.history.forced_labor_details[this.props.locale]}</p>
                        <p>{this.props.history.return_date[this.props.locale]}</p>
                        <p>{this.props.history.deportation_date[this.props.locale]}</p>
                        <p>{this.props.history.punishment[this.props.locale]}</p>
                        <p>{this.props.history.liberation_date[this.props.locale]}</p>

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

    entry(name) {
        return (
            <p key={name}>
                <span className='flyout-content-label'>{t(this.props, `histories.${name}`)}:</span>
                <span className='flyout-content-data'>{this.props.history[name][this.props.locale]}</span>
            </p>
        )
    }

    entries() {
        return ['forced_labor_details', 'return_date', 'deportation_date', 'punishment', 'liberation_date'].map((entry, index) => {
            return this.entry(entry);
        })
    }

    render() {
        return (
            <div>
                {this.entries()}
                {this.buttons()}
            </div>
        )
    }
}

