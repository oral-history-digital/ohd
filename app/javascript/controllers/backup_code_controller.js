import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['input'];

    show(event) {
        event.preventDefault();
        document.getElementById('otp-section').style.display = 'none';
        document.getElementById('backup-code-section').style.display = 'block';
        if (this.hasInputTarget) {
            this.inputTarget.focus();
        }
    }

    hide(event) {
        event.preventDefault();
        document.getElementById('backup-code-section').style.display = 'none';
        document.getElementById('otp-section').style.display = 'block';
        const firstDigit = document.querySelector('.otp-digit');
        if (firstDigit) {
            firstDigit.focus();
        }
    }

    showAndResend(event) {
        event.preventDefault();
        // Show the backup code section first
        document.getElementById('otp-section').style.display = 'none';
        document.getElementById('backup-code-section').style.display = 'block';
        if (this.hasInputTarget) {
            this.inputTarget.focus();
        }
    }
}
