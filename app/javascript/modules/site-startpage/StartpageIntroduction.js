import classNames from 'classnames';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import PropTypes from 'prop-types';
import { FaList, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import useCatalogStats from './useCatalogStats';

export default function StartpageIntroduction({ className }) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { data: stats, error, isLoading } = useCatalogStats();

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <p>{error.message}</p>;
    }

    const introductionHtml = `${t('modules.site_startpage.introduction.text1')}
${stats?.num_projects} ${t('modules.site_startpage.introduction.text2')}
${stats?.num_collections} ${t('modules.site_startpage.introduction.text3')}
${stats?.num_interviews} ${t('modules.site_startpage.introduction.text4')}
${stats?.num_institutions} ${t('modules.site_startpage.introduction.text5')}`;

    return (
        <article className={classNames(className, 'Startpage')}>
            <p dangerouslySetInnerHTML={{ __html: introductionHtml }} />

            <div className="u-mt-large">
                <section>
                    <div className="Startpage-headingGroup">
                        <div className="Media">
                            <Link
                                to={`${pathBase}/searches/archive`}
                                className="Media-img"
                            >
                                <FaSearch className="Startpage-icon" />
                            </Link>
                            <div className="Media-body">
                                <h3 className="Startpage-heading u-mt-none">
                                    {t('modules.site_startpage.search.heading')}
                                </h3>
                                <p>
                                    {t('modules.site_startpage.search.text1')}{' '}
                                    <Link to={`${pathBase}/searches/archive`}>
                                        {t(
                                            'modules.site_startpage.search.text2'
                                        )}
                                    </Link>{' '}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                'modules.site_startpage.search.text3'
                                            ),
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="u-mt-large">
                    <div className="Startpage-headingGroup">
                        <div className="Media">
                            <Link
                                to={`${pathBase}/catalog`}
                                className="Media-img"
                            >
                                <FaList className="Startpage-icon" />
                            </Link>
                            <div className="Media-body">
                                <h3 className="Startpage-heading u-mt-none">
                                    {t(
                                        'modules.site_startpage.catalog.heading'
                                    )}
                                </h3>
                                <p>
                                    {t('modules.site_startpage.catalog.text1')}{' '}
                                    <Link to={`${pathBase}/catalog`}>
                                        {t(
                                            'modules.site_startpage.catalog.text2'
                                        )}
                                    </Link>{' '}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: t(
                                                'modules.site_startpage.catalog.text3'
                                            ),
                                        }}
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="u-mt-large">
                    <div className="Media">
                        <div className="Media-img">
                            <FaUserCircle className="Startpage-icon" />
                        </div>
                        <div className="Media-body">
                            <h3 className="Startpage-heading u-mt-none">
                                {t('modules.site_startpage.access.heading')}
                            </h3>
                            <p>{t('modules.site_startpage.access.text')}</p>
                        </div>
                    </div>
                </section>
            </div>
        </article>
    );
}

StartpageIntroduction.propTypes = {
    className: PropTypes.string,
};
