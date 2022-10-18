import { Helmet } from 'react-helmet';
import classNames from 'classnames';

import { useHelpTextApi } from 'modules/api';
import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import {
    useHelpTexts,
    useMutateHelpTexts,
    HelpTextForm
} from 'modules/help-text';
import DataContainer from './DataContainer';

export default function HelpTextAdminPage() {
    const { t, locale } = useI18n();
    const { data: helpTextData, isLoading, isValidating } = useHelpTexts();
    const mutateHelpTexts = useMutateHelpTexts();
    const { deleteHelpText } = useHelpTextApi();

    const scope = 'help_text';
    const detailsAttributes = [
        'code',
        'description',
        'text',
        'url',
        'created_at',
        'updated_at'
    ];
    const outerScope = undefined;
    const outerScopeId = undefined;
    const joinedData = {};
    const showComponent = undefined;

    if (isLoading) {
        return (
            <div className='wrapper-content register'>
                <Spinner />
            </div>
        );
    }

    function renderForm(data, onSubmit, onCancel) {
        return (
            <HelpTextForm
                data={data}
                onSubmit={onSubmit}
                onCancel={onCancel}
            />
        );
    }

    async function handleDeleteHelpText(id, callback) {
        await deleteHelpText(id);
        mutateHelpTexts();

        if (typeof callback === 'function') {
            callback();
        }
    }

    const sortedData = helpTextData?.sort((a, b) => {
            const aName = a.code;
            const bName = b.code;
            return aName.localeCompare(bName, locale);
        });

    console.log(sortedData);

    return (
        <div className='wrapper-content register'>
            <Helmet>
                <title>
                    {t(`activerecord.models.${scope}.other`)}
                </title>
            </Helmet>

            <AuthShowContainer ifLoggedIn>
                <h1 className="registry-entries-title">
                    {t(`activerecord.models.${scope}.other`)}
                </h1>

                <div className={classNames('LoadingOverlay', {
                    'is-loading': isValidating
                })}>
                    {sortedData?.map(data => (
                        <DataContainer
                            data={data}
                            scope={scope}
                            outerScope={outerScope}
                            outerScopeId={outerScopeId}
                            detailsAttributes={detailsAttributes}
                            joinedData={joinedData}
                            form={renderForm}
                            showComponent={showComponent}
                            hideDelete
                            handleDelete={handleDeleteHelpText}
                            disabled={isValidating}
                            key={`${scope}-${data.id}`}
                        />
                    ))}
                </div>

            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
