const Passkeys = ({ user }) => {
    const handleDelete = (passkeyId) => {
        // Implement the delete functionality here
        console.log(`Delete passkey with ID: ${passkeyId}`);
    };

    console.log('User passkeys:', user.passkeys);
    console.log('user: ', user);
    return (
        <div>
            <h2>Passkeys</h2>
            {user.passkeys.map((passkey) => (
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
