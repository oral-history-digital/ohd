import { useState } from 'react';

import { getCountryKeys } from 'modules/archive';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { getCurrentProject } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { Helmet } from 'react-helmet';
import { FaDownload } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Select from 'react-select';

export default function StatisticsAdminPage() {
    const { t, locale } = useI18n();
    const pathBase = usePathBase();
    const project = useSelector(getCurrentProject);
    const countryKeys = useSelector(getCountryKeys);
    const [selectedCountries, setSelectedCountries] = useState([]);

    function countryKeyOptions() {
        return (countryKeys[locale] || []).map((x) => ({
            label: t(`countries.${x}`),
            value: x,
        }));
    }

    function userStatisticsPath() {
        let path = `${pathBase}/admin/user_statistics.csv`;
        if (selectedCountries.length > 0) {
            path = path + '?countries[]=';
            path = path + selectedCountries.join('&countries[]=');
        }
        return path;
    }

    function onCountrySelectorChange(value) {
        let array = [];
        for (var o in value) {
            array.push(value[o].value);
        }
        setSelectedCountries(array);
    }

    return (
        <div className="wrapper-content StatisticsAdminPage">
            <Helmet>
                <title>{t('edit.statistics.title')}</title>
            </Helmet>

            <AuthShowContainer hasProjectAccess>
                <AuthorizedContent object={{ type: 'User' }} action="update">
                    <h1 className="Page-main-title">
                        {t('edit.statistics.title')}
                    </h1>
                    <div className="StatisticsAdminPage-userStatsRow u-mt">
                        <div className="StatisticsAdminPage-userStatsLink">
                            <a href={userStatisticsPath()}>
                                <FaDownload
                                    className="Icon Icon--primary"
                                    title={t('download_user_statistics')}
                                />{' '}
                                {t('download_user_statistics')}
                            </a>
                        </div>

                        <div className="StatisticsAdminPage-userStatsFilter">
                            <Select
                                options={countryKeyOptions()}
                                className="basic-multi-select"
                                isMulti
                                onChange={onCountrySelectorChange}
                                styles={{
                                    placeholder: (provided) => ({
                                        ...provided,
                                        cursor: 'text',
                                    }),
                                }}
                                placeholder={t('filter_by_countries')}
                            />
                        </div>
                    </div>

                    <div className="u-mt">
                        <a href={`${pathBase}/admin/interview_statistics.csv`}>
                            <FaDownload
                                className="Icon Icon--primary"
                                title={t('download_interview_statistics')}
                            />{' '}
                            {t('download_interview_statistics')}
                        </a>
                    </div>

                    {project?.has_newsletter && (
                        <div className="u-mt">
                            <a
                                href={`${pathBase}/users/newsletter_recipients.csv`}
                            >
                                <FaDownload
                                    className="Icon Icon--primary"
                                    title={t('download_newsletter_recipients')}
                                />{' '}
                                {t('download_newsletter_recipients')}
                            </a>
                        </div>
                    )}
                </AuthorizedContent>
            </AuthShowContainer>

            <AuthShowContainer ifLoggedOut ifNoProject>
                {t('devise.failure.unauthenticated')}
            </AuthShowContainer>
        </div>
    );
}
