import { useI18n } from 'modules/i18n';
import { CopyText } from 'modules/ui';
import { formatCollectionCitation, formatProjectCitation } from 'modules/utils';
import PropTypes from 'prop-types';

export function Citation({
    type,
    institutions,
    primary_institution,
    projectName,
    projectId,
    collectionName,
    collectionId,
    doi,
    doiUrl,
}) {
    const { t, locale } = useI18n();

    const origin =
        typeof window === 'undefined' ? undefined : window.location.origin;

    const displayInstitutions = primary_institution
        ? institutions.filter((inst) => inst.id === primary_institution)
        : institutions;

    const citation =
        type === 'collection'
            ? formatCollectionCitation({
                  institutions: displayInstitutions,
                  projectName,
                  collectionName,
                  collectionId,
                  locale,
                  origin,
                  doi,
                  doiUrl,
                  t,
              })
            : formatProjectCitation({
                  institutions: displayInstitutions,
                  projectName,
                  projectId,
                  locale,
                  origin,
                  doi,
                  doiUrl,
              });

    if (!citation) return null;

    return (
        <div className="DescriptionList-group DescriptionList-group--citation">
            <dt className="DescriptionList-term">{t('citation')}</dt>
            <dd className="DescriptionList-description">
                <span className="flyout-content-data">
                    {citation}{' '}
                    <CopyText
                        iconClassName="Icon--primary"
                        text={citation}
                        title={t('modules.workbook.copy_citation')}
                    />
                </span>
            </dd>
        </div>
    );
}

Citation.propTypes = {
    type: PropTypes.oneOf(['project', 'collection']).isRequired,
    institutions: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            parent: PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            }),
            is_primary: PropTypes.bool,
        })
    ),
    primary_institution: PropTypes.number,
    projectName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    collectionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    collectionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    doi: PropTypes.string,
    doiUrl: PropTypes.string,
};

export default Citation;
