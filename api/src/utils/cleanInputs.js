export const removeUndefined = (obj) => {
    if (obj) {
        obj = Object.fromEntries(
            Object.entries(obj).filter(([_, value]) => value !== undefined)
        );
        return obj;
    }
};
