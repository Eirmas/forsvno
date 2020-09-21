const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};
exports.macro = function (context) {
    const model = {
        text: context.params.text,
        link1text: context.params.link1text,
        link1href: context.params.link1href,
        link2text: context.params.link2text,
        link2href: context.params.link2href,
        icon: libs.portal.assetUrl({path: 'images/arrow-right.svg'})
    };
    return {
        body: libs.freemarker.render(resolve('list-activate.ftl'), model),
        pageContributions: {
            headEnd: [
                '<link rel="stylesheet" href="' + libs.portal.assetUrl({path: 'css/list-activate.css'}) + '"/>'
            ]
        }
    }
};
