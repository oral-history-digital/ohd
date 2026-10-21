/* global railsMode */
import { OHD_DOMAINS } from 'modules/constants';
import {
    getCurrentUser,
    getProjectBrandName,
    submitData,
    useUmbrellaProject,
} from 'modules/data';
import { Form } from 'modules/forms';
import { useI18n } from 'modules/i18n';
import { usePathBase, useProject } from 'modules/routes';
import { Modal } from 'modules/ui';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

/**
 * Requests updated terms and privacy consent from older ZWAR/MOG project memberships.
 * Keeps the existing cutoff date and mandatory confirmation flow.
 * @returns {React.ReactElement|null} Confirmation popup when loaded project and account data require it.
 */
export default function ConfirmNewZwarTosPopup() {
    const { t, locale } = useI18n();
    const dispatch = useDispatch();
    const { project, isLoading, error } = useProject({});
    const pathBase = usePathBase();
    const { pathname } = useLocation();
    const { project: umbrellaProject } = useUmbrellaProject();

    const currentUser = useSelector(getCurrentUser);
    const currentProjectAccess =
        currentUser?.user_projects &&
        Object.values(currentUser.user_projects).find((up) => {
            return up.project_id === project?.id;
        });

    if (
        isLoading ||
        error ||
        !project ||
        ['za', 'mog'].indexOf(project.shortname) === -1
    ) {
        return null;
    }
    if (!currentProjectAccess) return null;
    if (pathname.match(/\/conditions$/)) return null;

    const newProjectAccess =
        new Date(currentProjectAccess.created_at).getTime() >
        new Date('2023-12-11T00:00:00Z').getTime();
    if (newProjectAccess) return null;

    const confirmedNewTos = currentProjectAccess.tos_agreement;
    if (confirmedNewTos) return null;

    const conditionsLink = `${OHD_DOMAINS[railsMode]}/${locale}/conditions`;
    const projectBaseUrl =
        project.archive_domain ||
        `${OHD_DOMAINS[railsMode]}/${project.shortname}`;
    const projectConditionsLink = `${projectBaseUrl}/${locale}/conditions`;
    const privacyLink = `${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`;
    const umbrellaProjectLabel = getProjectBrandName(umbrellaProject, locale);

    return (
        <Modal
            key="confirm-new-zwar-tos-popup"
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
            hideCloseButton={true}
        >
            {(close) => (
                <>
                    <h2>{t('update.zwar.tos.title')}</h2>
                    <p>
                        {t('update.zwar.tos.content_one', {
                            archive_name: project.name,
                            umbrella_project_name: umbrellaProjectLabel,
                        })}
                    </p>
                    <p>{t('update.zwar.tos.content_two')}</p>
                    <p>{t('update.zwar.tos.content_three')}</p>
                    <Form
                        scope="user_project"
                        onSubmit={(params) => {
                            dispatch(submitData({ pathBase }, params));
                            close();
                        }}
                        data={currentProjectAccess}
                        elements={[
                            {
                                elementType: 'input',
                                attribute: 'tos_agreement_ohd',
                                label: umbrellaProjectLabel
                                    ? `${t('user.tos_agreement')} (${umbrellaProjectLabel})`
                                    : t('user.tos_agreement'),
                                type: 'checkbox',
                                validate: function (v) {
                                    return v && v !== '0';
                                },
                                help: t('update.zwar.tos.tos_agreement_ohd', {
                                    umbrella_project_name: umbrellaProjectLabel,
                                    tos_link: (
                                        <a
                                            className="Link"
                                            href={conditionsLink}
                                            target="_blank"
                                            title="Externer Link"
                                            rel="noreferrer"
                                        >
                                            {t('user.tos_agreement')}
                                        </a>
                                    ),
                                }),
                            },
                            {
                                elementType: 'input',
                                attribute: 'tos_agreement',
                                label:
                                    t('user.tos_agreement') +
                                    ` (${project.shortname === 'za' ? 'ZWAR' : 'MOG'})`,
                                type: 'checkbox',
                                validate: function (v) {
                                    return v && v !== '0';
                                },
                                help: t('update.zwar.tos.tos_agreement_zwar', {
                                    project: project.name,
                                    tos_link: (
                                        <a
                                            className="Link"
                                            href={projectConditionsLink}
                                            target="_blank"
                                            title="Externer Link"
                                            rel="noreferrer"
                                        >
                                            {t('user.tos_agreement')}
                                        </a>
                                    ),
                                }),
                            },
                            {
                                elementType: 'input',
                                attribute: 'priv_agreement',
                                labelKey: 'user.priv_agreement',
                                type: 'checkbox',
                                validate: function (v) {
                                    return v && v !== '0';
                                },
                                help: t('update.zwar.tos.priv_agreement', {
                                    priv_link: (
                                        <a
                                            className="Link"
                                            href={privacyLink}
                                            target="_blank"
                                            title="Externer Link"
                                            rel="noreferrer"
                                        >
                                            {t('user.priv_agreement')}
                                        </a>
                                    ),
                                }),
                            },
                        ]}
                    />
                </>
            )}
        </Modal>
    );
}
