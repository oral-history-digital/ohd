import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';
import { FaDownload, FaEye, FaEyeSlash } from 'react-icons/fa';

import MaterialAdminButtons from './MaterialAdminButtons';

export default function Material({ material }) {
    const { t } = useI18n();
    const isPublic = material.workflow_state === 'public';
    const fileInfo = `${material.filename} (${material.size_human})`;

    return (
        <li className="Card">
            <article className="Card-inner">
                <h4 className="Card-title u-mt-none u-mb-none">
                    <a
                        href={material.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t('download')}: ${material.title}`}
                        className="Card-link"
                    >
                        <FaDownload
                            className="Icon Icon--small"
                            aria-hidden="true"
                        />
                        {` ${material.title}`}
                    </a>
                </h4>

                <div className="Card-body">
                    {material.description && (
                        <p className="u-mb-none">{material.description}</p>
                    )}

                    <AuthorizedContent object={material} action="update">
                        <p className="u-mb-none">
                            {isPublic ? (
                                <FaEye className="Icon Icon--small" />
                            ) : (
                                <FaEyeSlash className="Icon Icon--small" />
                            )}
                            {` ${fileInfo}`}
                        </p>
                        <MaterialAdminButtons material={material} />
                    </AuthorizedContent>
                </div>
            </article>
        </li>
    );
}

Material.propTypes = {
    material: PropTypes.shape({
        id: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        size_human: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        workflow_state: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
};
