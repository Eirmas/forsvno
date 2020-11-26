const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const config = libs.portal.getComponent().config
    const links = [].concat(config.links || []);
    const mapLinks = function (links) {
        const mapped = links.map((link) => {
            const linkType = link.linkType;
            const isExternal = (linkType["_selected"] === "external");
            const external = linkType.external || false;
            const internal = linkType.internal || false;
            const href = (isExternal) ? external.url : libs.portal.pageUrl({ id: internal.id });
            const anchor = (!isExternal) ? `${internal.anchor || ""}` : "";
            return {
                title: link.title || "",
                icon: libs.portal.assetUrl({
                    path: (isExternal) ? "images/external.svg" : "images/arrow-right.svg"
                }),
                href: href,
                anchor: anchor,
                path: `${href}${(anchor) ? "#" : ""}${anchor}`,
                isSamePage: (!isExternal) ? libs.portal.getContent()["_id"] === internal.id : false,
                newTab: (isExternal) ? external.newTab : false
            }
        });
        const array = [];
        for (let i = 0; i < mapped.length; i += 3) {
            array.push(mapped.slice(i, i + 3))
        }
        return array;
    }
    log.info("Links: %s", { linkRows: mapLinks(links) })
    const view = resolve("list-small-links.ftl");
    const body = libs.freemarker.render(view, {
        linkRows: mapLinks(links),
        color: config.color || ""
    });

    const listSmallLinksCss = libs.portal.assetUrl({ path: "css/list-small-links.css" });
    const listSmallLinksCssContribution = `<link rel="preload" href="${listSmallLinksCss}" as="style"><link rel="stylesheet" href="${listSmallLinksCss}">`;
    const listSmallLinksJsContribution = `<script src="${libs.portal.assetUrl({ path: "js/listSmallLinks.js" })}" async></script>`;
    return {
        body: body,
        pageContributions: {
            headEnd: [listSmallLinksCssContribution],
            bodyEnd: [listSmallLinksJsContribution]
        }
    };
};
