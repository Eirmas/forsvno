const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const config = libs.portal.getComponent().config
    const links = (config.links) ? ((!config.links.length) ? [ config.links ] : config.links) : []
    const mapLinks = function (links) {
        const mapped = links.map((link) => ({
            title: link.title,
            icon: libs.portal.assetUrl({
                path: (link.linkType["_selected"] === "external") ? "images/external.svg" : "images/arrow-right.svg"
            }),
            href: (link.linkType["_selected"] === "external") ? link.linkType.external.url : libs.portal.pageUrl({
                id: link.linkType.internal.id
            }) + (link.linkType.internal.anchor && link.linkType.internal.anchor.length > 0) ? `#${link.linkType.internal.anchor}` : "",
            newTab: (link.linkType["_selected"] === "external") ? link.linkType.external.newTab : false
        }));
        const array = [];
        for (let i = 0; i < mapped.length; i += 3) {
            array.push([ ...mapped.slice(i, i + 3) ])
        }
        return array;
    }
    const view = resolve("list-small-links.ftl");
    const body = libs.freemarker.render(view, {
        linkRows: mapLinks(links),
        color: (config.color) ? config.color : ''
    });

    const listSmallLinksCss = libs.portal.assetUrl({ path: "css/list-small-links.css" });
    const listSmallLinksCssContribution = `<link rel="preload" href="${listSmallLinksCss}" as="style"><link rel="stylesheet" href="${listSmallLinksCss}">`;

    return {
        body: body,
        pageContributions: {
            headEnd: [listSmallLinksCssContribution]
        }
    };
};
