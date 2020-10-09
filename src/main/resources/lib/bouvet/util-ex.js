/**
 * Force input to be an array.
 *
 * If the object we are forcing is undefined or null,
 * the returned array will be empty.
 *
 * @param {*} data Input data to convert to array
 * @returns Array containing input data
 *
 */
const forceArray = (data) => {
    /*
     * Nashorn doesn't support Number.isNaN(). We will simulate Number.isNaN() using
     * a typeof comparison combined with isNaN().
     */
    // eslint-disable-next-line no-restricted-globals
    if (data === undefined || data === null || (typeof data === "number" && isNaN(data))) return [];
    return Array.isArray(data) ? data : [data];
};
exports.forceArray = forceArray;
