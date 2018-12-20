import React from 'react';
import BiographicalEntryContainer from '../containers/BiographicalEntryContainer';
import BiographicalEntryFormContainer from '../containers/BiographicalEntryFormContainer';
import { t, admin } from '../../../lib/utils';

export default class BiographicalEntries extends React.Component {

    biographicalEntries() {
        let biographicalEntries = [];
        for (var c in this.props.person.biographical_entries) {
            let biographicalEntry = this.props.person.biographical_entries[c];
            if (biographicalEntry.workflow_state === 'public' || admin(this.props)) {
                biographicalEntries.push(<BiographicalEntryContainer data={biographicalEntry} key={`biographicalEntry-${biographicalEntry.id}`} />);
            }
        }
        return biographicalEntries;
    }

    addBiographicalEntry() {
        if (admin(this.props)) {
            return (
                <div
                    className='flyout-sub-tabs-content-ico-link'
                    title={t(this.props, 'edit.biographical_entry.new')}
                    onClick={() => this.props.openArchivePopup({
                        title: t(this.props, 'edit.biographical_entry.new'),
                        content: <BiographicalEntryFormContainer person={this.props.person} />
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
                    {this.biographicalEntries()}
                    {this.addBiographicalEntry()}
                </div>
            );
        } else {
            return null;
        }
    }
}

