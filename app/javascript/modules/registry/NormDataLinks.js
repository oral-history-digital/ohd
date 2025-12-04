import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function NormDataLinks({ registryEntry }) {
    const { t } = useI18n();

    return registryEntry.norm_data.map((normDatum) => (
        <a
            key={normDatum.nid}
            href={`${normDatum.norm_data_provider.url_without_id}${normDatum.nid}`}
            target="_blank"
            rel="noreferrer"
            className="Link flyout-sub-tabs-content-ico-link"
            title={t('norm_data.link_hover')}
        >
            &nbsp;{normDatum.norm_data_provider.name}&nbsp;
        </a>
    ));
}

NormDataLinks.propTypes = {
    registryEntry: PropTypes.object.isRequired,
};
