const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");
    const toArray = function (e) {
        return [].concat(e || []);
    }
    const config = libs.portal.getComponent().config
    log.info(JSON.stringify(config));
    const data = {
        title: config.title,
        items: toArray(config.items).map((item) => ({
            title: item.title,
            text: item.text,
            decoration: (item.decoration) ? {
                icon: {
                    src: libs.portal.imageUrl({
                        id: item.decoration.icon,
                        scale: "block(90, 90)",
                        quality: "70"
                    })
                },
                caption: item.decoration.caption
            } : undefined
        }))
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("media-player.ftl");
    const body = libs.freemarker.render(view, model);
    const mediaPlayerCss = libs.portal.assetUrl({ path: "css/media-player.css" });
    const mediaPlayerCssContribution = `<link rel="preload" href="${mediaPlayerCss}" as="style"><link rel="stylesheet" href="${mediaPlayerCss}">`;
    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/mediaPlayerVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [mediaPlayerCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
