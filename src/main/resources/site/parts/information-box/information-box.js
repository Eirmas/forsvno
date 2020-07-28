const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");

    const config = libs.portal.getComponent().config
    const data = {
        title: config.title,
        backgroundColor: config.color,
        text: config.text,
        isImageLeft: (config.side === 'left'),
        image: libs.portal.imageUrl({
            id: config.image,
            scale: 'max(600)'
        })
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("information-box.ftl");
    const body = libs.freemarker.render(view, model);
    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/informationBoxVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
