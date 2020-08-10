const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");
    const toArray = function (e) {
        return (e) ? ((!e.length) ? [ e ] : e) : []
    }
    const mapData = function (data) {
        if (data.categories && data.series) {
            return {
                categories: data.categories.map((v) => v.name),
                series: toArray(data.series).map((v) => ({
                    name: v.name,
                    data: toArray(v.data).map((x) => x.y)
                })),
                xText: data.xText,
                yText: data.yText
            }
        }
        return false
    }

    const config = libs.portal.getComponent().config
    const data = {
        title: config.title,
        subTitle: config.subTitle,
        pieData: (config.type && config.type._selected === 'pieData') ? config.type.pieData : false,
        columnData: (config.type && config.type._selected === 'columnData') ? mapData(config.type.columnData) : false,
        lineData: (config.type && config.type._selected === 'lineData') ? mapData(config.type.lineData) : false,
        areaData: (config.type && config.type._selected === 'areaData') ? mapData(config.type.areaData) : false
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
