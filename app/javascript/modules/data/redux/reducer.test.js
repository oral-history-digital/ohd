import { replaceInstanceSettings } from './actions';
import { dataReducer } from './reducer';

test('replaces shared instance settings', () => {
    const instanceSettings = { breadcrumb_logo_url: '/logos/current.svg' };

    const state = dataReducer(
        { instance_settings: { breadcrumb_logo_url: '/logos/old.svg' } },
        replaceInstanceSettings(instanceSettings)
    );

    expect(state.instance_settings).toEqual(instanceSettings);
});
