const regexp =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

export default function parseTextWithUrls(text) {
    const textToParse = text || '';
    const parsedText = [];
    let cursor = 0;
    let execResult = regexp.exec(textToParse);

    while (execResult) {
        if (cursor < execResult.index) {
            parsedText.push(textToParse.slice(cursor, execResult.index));
        }
        parsedText.push(textToParse.slice(execResult.index, regexp.lastIndex));
        cursor = regexp.lastIndex;
        execResult = regexp.exec(textToParse);
    }

    if (cursor < textToParse.length) {
        parsedText.push(textToParse.slice(cursor));
    }

    return parsedText;
}
