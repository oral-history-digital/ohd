import { useI18n } from 'modules/i18n';
import { getXmlLinks } from 'modules/utils';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt, FaRegQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export function XmlLinks({ projectShortname, collectionId }) {
    const { t } = useI18n();
    const xmlLinks = getXmlLinks({
        type: projectShortname ? 'project' : 'collection',
        locale: 'de', // Currently OAI links are unique using the German locale
        projectShortname,
        collectionId,
    });

    return (
        <div className="DescriptionList-group DescriptionList-group--xml-links">
            <dt className="DescriptionList-term">
                {t('explorer.details.xml_links.label')}{' '}
                <FaRegQuestionCircle
                    className="HelpText-icon"
                    title={t('explorer.details.xml_links.description')}
                />
            </dt>
            <dd className="DescriptionList-description">
                {xmlLinks.map((link) => (
                    <Link
                        key={link.metadataPrefix}
                        to={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="XmlLink"
                    >
                        <FaExternalLinkAlt className="XmlLink-icon" />
                        {link.text}
                    </Link>
                ))}
            </dd>
        </div>
    );
}
XmlLinks.propTypes = {
    projectShortname: PropTypes.string,
    collectionId: PropTypes.number,
};

export default XmlLinks;
