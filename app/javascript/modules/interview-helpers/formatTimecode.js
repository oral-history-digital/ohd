export default function formatTimecode(time, useHmsFormat = false) {
    const hours = Math.floor(time / 3600).toString();
    const minutes = Math.floor((time % 3600) / 60).toString();
    const seconds = Math.floor(time % 60).toString();

    let str;
    if (useHmsFormat) {
        str = `${hours}h${minutes.padStart(2, '0')}m${seconds.padStart(2, '0')}s`;
    } else {
        str = `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }

    return str;
}
