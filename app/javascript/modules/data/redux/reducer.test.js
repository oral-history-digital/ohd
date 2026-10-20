import { LOGOUT } from '../../user/action-types';
import { receiveData, replaceInstanceSettings } from './actions';
import { dataReducer } from './reducer';

test('replaces shared instance settings', () => {
    const instanceSettings = { breadcrumb_logo_url: '/logos/current.svg' };

    const state = dataReducer(
        { instance_settings: { breadcrumb_logo_url: '/logos/old.svg' } },
        replaceInstanceSettings(instanceSettings)
    );

    expect(state.instance_settings).toEqual(instanceSettings);
});

test.each([
    ['confirmed logout', { type: LOGOUT }],
    [
        'anonymous account response',
        receiveData({ data_type: 'users', id: 'current', data: null }),
    ],
])(
    '%s clears cached accounts without creating an empty current-user record',
    (_label, action) => {
        const base = dataReducer(undefined, {});
        const initial = {
            ...base,
            users: {
                current: { id: 2, webauthn_credentials: [] },
                3: { id: 3 },
            },
            statuses: { ...base.statuses, users: { current: 'reload' } },
        };
        const state = dataReducer(initial, action);
        expect(state.users).toEqual({ current: null });
        expect(state.statuses.users).not.toHaveProperty('current');
    }
);
