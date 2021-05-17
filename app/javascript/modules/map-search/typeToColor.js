export default function typeToColor(typeId) {
    const colors = [
        '#001427',
        '#708d81',
        '#f4d58d',
        '#bf0603',
        '#8d0801',
    ];

    return colors[typeId % colors.length];
}
