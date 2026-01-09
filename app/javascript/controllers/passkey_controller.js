import { create, get } from '@github/webauthn-json';
import { Controller } from '@hotwired/stimulus';

import { alertMessage } from '../utils/alert';
import { getCsrfToken } from '../utils/csrfToken';

export default class extends Controller {
    static targets = ['email'];

    static values = {
        noPasskeysFound: String,
        emailMissing: String,
    };

    async register(event) {
        event.preventDefault();
        const registrationUrl = '/de/passkeys/new';
        const verificationUrl = '/de/passkeys';

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

            alertMessage('Passkey added successfully!', 'success');
        } catch (error) {
            alertMessage(error.message);
        }
    }

    async authenticate(event) {
        event.preventDefault();
        const challengeUrl = '/de/passkey_login/challenge';
        const verificationUrl = '/de/passkey_login/verify';

        const email = this.hasEmailTarget ? this.emailTarget.value : null;

        if (!email) {
            alertMessage(this.emailMissingValue);
            return;
        }

        try {
            // Step 1: Get challenge from server
            const challengeResponse = await fetch(challengeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                csrfToken: getCsrfToken(),
                body: JSON.stringify({ email }),
            });

            if (!challengeResponse.ok) {
                throw new Error(this.noPasskeysFoundValue);
            }

            const options = await challengeResponse.json();

            // Step 2: Get credential using webauthn-json (handles all conversions!)
            const credential = await get({ publicKey: options });

            // Step 3: Send to server for verification
            const verifyResponse = await fetch(verificationUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                csrfToken: getCsrfToken(),
                body: JSON.stringify({ credential: credential }), // Send the whole credential object
            });

            const result = await verifyResponse.json();

            if (result.success) {
                window.location.href = result.redirect_url;
            }
        } catch (error) {
            alertMessage(error.message);
        }
    }
}
