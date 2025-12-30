import { get } from '@github/webauthn-json';
import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['email'];

    async authenticate(event) {
        event.preventDefault();

        const email = this.hasEmailTarget ? this.emailTarget.value : null;

        if (!email) {
            alert('Please enter your email address first');
            return;
        }

        try {
            // Step 1: Get challenge from server
            const challengeResponse = await fetch(
                '/de/passkey_login/challenge',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': document.querySelector(
                            '[name="csrf-token"]'
                        ).content,
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (!challengeResponse.ok) {
                throw new Error('No passkeys found for this account');
            }

            const options = await challengeResponse.json();

            // Step 2: Get credential using webauthn-json (handles all conversions!)
            const credential = await get({ publicKey: options });

            // Step 3: Send to server for verification
            const verifyResponse = await fetch('/de/passkey_login/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': document.querySelector(
                        '[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({ credential: credential }), // Send the whole credential object
            });

            const result = await verifyResponse.json();
            if (result.success) {
                window.location.href = result.redirect_url;
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to authenticate:  ' + error.message);
        }
    }
}
