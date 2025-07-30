import PropTypes from 'prop-types';
import { useI18n } from 'modules/i18n';
import PDFAdminButtons from './PDFAdminButtons';

export default function PDFMaterial({ pdf }) {
    const { t, locale } = useI18n();

    console.log(pdf)

    return (
        <li key={pdf.id} className="Card">
            <h4 className="Card-title u-mt-none u-mb-none">
                {pdf.titles[locale] || pdf.titles["de"]}
            </h4>
            <div className="Card-body">
                <p className="u-mb-none">{pdf.language}</p>
                <p className="u-mb-none">
                    <a href={pdf.path} target="_blank" rel="noreferrer">
                        {pdf.filename}
                    </a>
                </p>
            </div>
            <PDFAdminButtons pdf={pdf} />
        </li>
    );
}

PDFMaterial.propTypes = {
    pdf: PropTypes.object.isRequired,
};
