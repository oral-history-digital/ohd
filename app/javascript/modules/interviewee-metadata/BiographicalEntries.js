import { Component } from 'react';
import PropTypes from 'prop-types';

import { AuthorizedContent, admin } from 'modules/auth';
import { t } from 'modules/i18n';
import { Modal } from 'modules/ui';
import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';
import BiographicalEntryContainer from './BiographicalEntryContainer';

export default class BiographicalEntries extends Component {
    biographicalEntries() {
        let biographicalEntries = [];
        for (var c in this.props.person.biographical_entries) {
            let biographicalEntry = this.props.person.biographical_entries[c];
            if (biographicalEntry.workflow_state === 'public' || admin(this.props, biographicalEntry, 'show')) {
                biographicalEntries.push(<BiographicalEntryContainer data={biographicalEntry} key={`biographicalEntry-${biographicalEntry.id}`} />);
            }
        }
        return biographicalEntries;
    }

    addBiographicalEntry() {
        return (
            <AuthorizedContent object={{type: 'BiographicalEntry', interview_id: this.props.interview.id}} action='create'>
                <p>
                    <Modal
                        title={t(this.props, 'edit.biographical_entry.new')}
                        trigger={<><i className="fa fa-plus"/> {t(this.props, 'edit.biographical_entry.new')}</>}
                        triggerClassName="flyout-sub-tabs-content-ico-link"
                    >
                        {close => (
                            <BiographicalEntryFormContainer
                                person={this.props.person}
                                onSubmit={close}
                            />
                        )}
                    </Modal>
                </p>
            </AuthorizedContent>
        );
    }

    render() {
        if (this.props.person && this.props.person.associations_loaded) {
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

BiographicalEntries.propTypes = {
    person: PropTypes.object.isRequired,
    interview: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    account: PropTypes.object.isRequired,
};
