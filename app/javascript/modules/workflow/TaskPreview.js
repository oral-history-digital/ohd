import { Component } from 'react';

import { useI18n } from 'modules/i18n';
import { pathBase } from 'modules/routes';
import { usePathBase } from 'modules/routes';
import { Link } from 'react-router-dom';

export default function TaskPreview({ data, setArchiveId, scope, user }) {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();

    const dateAttribute = () => {
        if (data.user_id === user.id) {
            // tasks assigned to current user
            if (data.workflow_state === 'finished') {
                return 'finished_at';
            } else {
                return 'assigned_to_user_at';
            }
        } else if (data.supervisor_id === user.id) {
            // tasks assigned to current user as QM
            if (data.workflow_state === 'cleared') {
                return 'cleared_at';
            } else {
                return 'assigned_to_supervisor_at';
            }
        }
    };

    return (
        <div className="base-data box">
            <p>
                <Link
                    onClick={() => {
                        setArchiveId(data.archive_id);
                    }}
                    to={pathBase + '/interviews/' + data.archive_id}
                >
                    {`${data.archive_id}: ${data.name[locale]}`}
                </Link>
            </p>
            <p className="created-at">
                <span className="title">
                    {t(`activerecord.attributes.${scope}.${dateAttribute()}`) +
                        ': '}
                </span>
                <span className="content">{data[dateAttribute()]}</span>
            </p>
        </div>
    );
}
