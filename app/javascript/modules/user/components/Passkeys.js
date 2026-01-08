import { deleteData } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useProject } from 'modules/routes';
import { useDispatch } from 'react-redux';

const Passkeys = ({ user }) => {
    const dispatch = useDispatch();
    const { t, locale } = useI18n();
    const { project, projectId } = useProject();

    const handleDelete = (passkeyId) => {
        dispatch(
            deleteData({ project, projectId, locale }, 'passkeys', passkeyId)
        );
    };

    return (
        <div>
            <h2>Passkeys</h2>
            {user?.webauthn_credentials?.map((passkey) => (
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

export default Passkeys;
