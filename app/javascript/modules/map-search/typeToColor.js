const colors = [
    '#8f201c',
    '#8f7c1c',
    '#428f1c',
    '#1c8f8f',
    '#1c2d8f',
    '#7c1c8f',
];

export default function typeToColor(typeArray, typeId) {
    const index = typeArray.findIndex(type => type.id === typeId);

    return colors[index % colors.length];
}
