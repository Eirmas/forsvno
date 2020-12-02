const libs = {
    portal: require("/lib/xp/portal"),
    freemarker: require("/site/lib/tineikt/freemarker"),
    contentLib: require("/lib/xp/content"),
    utilx: require("/lib/bouvet/util-ex")
};

exports.get = () => {
    const component = libs.portal.getComponent();
    const config = component.config;
    const path = component.path;
    const uniqueId = path.split("/").join("-");
    const siteConfig = libs.portal.getSite().data.siteConfig.config;

    const mapValidations = (v) => {
        return [
            (v.required) ? { name: "required", text: "Dette feltet er obligatorisk", value: 0 } : null,
            (v.max) ? { name: "max", text: "Antallet verdier er over maksimalkravet", value: v.max } : null,
            (v.min) ? { name: "min", text: "Verdiene oppfyller ikke minstegravet", value: v.min } : null,
            (v.maxLength) ? { name: "maxLength", text: "Lengden på verdien er for lang", value: v.maxLength } : null,
            (v.minLength) ? { name: "minLength", text: "Lengden på verdien er for kort", value: v.minLength } : null,
            (v.custom) ? { name: "pattern", text: "Ugyldig verdi", value: v.custom } : null,
            (v.email) ? { name: "email", text: "E-postadressen er ugyldig", value: 0 } : null,
            (v.pnum) ? { name: "pnum", text: "Ugyldig personnummer", value: 0 } : null,
            (v.phone) ? { name: "phone", text: "Ugyldig telefonnummer", value: 0 } : null,
            (v.url) ? { name: "url", text: "Ugyldig lenke", value: 0 } : null,
            (v.maxSize) ? { name: "maxSize", text: "Størrelsen er for stor", value: v.maxSize } : null
        ].filter((e) => !!e)
    }

    const mapOption = (option) => {
        return {
            text: option.text || "",
            value: option.value || (option.text || ""),
            picked: option.picked
        }
    }

    const mapAccept = (accept) => {
        if (accept["_selected"] === "custom") {
            return accept.custom.extensions.map((v) => v.extension);
        } else if (accept["_selected"] === "template") {
            return libs.utilx.forceArray(accept.template.extension);
        }
        return null
    }

    const formatSelect = (field) => {
        return {
            component: "Select",
            label: field.label,
            options: libs.utilx.forceArray(field.options).map((opt) => mapOption(opt)),
            validations: mapValidations({
                required: field.required
            }),
            settings: { <<
                << << < HEAD
                multiple: field.advanced ? .multiple,
                required: field.required
            },
            cols: field.advanced ? .cols ===
                === =
                multiple : field.advanced ? .multiple,
            required: field.required
        },
        cols: field.advanced ? .cols >>>
            >>> > andreas
    }
}

const formatInput = (field) => { <<
    << << < HEAD
    const regex = field.advanced ? .regex ? ._selected
    const validations = {
        required: field.required,
        maxLength: field.advanced ? .maxLength,
        minLength: field.advanced ? .minLength ===
            === =
            const regex = field.advanced ? .regex ? ._selected
        log.info(JSON.stringify(field));
        const validations = {
            required: field.required,
            maxLength: field.advanced ? .maxLength,
            minLength: field.advanced ? .minLength,
            pnum: field.cc === "pnum" >>>
                >>> > andreas
        }
        if (regex) validations[regex] = field.advanced.regex[regex].regex;

        return {
            component: "Input",
            label: field.label,
            placeholder: field.placeholder,
            validations: mapValidations(validations),
            settings: {
                cc: field.cc,
                required: field.required,
                maxLength: field.advanced ? .maxLength,
                minLength: field.advanced ? .minLength,
            },
            cols: field.advanced ? .cols
        }
    }

    const formatTextarea = (field) => {
        return {
            component: "Textarea",
            label: field.label,
            placeholder: field.placeholder,
            validations: mapValidations({
                required: field.required,
                maxLength: field.advanced ? .maxLength,
                minLength: field.advanced ? .minLength
            }),
            settings: {
                required: field.required,
                maxLength: field.advanced ? .maxLength,
                minLength: field.advanced ? .minLength
            },
            cols: field.advanced ? .cols
        }
    }

    const formatButtons = (field) => {
        return {
            component: (field.advanced && field.advanced.multiple) ? "Checkbox" : "Radio",
            label: field.label,
            options: libs.utilx.forceArray(field.options).map((opt) => mapOption(opt)),
            validations: mapValidations({
                required: field.required
            }),
            settings: {
                multiple: field.advanced ? .multiple,
                required: field.required
            },
            cols: field.advanced ? .cols
        }
    }

    const formatAttachment = (field) => {
        return {
            component: "Attachment",
            label: field.label,
            options: libs.utilx.forceArray(field.options).map((opt) => mapOption(opt)),
            validations: mapValidations({
                required: field.required,
                maxLength: (field.advanced && !field.advanced.multiple) ? 1 : false,
                maxSize: (field.advanced ? .maxSize || 20) * (Math.pow(32, 4)),
            }),
            settings: {
                multiple: field.advanced ? .multiple,
                maxSize: (field.advanced ? .maxSize || 20) * (Math.pow(32, 4)),
                required: field.required,
                accept: (field.advanced ? .accept) ? mapAccept(field.advanced.accept).join(', ') : null
            },
            cols: field.advanced ? .cols,
            value: []
        }
    }

    const formatDatepicker = (field) => {
        return {
            component: "Datepicker",
            label: field.label,
            validations: mapValidations({
                required: field.required,
                minLength: field.minLength,
                maxLength: field.maxLength
            }),
            settings: {
                required: field.required,
                maxLength: field.maxLength,
                minLength: field.minLength
            },
            cols: field.advanced ? .cols
        }
    }

    const methods = {
        Select: formatSelect,
        Input: formatInput,
        Buttons: formatButtons,
        Attachment: formatAttachment,
        Textarea: formatTextarea,
        Datepicker: formatDatepicker
    }

    const processForm = (form) => {
        const fields = libs.utilx.forceArray(form.fields);
        return (fields) ? {
            receiver: form.receiver,
            fields: fields.map((e) => methods[e.field["_selected"]](e.field[e.field["_selected"]]))
        } : form
    }

    const forms = libs.utilx.forceArray(config.forms).map((e) => libs.contentLib.get({ key: e }).data)
    const data = {
        id: uniqueId,
        siteKey: siteConfig.siteKey,
        server: libs.portal.serviceUrl({ service: 'contact-form-service' }),
        icons: {
            caret: libs.portal.assetUrl({ path: "images/caret.svg" }),
            close: libs.portal.assetUrl({ path: "images/close-bold.svg" }),
        },
        forms: forms.map((form) => processForm(form))
    }
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