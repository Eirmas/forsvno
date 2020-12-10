"use strict";

const libs = {
  portal: require("/lib/xp/portal"),
  freemarker: require("/site/lib/tineikt/freemarker"),
  utilx: require("/lib/bouvet/util-ex"),
  i18n: require("/lib/xp/i18n")
};

exports.get = () => {
  const path = libs.portal.getComponent().path;
  const uniqueId = path.split("/").join("-");
  const config = libs.portal.getComponent().config

  const getMedia = () => {
    const selected = config.media ? config.media["_selected"] : "none"

    let image = null
    if (config.media.image?.image) {
      image = libs.portal.imageUrl({
        id: config.media.image.image,
        scale: "max(600)"
      })
    }

    let video = null
    if (config.media.video?.id) {
      video = libs.content.get({
        key: config.media.video.id
      })
    }

    return {
      selected: selected,
      image: {
        src: image
      },
      video: video
    }
  }

  const getQuestions = () => {
    const questions = libs.utilx.forceArray(config.questions);

    return questions.map((v) => {
      const selectedMedia = v.media ? v.media["_selected"] : "none"

      let mediaLeft = false
      if (selectedMedia === "image") {
        mediaLeft = v.media.image.side === "left"
      }
      if (selectedMedia === "video") {
        mediaLeft = v.media.video.side === "left"
      }

      let image = null
      if (v.media?.image?.image) {
        image = libs.portal.imageUrl({
          id: v.media.image.image,
          scale: "max(600)"
        })
      }

      let video = null
      if (v.media?.video?.id) {
        video = libs.content.get({
          key: v.media.video.id
        })
      }

      return {
        text: v.text,
        desc: v.desc,
        options: libs.utilx.forceArray(v.options),
        isImageLeft: mediaLeft,
        media: {
          selected: selectedMedia,
          image: {
            src: image
          },
          video: video
        }
      }
    })
  }

  const data = {
    id: uniqueId,
    title: config.title,
    subTitle: config.subTitle,
    startText: config.startText,
    endText: config.endText,
    feedback: config.feedback ? config.feedback : false,
    media: getMedia(),
    questions: getQuestions(),
    localize: libs.i18n.getPhrases(["no"], ["i18n/phrases"])
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
