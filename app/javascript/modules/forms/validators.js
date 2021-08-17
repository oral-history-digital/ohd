export function validateTapeNumber(v) {
    const number = /^\d{1,2}$/;
    return number.test(v);
}

export function validateColor(v) {
    const color = /^#[0-9,a-f,A-F]{6}$/;
    return color.test(v);
}
