import AuthShowContainer from 'modules/auth/AuthShowContainer';
import { getIsLoading, submitData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import EditData from './EditData';
import EditViewOrRedirect from './EditViewOrRedirect';
import ExternalLinksContainer from './ExternalLinksContainer';
import InstitutionProjectsContainer from './InstitutionProjectsContainer';

export default function EditProjectInfo() {
    const { t } = useI18n();
    const { project } = useProject();
    const dispatch = useDispatch();
    const isLoading = useSelector((state) =>
        getIsLoading(state, project ? 'projects' : null, project?.id)
    );

    function submitHandler(props, params, opts, callback) {
        dispatch(submitData(props, params, opts, callback));
    }

    const formElements = [
        {
            attribute: 'name',
            multiLocale: true,
        },
        {
            attribute: 'introduction',
            elementType: 'richTextEditor',
            multiLocale: true,
        },
        {
            attribute: 'more_text',
            elementType: 'richTextEditor',
            multiLocale: true,
        },
        {
            attribute: 'landing_page_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            help: 'activerecord.attributes.project.landing_page_edit_help',
        },
        {
            attribute: 'restricted_landing_page_text',
            elementType: 'richTextEditor',
            multiLocale: true,
            help: 'activerecord.attributes.project.restricted_landing_page_edit_help',
        },
        {
            attribute: 'cooperation_partner',
        },
        {
            attribute: 'leader',
        },
        {
            attribute: 'manager',
        },
        {
            attribute: 'pseudo_funder_names',
        },
        {
            attribute: 'media_missing_text',
            multiLocale: true,
        },
    ];

    return (
        <EditViewOrRedirect>
            <div className="wrapper-content register">
                <Helmet>
                    <title>{t(`edit.project.info`)}</title>
                </Helmet>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className="registry-entries-title">
                        {t(`edit.project.info`)}
                    </h1>
                    <EditData
                        data={project}
                        scope="project"
                        helpTextCode="archive_info_form"
                        formElements={formElements}
                        submitData={submitHandler}
                        isLoading={isLoading}
                    />
                    <h2 className="registry-entries-title">
                        {t(`edit.external_link.admin`)}
                    </h2>
                    <ExternalLinksContainer />
                    <h2 className="registry-entries-title">
                        {t(`edit.institution_project.admin`)}
                    </h2>
                    <InstitutionProjectsContainer />
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t('devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        </EditViewOrRedirect>
    );
}
