import { useAuthorization } from 'modules/auth';
import { getResultMetadataFields } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { InterviewListRowContainer } from 'modules/interview-preview';
import { useSearchParams } from 'modules/query-string';
import { useProject } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';

/**
 * Shows search results with the current project's configured metadata columns.
 *
 * @param {Object} props - Component properties.
 * @param {Object[]} props.interviews - Interview summaries.
 * @returns {React.ReactElement} Results table or its loading/error state.
 */
export default function ResultTable({ interviews }) {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({
        include: ['metadata_fields'],
    });
    const columns = getResultMetadataFields(project?.metadata_fields, 'table');
    const { fulltext } = useSearchParams();
    const { isAuthorized } = useAuthorization();

    function showCheckboxes() {
        return (
            isAuthorized(interviews?.[0], 'show') &&
            isAuthorized({ type: 'General' }, 'edit')
        );
    }

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    return (
        <table className="Table Table--searchResults">
            <thead className="Table-head">
                <tr className="Table-row">
                    {showCheckboxes() && <th className="Table-header" />}
                    <th className="Table-header">{t('interviewee_name')}</th>
                    {project.is_umbrella && (
                        <th className="Table-header">
                            {t('activerecord.models.project.one')}
                        </th>
                    )}
                    {columns.map((column) => (
                        <th key={column.name} className="Table-header">
                            {column.label ||
                                t(`metadata_labels.${column.name}`)}
                        </th>
                    ))}
                    {fulltext && (
                        <th className="Table-header">{t('archive_results')}</th>
                    )}
                </tr>
            </thead>
            <tbody className="Table-body">
                {interviews?.map((interview) => (
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
