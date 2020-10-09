const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;;

    const config = libs.portal.getComponent().config
    const items = [].concat(config.items || []);
    const data = {
        title: config.text,
        backgroundColor: config.color || "",
        newTab: config.newTab,
        items: items.map((item) => ({
            icon: libs.portal.imageUrl({
                id: item.icon,
                scale: 'block(20,20)'
            }),
            href: item.href,
            text: item.text
        }))
    }
    const view = resolve("social-links.ftl");
    const body = libs.freemarker.render(view, data);

    const socialLinksCss = libs.portal.assetUrl({ path: "css/social-links.css" });
    const socialLinksCssContribution = `<link rel="preload" href="${socialLinksCss}" as="style"><link rel="stylesheet" href="${socialLinksCss}">`;

    return {
        body: body,
        pageContributions: {
            headEnd: [socialLinksCssContribution]
        }
    };
};
