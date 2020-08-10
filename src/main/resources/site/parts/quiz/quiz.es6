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
    const config = libs.portal.getComponent().config
    const data = {
        title: config.title || "",
        subTitle: config.subTitle || "",
        startText: config.startText || "",
        questions: toArray(config.questions).map((v) => ({
            text: v.text || "",
            desc: v.desc || "",
            options: v.options || [],
            isImageLeft: v.side === 'left',
            media: {
                selected: v.media ? v.media._selected : "",
                image: {
                    src: v.media ? libs.portal.imageUrl({
                        id: v.media.image.image,
                        scale: 'max(600)'
                    }) : ""
                },
                video: {
                    src: ""
                }
            }
        })),
        endText: config.endText || ""
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

    return {
        body: body,
        pageContributions: {
            headEnd: [quizCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
