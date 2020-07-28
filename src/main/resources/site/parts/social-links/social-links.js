const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");

    const config = libs.portal.getComponent().config
    const items = (config.items) ? ((!config.items.length) ? [ config.items ] : config.items) : []
    const data = {
        title: config.text,
        backgroundColor: config.color,
        newTab: config.newTab,
        items: items.map((item) => ({
            icon: libs.portal.imageUrl({
                id: item.icon,
                scale: 'block(60,60)'
            }),
            href: item.href,
            text: item.text
        }))
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("social-links.ftl");
    const body = libs.freemarker.render(view, model);

    const socialLinksCss = libs.portal.assetUrl({ path: "css/socialLinks.css" });
    const socialLinksCssContribution = `<link rel="preload" href="${socialLinksCss}" as="style"><link rel="stylesheet" href="${socialLinksCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/socialLinksVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [socialLinksCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
