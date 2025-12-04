import { AuthorizedContent, useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { Modal } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaPlus } from 'react-icons/fa';

import BiographicalEntryContainer from './BiographicalEntryContainer';
import BiographicalEntryFormContainer from './BiographicalEntryFormContainer';
import { usePersonWithAssociations } from './hooks';

export default function BiographicalEntries({ interview, intervieweeId }) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();

    const { data: interviewee, isLoading } =
        usePersonWithAssociations(intervieweeId);

    if (isLoading) {
        return <Spinner size="small" />;
    }

    if (!interviewee) {
        return null;
    }

    let biographicalEntries = [];
    for (var c in interviewee.biographical_entries) {
        let biographicalEntry = interviewee.biographical_entries[c];
        if (
            biographicalEntry.workflow_state === 'public' ||
            isAuthorized(biographicalEntry, 'show')
        ) {
            biographicalEntries.push(
                <BiographicalEntryContainer
                    data={biographicalEntry}
                    key={`biographicalEntry-${biographicalEntry.id}`}
                />
            );
        }
    }

    return (
        <div>
            {biographicalEntries}
            <AuthorizedContent
                object={{
                    type: 'BiographicalEntry',
                    interview_id: interview.id,
                }}
                action="create"
            >
                <p>
                    <Modal
                        title={t('edit.biographical_entry.new')}
                        trigger={
                            <>
                                <FaPlus className="Icon Icon--editorial Icon--small" />{' '}
                                {t('edit.biographical_entry.new')}
                            </>
                        }
                    >
                        {(close) => (
                            <BiographicalEntryFormContainer
                                person={interviewee}
                                onSubmit={close}
                                onCancel={close}
                            />
                        )}
                    </Modal>
                </p>
            </AuthorizedContent>
        </div>
    );
}

BiographicalEntries.propTypes = {
    interview: PropTypes.object.isRequired,
    intervieweeId: PropTypes.number,
};
