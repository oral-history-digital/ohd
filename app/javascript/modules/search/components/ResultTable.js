import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { useAuthorization } from 'modules/auth';
import { InterviewListRowContainer } from 'modules/interview-preview';
import { useProject } from 'modules/routes';
import { useSearchParams } from 'modules/query-string';

export default function ResultTable({
    interviews,
}) {
    const { t, locale } = useI18n();
    const { project } = useProject();
    const { fulltext } = useSearchParams();
    const { isAuthorized } = useAuthorization();

    function showCheckboxes() {
        return isAuthorized(interviews?.[0], 'show') &&
            isAuthorized({ type: 'General' }, 'edit');
    }

    return (
        <table className="Table Table--searchResults">
            <thead className="Table-head">
                <tr className="Table-row">
                    {showCheckboxes() && <th className="Table-header" />}
                    <th className="Table-header">
                        {t('interviewee_name')}
                    </th>
                    {
                        project.list_columns?.map(column => (
                            <th key={column.name} className="Table-header">
                                {project.metadata_fields?.[column.id]?.label?.[locale] || t(column.name)}
                            </th>
                        ))
                    }
                    {
                        fulltext && (
                            <th className="Table-header">
                                {t('archive_results')}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody className="Table-body">
                {interviews?.map(interview => (
                    <InterviewListRowContainer
                        key={interview.id}
                        interview={interview}
                    />
                ))}
            </tbody>
        </table>
    );
}

ResultTable.propTypes = {
    interviews: PropTypes.array,
};
