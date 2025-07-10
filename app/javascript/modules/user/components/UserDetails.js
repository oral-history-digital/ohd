import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

export default function UserDetails({ user }) {
    const { t } = useI18n();

    return (
        <>
            <div className="details box">
                {['first_name', 'last_name', 'email'].map((detail) => {
                    return (
                        <p className="detail" key={detail}>
                            <span className="name">
                                {t(`activerecord.attributes.user.${detail}`) +
                                    ': '}
                            </span>
                            <span className="content">{user[detail]}</span>
                        </p>
                    );
                })}
            </div>
        </>
    );
}

UserDetails.propTypes = {
    user: PropTypes.object.isRequired,
};
