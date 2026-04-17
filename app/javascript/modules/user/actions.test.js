import { Loader } from 'modules/api';

import {
    CLEAR_REGISTRATION_STATUS,
    REGISTER,
    REGISTER_ERROR,
} from './action-types';
import { submitRegister } from './actions';
import userReducer from './reducer';

jest.mock('modules/api', () => ({
    Loader: {
        post: jest.fn(),
    },
}));

describe('user registration error flow', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('dispatches REGISTER and REGISTER_ERROR when registration fails', async () => {
        Loader.post.mockImplementation(
            (_, __, dispatch, ___, errorCallback) => {
                dispatch(
                    errorCallback({
                        status: 422,
                        error: 'Email has already been taken',
                    })
                );
            }
        );

        const dispatch = jest.fn();

        await submitRegister('/users', {
            user: { email: 'existing@example.org' },
        })(dispatch);

        expect(dispatch).toHaveBeenNthCalledWith(1, { type: REGISTER });
        expect(dispatch).toHaveBeenNthCalledWith(2, {
            type: REGISTER_ERROR,
            registrationStatus: 'Email has already been taken',
        });
    });

    it('stores and clears registrationStatus in reducer', () => {
        const afterRegisterStart = userReducer(undefined, { type: REGISTER });
        const afterRegisterError = userReducer(afterRegisterStart, {
            type: REGISTER_ERROR,
            registrationStatus: 'Email has already been taken',
        });
        const afterClear = userReducer(afterRegisterError, {
            type: CLEAR_REGISTRATION_STATUS,
        });

        expect(afterRegisterError.isRegistering).toBe(false);
        expect(afterRegisterError.registered).toBe(false);
        expect(afterRegisterError.registrationStatus).toBe(
            'Email has already been taken'
        );
        expect(afterClear.registrationStatus).toBe(null);
    });
});
