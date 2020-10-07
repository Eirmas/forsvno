const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
    contentLib: require("/lib/xp/content")
};

exports.get = () => {
    const component = libs.portal.getComponent();
    const config = component.config;
    const path = component.path;
    const uniqueId = path.split("/").join("-");
    const toArray = function (e) {
        return [].concat(e || []);
    }

    const data = {
        forms: toArray(config.forms).map((e) => libs.contentLib.get({ key: e }).data)
    }
    log.info("Data: %s", data);
    const view = resolve("contact-form.ftl");
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const body = libs.freemarker.render(view, model);

    const contactFormCss = libs.portal.assetUrl({ path: "css/contact-form.css" });
    const contactFormCssContribution = `<link rel="preload" href="${contactFormCss}" as="style"><link rel="stylesheet" href="${contactFormCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/contactFormVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [contactFormCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
