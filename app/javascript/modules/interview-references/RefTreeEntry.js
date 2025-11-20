import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import { Disclosure } from 'modules/ui';
import RefTreeChildren from './RefTreeChildren';

export default function RefTreeEntry({ entry, index }) {
    const { locale } = useI18n();

    const title = entry.desc
        ? `${entry.desc[locale]} (${entry.leafe_count})`
        : index + 1;

    return (
        <Disclosure title={title}>
            <RefTreeChildren entries={entry.children} />
        </Disclosure>
    );
}

RefTreeEntry.propTypes = {
    entry: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};
