const libs = {
    portal: require("/lib/xp/portal"),
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
        title: config.title || "",
        subTitle: config.subTitle || "",
        media: {
            selected: config.media ? config.media._selected : "",
            image: {
                src: config.media ? libs.portal.imageUrl({
                    id: config.media.image.image,
                    scale: 'max(600)'
                }) : null
            },
            video: (config.media.video.id) ? libs.content.get({
                key: config.media.video.id
            }) : null
        },
        startText: config.startText || "",
        questions: toArray(config.questions).map((v) => ({
            text: v.text || "",
            desc: v.desc || "",
            options: v.options || [],
            isImageLeft: (v.media["_selected"] === 'image') ? (v.media.image.side === 'left') : (v.media.video.side === 'left'),
            media: {
                selected: v.media ? v.media._selected : "",
                image: {
                    src: v.media ? libs.portal.imageUrl({
                        id: v.media.image.image,
                        scale: 'max(600)'
                    }) : null
                },
                video: (v.media.video.id) ? libs.content.get({
                    key: v.media.video.id
                }) : null
            }
        })),
        endText: config.endText || "",
        feedback: config.feedback ? config.feedback : false
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("quiz.ftl");
    const body = libs.freemarker.render(view, model);

    const quizCss = libs.portal.assetUrl({ path: "css/quiz.css" });
    const quizCssContribution = `<link rel="preload" href="${quizCss}" as="style"><link rel="stylesheet" href="${quizCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/quizVue.js" })}" async></script>`;
    const goBrainScript = "<script src=\"//play2.qbrick.com/framework/GoBrain.min.js\"></script>";

    return {
        body: body,
        pageContributions: {
            headEnd: [quizCssContribution, goBrainScript],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
