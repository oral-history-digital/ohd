import PropTypes from 'prop-types';
import { FaPencilAlt, FaTrash, FaAngleRight } from 'react-icons/fa';
import queryString from 'query-string';

import { LinkOrA } from 'modules/routes';
import { queryToText, convertLegacyQuery, useFacets } from 'modules/search';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { isMobile } from 'modules/user-agent';
import UserContentFormContainer from './UserContentFormContainer';
import UserContentDeleteContainer from './UserContentDeleteContainer';

export default function UserContent({
    data,
    locale,
    translations,
    projects,
    setArchiveId,
    sendTimeChangeRequest,
    hideSidebar,
}) {
    const { t } = useI18n();
    const { facets } = useFacets();

    function hideSidebarIfMobile() {
        if (isMobile()) {
            hideSidebar();
        }
    }

    function onInterviewReferenceClick() {
        setArchiveId(data.media_id);
        hideSidebarIfMobile();
    }

    function onAnnotationClick() {
        setArchiveId(data.properties.interview_archive_id);
        sendTimeChangeRequest(data.properties.tape_nbr, data.properties.time);
        hideSidebarIfMobile();
    }

    function onSearchClick() {
        hideSidebarIfMobile();
    }

    let callKey = "call" + data.type.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
    const project = projects[data.project_id];

    let linkNode = null;
    if (project) {
        switch (data.type) {
        case 'InterviewReference':
            linkNode = (
                <LinkOrA project={project} to={`interviews/${data.media_id}`} onLinkClick={onInterviewReferenceClick}>
                    {t(callKey)}
                </LinkOrA>
            );
            break;
        case 'UserAnnotation':
            linkNode = (
                <LinkOrA project={project} to={`interviews/${data.properties.interview_archive_id}`} onLinkClick={onAnnotationClick}>
                    {t(callKey)}
                </LinkOrA>
            );
            break;
        case 'Search':
            linkNode = (
                <LinkOrA
                    project={project}
                    to={`searches/archive?${queryString.stringify(convertLegacyQuery(data.properties), { arrayFormat: 'bracket' })}`}
                    onLinkClick={onSearchClick}
                >
                    {t(callKey)}
                </LinkOrA>
            );
            break;
        default:
            linkNode = null;
        }
    }

    return (
        <div className='flyout-content-item'>
            <h3><span className='flyout-content-data'>{data.title}</span></h3>

            <p>
                <span className='flyout-content-label'>{t('description')}:</span>
                <span className='flyout-content-data'>{data.description}</span>
            </p>

            {data.type === 'UserAnnotation' && t(data.workflow_state)}

            {
                data.type === 'Search' && (
                    <p>
                        <span className='flyout-content-label'>{t('query')}:</span>
                        <span className='flyout-content-data'>
                            {queryToText(convertLegacyQuery(data.properties),
                                facets, locale, translations)}
                        </span>
                    </p>
                )
            }
            {
                linkNode ? (
                    <p className="flyout-sub-tabs-content-link">
                        <FaAngleRight className="Icon Icon--primary" />
                        {linkNode}
                    </p>
                ) : (
                    <p>{t('modules.workbook.project_unavailable')}</p>
                )
            }
            <div className="flyout-sub-tabs-content-ico">
                <Modal
                    title={t('edit')}
                    trigger={<FaPencilAlt className="Icon Icon--primary" />}
                >
                    {closeModal => (
                        <UserContentFormContainer
                            id={data.id}
                            title={data.title}
                            description={data.description}
                            properties={data.properties}
                            segmentIndex={data.properties.segmentIndex}
                            reference_id={data.reference_id}
                            reference_type={data.reference_type}
                            media_id={data.media_id}
                            type={data.type}
                            workflow_state={data.workflow_state}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
                <Modal
                    title={t('delete_user_content')}
                    trigger={<FaTrash className="Icon Icon--primary" />}
                >
                    {closeModal => (
                        <UserContentDeleteContainer
                            id={data.id}
                            title={data.title}
                            description={data.description}
                            onSubmit={closeModal}
                            onCancel={closeModal}
                        />
                    )}
                </Modal>
            </div>
        </div>
    );
}

UserContent.propTypes = {
    data: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    projects: PropTypes.object.isRequired,
    setArchiveId: PropTypes.func.isRequired,
    sendTimeChangeRequest: PropTypes.func.isRequired,
    hideSidebar: PropTypes.func.isRequired,
};
