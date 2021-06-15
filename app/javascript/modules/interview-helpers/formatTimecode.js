export default function formatTimecode(time) {
    const hours = Math.floor(time / 3600).toString();
    const minutes = Math.floor((time % 3600) / 60).toString();
    const seconds = Math.floor(time % 60).toString();

    const str = `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;

    return str;
}
