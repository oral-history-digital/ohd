import PropTypes from 'prop-types';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import SubTab from './SubTab';

export default function AdminSubTab({
    title,
    children,
    url,
    obj,
    action,
}) {
    const { t } = useI18n();

    return (
        <AuthorizedContent object={obj} action={action}>
            <SubTab
                title={t(title)}
                url={url}
            >
                {children}
            </SubTab>
        </AuthorizedContent>
    );
}

AdminSubTab.propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
    obj: PropTypes.object,
    action: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
};