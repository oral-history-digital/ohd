import { useI18n } from 'modules/i18n';
import { CopyText } from 'modules/ui';
import { formatCollectionCitation, formatProjectCitation } from 'modules/utils';
import PropTypes from 'prop-types';

export function Citation({
    type,
    institutions,
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

    const citation =
        type === 'collection'
            ? formatCollectionCitation({
                  institutions,
                  projectName,
                  collectionName,
                  collectionId,
                  locale,
                  origin,
                  doi,
                  doiUrl,
              })
            : formatProjectCitation({
                  institutions,
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
    institutions: PropTypes.oneOfType([
        PropTypes.shape({
            name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        }),
        PropTypes.arrayOf(
            PropTypes.shape({
                name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
            })
        ),
    ]),
    projectName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    projectId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    collectionName: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    collectionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    doi: PropTypes.string,
    doiUrl: PropTypes.string,
};

export default Citation;
