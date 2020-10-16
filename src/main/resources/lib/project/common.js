/**
 * Return sanitized query parameter
 * Removes <, >, ", ', *, ( and ), to avoid injections in query parameters
 * @param param String param from request
 * @returns {String}
 */
const sanitizeQueryParameter = param => param.replace(/<|>|"|'|\*|\(|\)/g, "");
exports.sanitizeQueryParameter = sanitizeQueryParameter;
/**
 * Return sanitized query parameters
 * Removes <, >, ", ', *, ( and ), to avoid injections in query parameters
 * @param params Object with params from req
 * @returns {Object}
 */
const sanitizeParams = (params) => {
    Object.keys(params).forEach((key) => {
        if (typeof params[key] === "string") {
            // eslint-disable-next-line no-param-reassign
            params[key] = sanitizeQueryParameter(params[key]);
        }
    });
    return params;
};
exports.sanitizeParams = sanitizeParams;
