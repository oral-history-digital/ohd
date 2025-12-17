import { useState } from 'react';

import { create } from '@github/webauthn-json';

const PasskeyRegistration = ({
    registrationUrl = '/de/passkeys/new',
    verificationUrl = '/de/passkeys',
    onSuccess,
    onError,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.content : '';
    };

    const handleRegisterPasskey = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            // Check if WebAuthn is supported
            if (!window.PublicKeyCredential) {
                throw new Error('WebAuthn is not supported in this browser');
            }

            // Step 1: Get registration options from the server
            const optionsResponse = await fetch(registrationUrl, {
                headers: { Accept: 'application/json' },
                credentials: 'same-origin',
                csrfToken: getCsrfToken(),
            });

            if (!optionsResponse.ok) {
                throw new Error('Failed to get registration options');
            }

            const options = await optionsResponse.json();

            // Step 2: Create the credential (webauthn-json handles all conversions)
            const credential = await create({ publicKey: options });

            console.log('Created credential:', credential);
            // Step 3: Send the credential to the server for verification
            const verificationResponse = await fetch(verificationUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                csrfToken: getCsrfToken(),
                body: JSON.stringify({ credential: credential }),
            });

            if (!verificationResponse.ok) {
                const errorData = await verificationResponse.json();
                throw new Error(
                    errorData.error || 'Failed to verify credential'
                );
            }

            setSuccess(true);
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Passkey registration error:', err);
            setError(err.message || 'An error occurred during registration');
            if (onError) {
                onError(err);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="passkey-registration">
            <h2>Register Passkey</h2>
            <p>
                Create a passkey to sign in securely without a password. You can
                use your device's biometric authentication or security key.
            </p>

            {error && (
                <div className="alert alert-error" role="alert">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {success && (
                <div className="alert alert-success" role="alert">
                    <strong>Success! </strong> Your passkey has been registered
                    successfully.
                </div>
            )}

            <button
                onClick={handleRegisterPasskey}
                disabled={isLoading || success}
                className="btn btn-primary"
            >
                {isLoading ? 'Registering...' : 'Register Passkey'}
            </button>

            <style jsx>{`
                .passkey-registration {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                }

                h2 {
                    margin-bottom: 10px;
                    color: #333;
                }

                p {
                    margin-bottom: 20px;
                    color: #666;
                    line-height: 1.5;
                }

                .alert {
                    padding: 12px 16px;
                    margin-bottom: 20px;
                    border-radius: 4px;
                    border: 1px solid;
                }

                .alert-error {
                    background-color: #fee;
                    border-color: #fcc;
                    color: #c33;
                }

                .alert-success {
                    background-color: #efe;
                    border-color: #cfc;
                    color: #3c3;
                }

                . btn {
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                . btn-primary {
                    background-color: #007bff;
                    color: white;
                }

                .btn-primary:hover:not(:disabled) {
                    background-color: #0056b3;
                }

                . btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};

export default PasskeyRegistration;
