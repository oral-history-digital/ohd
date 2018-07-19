import React from 'react';
import HistoryContainer from '../containers/HistoryContainer';
import HistoryFormContainer from '../containers/HistoryFormContainer';
import { t, admin } from '../../../lib/utils';

export default class Histories extends React.Component {

    histories() {
        let histories = [];
        for (var c in this.props.person.histories) {
            let history = this.props.person.histories[c];
            if (history && history !== 'fetched') {
                histories.push(<HistoryContainer history={history} key={`history-${history.id}`} />);
            }
        }
        return histories;
    }

    addHistory() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.add_history')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.add_history'),
                        content: <HistoryFormContainer person={this.props.person} />
                    })}
                >
                    <i className="fa fa-plus"></i>
                </div>
            )
        }
    }

    render() {
        if (this.props.person) {
            return (
                <div>
                    {this.histories()}
                    {this.addHistory()}
                </div>
            );
        } else {
            return null;
        }
    }
}

