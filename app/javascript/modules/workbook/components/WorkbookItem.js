import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import queryString from 'query-string';

import { LinkOrA, useProject } from 'modules/routes';
import { convertLegacyQuery, useFacets } from 'modules/search';
import { useI18n } from 'modules/i18n';
import { isMobile } from 'modules/user-agent';
import { formatTimecode, TapeAndTime } from 'modules/interview-helpers';
import queryToFacets from '../queryToFacets';
import WorkbookActions from './WorkbookActions';

export default function WorkbookItem({
    data,
    className,
    projects,
    statuses,
    interviews,
    setArchiveId,
    sendTimeChangeRequest,
    hideSidebar,
    fetchData,
}) {
    const { t, locale } = useI18n();
    const { facets } = useFacets();
    const { isOhd } = useProject();

    const project = projects[data.project_id];
    const projectId = project?.shortname;
    const interview = interviews[data.media_id];

    const fetchingInterview = !!statuses['interviews'][data.media_id];

    useEffect(() => {
        if (project && !fetchingInterview) {
            fetchData(
                { projectId, locale, project },
                'interviews',
                data.media_id,
                'transcript_coupled'
            );
        }
    }, [interview, project]);

    function hideSidebarIfMobile() {
        if (isMobile()) {
            hideSidebar();
        }
    }

    function handleLinkClick() {
        if (data.type === 'InterviewReference') {
            setArchiveId(data.media_id);
        } else if (data.type === 'UserAnnotation') {
            setArchiveId(data.properties.interview_archive_id);
            interview?.transcript_coupled &&
                sendTimeChangeRequest(
                    data.properties.tape_nbr,
                    data.properties.time
                );
        }

        hideSidebarIfMobile();
    }

    const callKey =
        'call' +
        data.type.replace(/([A-Z])/g, function ($1) {
            return '_' + $1.toLowerCase();
        });
    let itemPath;
    if (project) {
        switch (data.type) {
            case 'InterviewReference':
                itemPath = `interviews/${data.media_id}`;
                break;
            case 'Search':
                itemPath = `searches/archive?${queryString.stringify(convertLegacyQuery(data.properties), { arrayFormat: 'bracket' })}`;
                break;
            case 'UserAnnotation':
                itemPath = `interviews/${data.properties.interview_archive_id}?tape=${data.properties.tape_nbr}&time=${formatTimecode(data.properties.time, true)}`;
                break;
            default:
        }
    }

    const facetValues = queryToFacets(
        convertLegacyQuery(data.properties),
        facets,
        locale
    );
    const date = new Date(data.created_at).toLocaleDateString(locale, {
        dateStyle: 'medium',
    });

    return (
        <div className={classNames('WorkbookEntry', className)}>
            <h3 className="WorkbookEntry-title">{data.title}</h3>

            <dl className="WorkbookEntry-list">
                {data.description && (
                    <div className="WorkbookEntry-listItem">
                        <dt>{t('modules.workbook.note')}</dt>
                        <dd>{data.description}</dd>
                    </div>
                )}
                {data.type === 'Search' && data.properties.fulltext && (
                    <div className="WorkbookEntry-listItem">
                        <dt>{t('modules.workbook.full_text_search')}</dt>
                        <dd>{data.properties.fulltext}</dd>
                    </div>
                )}
                {data.type === 'Search' && facetValues.length > 0 && (
                    <div className="WorkbookEntry-listItem">
                        <dt>{t('modules.workbook.filter')}</dt>
                        <dd>{facetValues}</dd>
                    </div>
                )}
                {data.type === 'UserAnnotation' && (
                    <div className="WorkbookEntry-listItem">
                        <dt>{t('modules.workbook.segment')}</dt>
                        <dd>
                            <TapeAndTime
                                tape={data.properties.tape_nbr}
                                time={data.properties.time}
                                transcriptCoupled={
                                    interview?.transcript_coupled
                                }
                            />
                        </dd>
                    </div>
                )}
                <div className="WorkbookEntry-listItem">
                    <dt>{t('modules.workbook.from')}</dt>
                    <dd>{date}</dd>
                </div>
            </dl>

            <p className="WorkbookEntry-link">
                {project ? (
                    <LinkOrA
                        project={project}
                        to={itemPath}
                        onLinkClick={handleLinkClick}
                    >
                        {t(callKey)}
                    </LinkOrA>
                ) : (
                    t('modules.workbook.project_unavailable')
                )}
            </p>

            {!isOhd && (
                <WorkbookActions
                    item={data}
                    itemPath={itemPath}
                    className="WorkbookEntry-actions"
                />
            )}
        </div>
    );
}

WorkbookItem.propTypes = {
    data: PropTypes.object.isRequired,
    statuses: PropTypes.object.isRequired,
    interviews: PropTypes.object.isRequired,
    className: PropTypes.string,
    projects: PropTypes.object.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
    fetchData: PropTypes.func.isRequired,
};
