const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const component = libs.portal.getComponent();
    const config = component.config;
    const path = component.path;
    const uniqueId = path.split("/").join("-");
    let fields = (config.inputFields) ? ((!config.inputFields.length) ? [ config.inputFields ] : config.inputFields) : [];
    fields = fields.map((data) => ({
        _selected: data.element._selected,
        inputHeading: data.element[data.element._selected].inputHeading || "",
        required: data.element[data.element._selected].required || "",
        inputId: data.element[data.element._selected].inputId,
        inputType: data.element[data.element._selected].inputType || "",
        options: data.element[data.element._selected].options || [],
        value: ""
    }))
    const view = resolve("contact-form.ftl");
    const model = {
        uniqueId,
        data: JSON.stringify( { data: fields, serviceUrl: libs.portal.serviceUrl({ service: "contact-form-service" }) })
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
