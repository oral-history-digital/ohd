import { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { UserRegistrationSearchFormContainer } from 'modules/admin';
import { pathBase } from 'modules/routes';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import SubTab from './SubTab';

class UsersAdminTabPanel extends Component {
    static propTypes = {
        countryKeys: PropTypes.object.isRequired,
        locale: PropTypes.string.isRequired,
        translations: PropTypes.object.isRequired,
        projectId: PropTypes.string.isRequired,
        account: PropTypes.object.isRequired,
        editView: PropTypes.bool.isRequired,
    }

    constructor(props) {
        super(props);

        this.state = { selectedCountries: [] };

        this.onCountrySelectorChange = this.onCountrySelectorChange.bind(this);
    }

    countryKeys() {
        const { locale, translations } = this.props;

        let countryKeys = [];
        this.props.countryKeys[locale].map((x, i) => {
            countryKeys[i] = {'label': translations[locale]["countries"][x], 'value': x}
        })
        return countryKeys;
    }

    userStatisticsPath() {
        let path = `${pathBase(this.props)}/admin/user_statistics.csv`;
        if (this.state.selectedCountries.length > 0) {
            path = path + "?countries[]="
            path = path + this.state.selectedCountries.join("&countries[]=")
        }
        return path;
    }

    onCountrySelectorChange(value) {
        let array = [];
        for(var o in value) {
            array.push(value[o]['value']);
        }
        this.setState({ selectedCountries: array });
    }

    render() {
        return admin(this.props, {type: 'General'}, 'edit') ?
            (<Fragment>
                <div className='flyout-tab-title'>
                    { t(this.props, 'edit.administration') }
                </div>
                <div className='flyout-sub-tabs-container'>
                    <SubTab
                        title='edit.users.admin'
                        url={`${pathBase(this.props)}/user_registrations`}
                        obj={{type: 'UserRegistration'}}
                        action='update'
                    >
                        <div>
                            <div>
                                <UserRegistrationSearchFormContainer/>
                                <a href={this.userStatisticsPath()}>
                                    <i className="fa fa-download flyout-content-ico" title={t(this.props, 'download_user_statistics')}></i>
                                    <span>{` ${t(this.props, 'download_user_statistics')}`}</span>
                                </a>
                            </div>
                            <Select
                                options={this.countryKeys()}
                                className="basic-multi-select"
                                isMulti
                                onChange={this.onCountrySelectorChange}
                                styles={{
                                    placeholder: (provided) => Object.assign(Object.assign({}, provided), { cursor: 'text' }),
                                    menu: (provided) => Object.assign(Object.assign({}, provided), { position: 'relative' }),
                                }}
                                placeholder="Statistik nach Ländern filtern (optional)"
                            />
                        </div>,
                    </SubTab>
                </div>
            </Fragment>) :
            null;
    }
}

export default UsersAdminTabPanel;
