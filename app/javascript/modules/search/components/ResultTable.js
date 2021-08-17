import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { AuthorizedContent } from 'modules/auth';
import { InterviewListRowContainer } from 'modules/interview-preview';

export default function ResultTable({
    foundInterviews,
    listColumns,
    query,
    project,
}) {
    const { t, locale } = useI18n();

    return (
        <table className="Table Table--searchResults">
            <thead>
                <tr>
                    <AuthorizedContent object={{type: 'General'}} action="edit">
                        <th className="Table-header" />
                    </AuthorizedContent>
                    <th className="Table-header">
                        {t('interviewee_name')}
                    </th>
                    {
                        listColumns.map((column) => (
                            <th key={column.name} className="Table-header">
                                {project?.metadata_fields[column.id].label[locale] || t(column.name)}
                            </th>
                        ))
                    }
                    {
                        query.fulltext && (
                            <th className="Table-header">
                                {t('archive_results')}
                            </th>
                        )
                    }
                </tr>
            </thead>
            <tbody>
                {foundInterviews?.map(interview => (
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
    foundInterviews: PropTypes.array,
    listColumns: PropTypes.array,
    project: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
};
