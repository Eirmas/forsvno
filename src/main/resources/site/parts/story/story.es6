const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    freemarker: require("/site/lib/tineikt/freemarker"),
    utilx: require("/lib/bouvet/util-ex")
};

exports.get = () => {
    const path = libs.portal.getComponent().path;
    const uniqueId = path.split("/").join("-");

    const config = libs.portal.getComponent().config
    const data = {
        title: config.title,
        background: config.background,
        soundIcons: {
            on: libs.portal.assetUrl({
                path: 'images/sound-on.svg'
            }),
            off: libs.portal.assetUrl({
                path: 'images/sound-off.svg'
            })
        },
        stories: libs.utilx.forceArray(config.stories).map((story) => ({
            title: story.title,
            profilePic: libs.portal.imageUrl({
                id: story.profilePic,
                scale: 'block(90,90)',
                quality: '70'
            }),
            thumbnailOverride: (story.thumbnail && story.thumbnail.url) ? libs.portal.imageUrl({
                id: story.thumbnail.url,
                scale: 'max(1000)',
                quality: '100'
            }) : false,
            storyItems: libs.utilx.forceArray(story.storyItems).map((storyItem) => ({
                type: storyItem.type["_selected"],
                image: libs.portal.imageUrl({
                    id: storyItem.type.image.id,
                    scale: 'max(1000)',
                    quality: '100'
                }),
                video: (storyItem.type.video.id) ? libs.content.get({
                    key: storyItem.type.video.id
                }) : null
            })).filter((storyItem) => storyItem.type && (storyItem.image || storyItem.video))
        }))
    }
    const model = {
        uniqueId,
        data: JSON.stringify(data)
    };
    const view = resolve("story.ftl");
    const body = libs.freemarker.render(view, model);

    const storyCss = libs.portal.assetUrl({ path: "css/story.css" });
    const storyCssContribution = `<link rel="preload" href="${storyCss}" as="style"><link rel="stylesheet" href="${storyCss}">`;

    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/storyVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [storyCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};
