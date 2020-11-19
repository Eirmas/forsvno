const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    freemarker: require("/site/lib/tineikt/freemarker"),
};

exports.get = () => {
    const component = libs.portal.getComponent();
    const path = component.path;
    const config = component.config;
    const uniqueId = path.split("/").join("-");
    log.info(typeof uniqueId)
    log.info(uniqueId);
    const toArray = function (e) {
        return [].concat(e || []);
    }
    const audio = libs.content.get({ key: config.service })
    const service = audio.data.service[audio.data.service._selected].linkType;
    const data = {
        title: config.title,
        image: libs.portal.imageUrl({ 
            id: config.image,
            scale: 'max(600)'
        }),
        subtitle: config.subtitle,
        ingress: config.ingress,
        link: {
            url: config.linkType._selected === "external" ? config.linkType.external.url : libs.portal.pageUrl({ id: config.linkType.internal.id }),
            text: config.linkText
        },
        audio: {
            header: audio.data.header,
            subheader: audio.data.subheader,
            title: audio.data.title,
            description: audio.data.description,
            cover: libs.portal.imageUrl({
                id: audio.data.cover,
                scale: 'max(300)'
            }),
            service: service._selected === "external" ? service.external.url : libs.portal.pageUrl({ id: service.internal.id })
        },
        linksHeader: config.linksHeader,
        links: config.links.map((link) => ({
            title: link.title,
            subtitle: link.subtitle,
            url:  link.linkType._selected === "external" ? link.linkType.external.url : libs.portal.pageUrl({ id: link.linkType.internal.id }),
            icon: libs.portal.imageUrl({ 
                id: link.decoration.icon,
                scale: 'max(600)'
            }),
            caption: link.decoration.caption
        })),
        icons: {
            arrowRight: libs.portal.assetUrl({ path: "images/arrow-right.svg" }),
            play: libs.portal.assetUrl({ path: "images/play.svg" }),
            pause: libs.portal.assetUrl({ path: "images/pause.svg" }),
            volume0: libs.portal.assetUrl({ path: "images/Volume-0.svg" }),
            volume33: libs.portal.assetUrl({ path: "images/Volume-33.svg" }),
            volume66: libs.portal.assetUrl({ path: "images/Volume-66.svg" }),
            volume100: libs.portal.assetUrl({ path: "images/Volume-100.svg" }),
        }
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
