import { deleteData } from 'modules/data';
import { usePathBase } from 'modules/routes';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

/**
 * Lists account passkeys and deletes them through the current project/locale route.
 * @param {Object} props - Account properties.
 * @param {Object} [props.user] - Current account and its WebAuthn credentials.
 * @returns {React.ReactElement|null} Passkey controls, or nothing without an account.
 */
const Passkeys = ({ user }) => {
    const dispatch = useDispatch();
    const pathBase = usePathBase();

    if (!user) return null;

    const handleDelete = (passkeyId) => {
        dispatch(deleteData({ pathBase }, 'passkeys', passkeyId));
    };

    return (
        <div>
            <h2>Passkeys</h2>
            {(user.webauthn_credentials || []).map((passkey) => (
                <div key={passkey.id}>
                    <h3>{passkey.nickname}</h3>
                    <button
                        type="button"
                        onClick={() => handleDelete(passkey.id)}
                        className="btn btn-danger"
                    >
                        Delete Passkey
                    </button>
                </div>
            ))}
        </div>
    );
};

Passkeys.propTypes = { user: PropTypes.object };

export default Passkeys;
