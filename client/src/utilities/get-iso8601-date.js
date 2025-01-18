export default function () {
    return new Date()
        .toISOString()
        .replace('T', '_')
        .replace(/\..+$/, '');
};
