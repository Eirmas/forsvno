const portal = require('/lib/xp/portal')
const thymeleaf = require('/lib/thymeleaf')

exports.get = (req) => {
    const component = portal.getComponent()
    const view = resolve('divider.html');
    return {
        body: thymeleaf.render(view, {
            leftRegion: component.regions.left,
            rightRegion: component.regions.right
        })
    };
};
