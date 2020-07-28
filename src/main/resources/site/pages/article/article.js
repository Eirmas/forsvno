const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')

exports.get = (req) => {
    const content = portal.getContent()
    const view = resolve('article.html');
    return {
        body: thymeleaf.render(view, {
            displayName: content.displayName,
            region: content.page.regions['main']
        })
    };
};
