import PropTypes from 'prop-types';
import { FaEye, FaEyeSlash, FaDownload } from 'react-icons/fa';

import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import PDFAdminButtons from './PDFAdminButtons';

export default function PDFMaterial({ pdf }) {
    const { t } = useI18n();
    const isPublic = pdf.workflow_state === 'public';
    const fileInfo = `${pdf.filename} (${pdf.size_human})`;

    return (
        <li className="Card">
            <article className="Card-inner">
                <h4 className="Card-title u-mt-none u-mb-none">
                    <a
                        href={pdf.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${t('download')}: ${pdf.title}`}
                        className="Card-link"
                    >
                        <FaDownload
                            className="Icon Icon--small"
                            aria-hidden="true"
                        />
                        {` ${pdf.title}`}
                    </a>
                </h4>

                <div className="Card-body">
                    {pdf.description && (
                        <p className="u-mb-none">
                            {pdf.description}
                        </p>
                    )}

                    <AuthorizedContent object={pdf} action="update">
                        <p className="u-mb-none">
                            {isPublic
                                ? <FaEye className="Icon Icon--small" />
                                : <FaEyeSlash className="Icon Icon--small" />
                            }
                            {` ${fileInfo}`}
                        </p>
                        <PDFAdminButtons pdf={pdf} />
                    </AuthorizedContent>
                </div>
            </article>
        </li>
    );
}

PDFMaterial.propTypes = {
    pdf: PropTypes.shape({
        id: PropTypes.number.isRequired,
        path: PropTypes.string.isRequired,
        filename: PropTypes.string.isRequired,
        size_human: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        workflow_state: PropTypes.string.isRequired,
        description: PropTypes.string,
    }).isRequired,
};
