const libs = {
    portal: require("/lib/xp/portal"),
    common: require("/lib/project/common"),
    content: require("/lib/xp/content")
};
const setQueryString = (path, queryString) => {
    let query = `_parentPath LIKE '*/content${path}'`;
    if (queryString) {
        query += `AND (fulltext("_allText", "${queryString}~2", "AND") OR ngram('_allText', "${queryString}~2", 'AND'))`;
    }
    return query;
};
const getForms = (path, queryString, start, count) => {
    const query = setQueryString(path, queryString);
    return libs.content.query({
        query: query,
        start: start,
        count: count
    });
};
exports.get = (req) => {
    const params = libs.common.sanitizeParams(req.params);
    const start = params.start ? parseInt(params.start) : 0;
    const count = params.count ? parseInt(params.count) : 10;
    const queryString = params.query ? params.query : "";
    let siteConfig = libs.portal.getSite();
    if (!siteConfig) {
        return {
            status: 409,
            body: {
                status: 409,
                message: "Lagre og last inn siden på nytt for å velge skjema."
            },
            contentType: "application/json"
        };
    }
    siteConfig = siteConfig.data.siteConfig.config;
    const formsFolder = siteConfig.formFolder || "";
    if (formsFolder) {
        const formsFolderPath = libs.content.get({ key: formsFolder })._path;
        const forms = getForms(formsFolderPath, queryString, start, count);
        const processedForms = forms.hits.map((form) => {
            const _form = form;
            _form.id = form._id;
            _form.displayName = form.displayName;
            _form.description = " ";
            _form.formUrl = libs.portal.attachmentUrl({ id: form._id });
            return _form;
        });
        return {
            body: {
                total: forms.total,
                start: start,
                count: count,
                hits: processedForms
            },
            contentType: "application/json"
        };
    }
    return {
        body: {
            total: 0,
            start: 0,
            count: 0,
            hits: []
        },
        contentType: "application/json"
    };
};
