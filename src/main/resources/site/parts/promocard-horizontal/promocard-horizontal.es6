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
    const data = {
        title: config.title,
        icons: {
            arrow: libs.portal.assetUrl({ path: "images/arrow-right.svg" })
        },
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

    const view = resolve("promocard-horizontal.ftl");
    const body = libs.freemarker.render(view, model);
    const promocardHorizontalCss = libs.portal.assetUrl({ path: "css/promocard-horizontal.css" });
    const promocardHorizontalCssContribution = `<link rel="preload" href="${promocardHorizontalCss}" as="style"><link rel="stylesheet" href="${promocardHorizontalCss}">`;
    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/promocardHorizontalVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [promocardHorizontalCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
