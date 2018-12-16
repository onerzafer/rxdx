export function readLocal(key, defaultVal) {
    const localString = localStorage.getItem(key);
    return localString ? JSON.parse(localString) : defaultVal || undefined;
}

export function writeLocal(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
}