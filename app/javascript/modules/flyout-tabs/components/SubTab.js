import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import InterviewDataContainer from './InterviewDataContainer';

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
}

SubTab.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    obj: PropTypes.object,
    action: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};
