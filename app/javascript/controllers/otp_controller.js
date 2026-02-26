import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['digit', 'hidden', 'form'];

    connect() {
        this.digitTargets[0].focus();
    }

    handleInput(event) {
        const input = event.target;
        const index = parseInt(input.dataset.index);
        const value = input.value;

        // Only allow numbers
        if (value && !/^[0-9]$/.test(value)) {
            input.value = '';
            return;
        }

        // Move to next input
        if (value && index < this.digitTargets.length - 1) {
            this.digitTargets[index + 1].focus();
        }

        this.updateOTP();
    }

    handleKeydown(event) {
        const input = event.target;
        const index = parseInt(input.dataset.index);

        if (event.key === 'Backspace' && !input.value && index > 0) {
            this.digitTargets[index - 1].focus();
            this.digitTargets[index - 1].value = '';
            this.updateOTP();
        } else if (event.key === 'ArrowLeft' && index > 0) {
            this.digitTargets[index - 1].focus();
        } else if (
            event.key === 'ArrowRight' &&
            index < this.digitTargets.length - 1
        ) {
            this.digitTargets[index + 1].focus();
        }
    }

    handlePaste(event) {
        event.preventDefault();
        const pastedData = event.clipboardData.getData('text').slice(0, 6);

        if (/^[0-9]+$/.test(pastedData)) {
            pastedData.split('').forEach((char, i) => {
                if (this.digitTargets[i]) {
                    this.digitTargets[i].value = char;
                }
            });

            const lastIndex = Math.min(
                pastedData.length,
                this.digitTargets.length - 1
            );
            this.digitTargets[lastIndex].focus();

            this.updateOTP();
        }
    }

    updateOTP() {
        const otp = this.digitTargets.map((input) => input.value).join('');
        this.hiddenTarget.value = otp;

        if (otp.length === 6) {
            setTimeout(() => {
                this.formTarget.requestSubmit();
            }, 200);
        }
    }
}
