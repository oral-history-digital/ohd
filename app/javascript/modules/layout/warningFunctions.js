import { SHOW_SYSTEM_WARNING } from 'modules/constants';
import { loadSessionState, saveSessionState } from 'modules/persistence';

export function warningShouldBeShown() {
    return SHOW_SYSTEM_WARNING
        && !loadSessionState('hideWarning');
}

export function doNotShowWarningAgain() {
    saveSessionState('hideWarning', true);
}
