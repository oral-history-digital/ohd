export default function camelCase(str) {
    let s = str.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
}
