export default function interviewUrl(pathBase, interviewId) {
    const protocol = window.location.protocol;
    const host = window.location.host;
    const url = `${protocol}//${host}${pathBase}/interviews/${interviewId}`;

    return url;
}
