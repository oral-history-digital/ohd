import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';

export default function RefTreeEntry({
    entry,
    index,
    renderChildren,
}) {
    const { locale } = useI18n();

    const title = entry.desc ? `${entry.desc[locale]} (${entry.leafe_count})` : (index + 1);

    return (
        <Disclosure title={title}>
            {renderChildren(entry.children)}
        </Disclosure>
    );
}

RefTreeEntry.propTypes = {
    entry: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    renderChildren: PropTypes.func.isRequired,
};
