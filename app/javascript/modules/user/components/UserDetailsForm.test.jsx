import { render } from '@testing-library/react';
import { Form } from 'modules/forms';

import UserDetailsForm from './UserDetailsForm';

jest.mock('modules/forms', () => ({ Form: jest.fn(() => null) }));

describe('UserDetailsForm email changes', () => {
    let props;

    beforeEach(() => {
        props = {
            user: { id: 1, email: 'old@example.com', unconfirmed_email: null },
            locale: 'en',
            project: { id: 42 },
            projectId: 'archive',
            submitData: jest.fn(),
            onSubmit: jest.fn(),
            onCancel: jest.fn(),
            onEmailChange: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    function submit() {
        render(<UserDetailsForm {...props} />);
        Form.mock.calls[0][0].onSubmit({
            user: { id: 1, email: 'new@example.com' },
        });
        return props.submitData.mock.calls[0][3];
    }

    it('shows the email popup only after a successful new pending change', () => {
        const callback = submit();
        expect(props.onEmailChange).not.toHaveBeenCalled();
        expect(props.onSubmit).not.toHaveBeenCalled();
        callback({ data: { unconfirmed_email: 'new@example.com' } });
        expect(props.onEmailChange).toHaveBeenCalledTimes(1);
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('does not show the popup for an unchanged pending address', () => {
        props.user.unconfirmed_email = 'new@example.com';
        submit()({ data: { unconfirmed_email: 'new@example.com' } });
        expect(props.onEmailChange).not.toHaveBeenCalled();
    });

    it('does not show the popup for a save without a pending change', () => {
        submit()({ data: { unconfirmed_email: null } });
        expect(props.onEmailChange).not.toHaveBeenCalled();
    });
});
