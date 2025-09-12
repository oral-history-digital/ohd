import { DEFAULT_PLAYER_SIZE } from '../constants';
import { getScreenSize } from './getScreenSize';

export function getDefaultPlayerSize() {
    const screenSize = getScreenSize();
    return DEFAULT_PLAYER_SIZE[screenSize] || 'medium';
}
