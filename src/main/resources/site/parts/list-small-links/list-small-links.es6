const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const config = libs.portal.getComponent().config
    const links = (config.links) ? ((!config.links.length) ? [ config.links ] : config.links) : []
    const mapLinks = function (links) {
        const mapped = links.map((link) => {

            const isExternal = (link.linkType["_selected"] === "external")
            const external = link.linkType.external
            const internal = link.linkType.internal

            return {
                title: link.title,
                icon: libs.portal.assetUrl({
                    path: isExternal ? "images/external.svg" : "images/arrow-right.svg"
                }),
                href: isExternal ? external.url : libs.portal.pageUrl({
                    id: internal.id
                }) + (internal.anchor.length > 0) ? `#${internal.anchor}` : "",
                newTab: isExternal ? external.newTab : false
            }
        });
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
