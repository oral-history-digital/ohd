export default function interviewUrl(
    pathBase,
    interviewId,
    origin = window.location.origin
) {
    const url = `${origin}${pathBase}/interviews/${interviewId}`;

    return url;
}
