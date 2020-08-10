const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");

    const config = libs.portal.getComponent().config
    const data = {
        data: (config.data) ? ((!config.data.length) ? [ config.data ] : config.data) : []
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("stepper.ftl");
    const body = libs.freemarker.render(view, model);

    const stepperCss = libs.portal.assetUrl({ path: "css/stepper.css" });
    const stepperCssContribution = `<link rel="preload" href="${stepperCss}" as="style"><link rel="stylesheet" href="${stepperCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/stepperVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [stepperCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
