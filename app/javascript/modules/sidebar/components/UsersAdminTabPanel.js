import { useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { FaDownload } from 'react-icons/fa';

import { ErrorBoundary } from 'modules/react-toolbox';
import { UserSearchFormContainer } from 'modules/admin';
import { usePathBase } from 'modules/routes';
import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import AdminSubTab from './AdminSubTab';

export default function UsersAdminTabPanel({
    countryKeys,
    locale,
    translations,
}) {
    const { t } = useI18n();
    const { isAuthorized } = useAuthorization();
    const pathBase = usePathBase();

    const [selectedCountries, setSelectedCountries] = useState([]);

    function countryKeyOptions() {
        return countryKeys[locale].map(x => ({
            label: translations[locale]['countries'][x],
            value: x
        }));
    }

    function userStatisticsPath() {
        let path = `${pathBase}/admin/user_statistics.csv`;
        if (selectedCountries.length > 0) {
            path = path + "?countries[]="
            path = path + selectedCountries.join("&countries[]=")
        }
        return path;
    }

    function onCountrySelectorChange(value) {
        let array = [];
        for(var o in value) {
            array.push(value[o]['value']);
        }
        setSelectedCountries(array);
    }

    if (!isAuthorized({ type: 'General' }, 'edit')) {
        return null;
    }

    return (
        <ErrorBoundary small>
            <h3 className='SidebarTabs-title'>
                { t('edit.administration') }
            </h3>
            <div className='flyout-sub-tabs-container flyout-video'>
                <AdminSubTab
                    title='edit.users.admin'
                    url={`${pathBase}/users`}
                    obj={{type: 'User'}}
                    action='update'
                >
                    <div>
                        <div>
                            <UserSearchFormContainer/>
                            <a href={userStatisticsPath()}>
                                <FaDownload
                                    className="Icon Icon--primary"
                                    title={t('download_user_statistics')}
                                />
                                {' '}
                                {t('download_user_statistics')}
                            </a>
                        </div>
                        <Select
                            options={countryKeyOptions()}
                            className="basic-multi-select"
                            isMulti
                            onChange={onCountrySelectorChange}
                            styles={{
                                placeholder: provided => ({...provided, cursor: 'text'}),
                                menu: provided => ({...provided, position: 'relative'}),
                            }}
                            placeholder="Statistik nach Ländern filtern (optional)"
                        />
                    </div>
                </AdminSubTab>
            </div>
        </ErrorBoundary>
    );
}

UsersAdminTabPanel.propTypes = {
    countryKeys: PropTypes.object.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
}
