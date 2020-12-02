const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
    utilx: require("/lib/bouvet/util-ex")
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");
    const config = libs.portal.getComponent().config

    const mapData = function (data, type) {
        if (type === 'pieData') return data;
        if (data.categories && data.series) {
            return {
                categories: data.categories.map((v) => v.name),
                series: libs.utilx.forceArray(data.series).map((v) => ({
                    name: v.name,
                    data: libs.utilx.forceArray(v.data).map((x) => x.y)
                })),
                xText: data.xText,
                yText: data.yText
            }
        }
        return false
    }

    const selected = config.type["_selected"]

    const data = {
        title: config.title,
        subTitle: config.subTitle,
        [selected]: mapData(config.type[selected], selected)
    }

    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };

    const view = resolve("diagram.ftl");
    const body = libs.freemarker.render(view, model);

    const diagramCss = libs.portal.assetUrl({ path: "css/diagram.css" });
    const diagramCssContribution = `<link rel="preload" href="${diagramCss}" as="style"><link rel="stylesheet" href="${diagramCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/diagramVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [diagramCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
