import PropTypes from 'prop-types';
import { useI18n } from 'modules/i18n';
import { FaInfoCircle, FaExternalLinkAlt } from 'react-icons/fa';

export default function CollectionLink({
    collection,
}) {
    const { locale } = useI18n();

    const title = collection.notes && collection.notes[locale] || ''

    return (
        <span>
            <FaInfoCircle
                className="Icon Icon--unobtrusive u-mr-tiny"
                title={title}
            />
            <a
                href={collection.homepage[locale]}
                title={collection.homepage[locale]}
                target="_blank"
                rel="noreferrer"
            >
                <FaExternalLinkAlt className="Icon Icon--unobtrusive u-mr-tiny" />
            </a>
        </span>
    );
}

CollectionLink.propTypes = {
    collection: PropTypes.object.isRequired,
};
