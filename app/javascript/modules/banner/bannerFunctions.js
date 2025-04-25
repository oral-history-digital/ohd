import { loadSessionState, saveSessionState } from 'modules/persistence';

export function bannerHasNotBeenHiddenByUser() {
    return !loadSessionState('hideBanner');
}

export function doNotShowBannerAgainThisSession() {
    saveSessionState('hideBanner', true);
}
