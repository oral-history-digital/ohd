import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { Modal } from 'modules/ui';
import { useI18n } from 'modules/i18n';
import { Form } from 'modules/forms';
import { submitData } from 'modules/data';
import { getCurrentUser, getCurrentProject } from 'modules/data';
import { OHD_DOMAINS } from 'modules/constants';

export default function ConfirmNewZwarTosPopup ({
}) {
    const { t, locale } = useI18n();
    const dispatch = useDispatch();
    const project = useSelector(getCurrentProject);

    const projectId = 'za';
    const currentUser = useSelector(getCurrentUser);
    const currentProjectAccess = currentUser?.user_projects &&
        Object.values(currentUser.user_projects).find( up => {
            return up.project_id === project?.id;
        });

    if (project?.shortname !== 'za') return null;
    if (!currentProjectAccess) return null;
    if (location.pathname.match(/\/conditions$/)) return null;

    const newProjectAccess = new Date(currentProjectAccess.created_at).getTime() > new Date('2023-10-19T00:00:00Z').getTime();
    if (newProjectAccess) return null;

    const confirmedNewTos = currentProjectAccess.tos_agreement;
    if (confirmedNewTos) return null;

    const conditionsLink = `${OHD_DOMAINS[railsMode]}/${locale}/conditions`;
    const conditionsLinkZWAR = `${project.domain_with_optional_identifier}/${locale}/conditions`;
    const privacyLink = `${OHD_DOMAINS[railsMode]}/${locale}/privacy_protection`;

    return (
        <Modal
            key='confirm-new-zwar-tos-popup'
            triggerClassName="Button Button--transparent Button--withoutPadding Button--primaryColor"
            showDialogInitially={true}
            hideButton={true}
            hideCloseButton={true}
        >
            { close => (
                <>
                    <h2>{t('update.zwar.tos.title')}</h2>
                    <p>{t('update.zwar.tos.content_one')}</p>
                    <p>{t('update.zwar.tos.content_two')}</p>
                    <p>{t('update.zwar.tos.content_three')}</p>
                    <Form
                        scope='user_project'
                        onSubmit={(params) => {
                            dispatch(submitData({ locale, projectId, project }, params));
                            close();
                        }}
                        data={currentProjectAccess}
                        elements={[
                            {
                                elementType: 'input',
                                attribute: 'tos_agreement_ohd',
                                label: t('user.tos_agreement') + ' (OHD)',
                                type: 'checkbox',
                                validate: function(v){return v && v !== '0'},
                                help: t('update.zwar.tos.tos_agreement_ohd', {
                                    tos_link: <a
                                        className="Link"
                                        href={conditionsLink}
                                        target="_blank"
                                        title="Externer Link"
                                        rel="noreferrer"
                                    >
                                        {t('user.tos_agreement')}
                                    </a>
                                })
                            },
                            {
                                elementType: 'input',
                                attribute: 'tos_agreement',
                                label: t('user.tos_agreement') + ' (ZWAR)',
                                type: 'checkbox',
                                validate: function(v){return v && v !== '0'},
                                help: t('update.zwar.tos.tos_agreement_zwar', {
                                    project: project.name[locale],
                                    tos_link: <a
                                        className="Link"
                                        href={conditionsLinkZWAR}
                                        target="_blank"
                                        title="Externer Link"
                                        rel="noreferrer"
                                    >
                                        {t('user.tos_agreement')}
                                    </a>
                                })
                            },
                            {
                                elementType: 'input',
                                attribute: 'priv_agreement' ,
                                labelKey: 'user.priv_agreement',
                                type: 'checkbox',
                                validate: function(v){return v && v !== '0'},
                                help: t('update.zwar.tos.priv_agreement', {
                                    priv_link: <a
                                        className="Link"
                                        href={privacyLink}
                                        target="_blank"
                                        title="Externer Link"
                                        rel="noreferrer"
                                    >
                                        {t('user.priv_agreement')}
                                    </a>
                                })
                            },
                        ]}
                    />
                </>
            )}
        </Modal>
    )
}


