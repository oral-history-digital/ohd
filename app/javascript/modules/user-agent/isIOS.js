export default function isIOS() {
    // detect if user agent is iOS in order to exclude it from having a datalist
    // https://stackoverflow.com/a/9039885
    let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    return iOS;
}
