export function normalizeRegisterErrorMessage(json) {
    if (typeof json?.error === 'string' && json.error.length > 0) {
        return json.error;
    }

    if (Array.isArray(json?.errors) && json.errors.length > 0) {
        return json.errors.join(', ');
    }

    if (json?.errors && typeof json.errors === 'object') {
        const messages = Object.values(json.errors).flat().filter(Boolean);
        if (messages.length > 0) {
            return messages.join(', ');
        }
    }

    return 'devise.failure.invalid';
}

export default normalizeRegisterErrorMessage;
