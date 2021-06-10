import InterviewDataContainer from './InterviewDataContainer';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';

export default function SubTab({
    title,
    children,
    url,
    obj,
    action,
}) {

    const { t } = useI18n();

    return (
        <AuthorizedContent object={obj} action={action}>
            <div className='flyout-sub-tabs-container flyout-video'>
                <InterviewDataContainer
                    title={t(title)}
                    url={url}
                    open={false}
                >
                   {children}
                </InterviewDataContainer>
            </div>
        </AuthorizedContent>
    );
};
