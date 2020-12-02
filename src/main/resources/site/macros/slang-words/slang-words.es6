const libs = {
    portal: require("/lib/xp/portal"),
    content: require("/lib/xp/content"),
    freemarker: require("/site/lib/tineikt/freemarker"),
    i18n: require("/lib/xp/i18n")
};

const WORDS = {
    id1: { word: "1. linje", description: "Angir hva slags bekledning og utstyr man skal ha. Kun uniform " },
    id2: { word: "2. linje", description: "Angir hva slags bekledning og utstyr man skal ha. 1. linje + stridsvest og våpen " },
    id3: { word: "3. linje", description: "Angir hva slags bekledning og utstyr man skal ha. 2. linje + stridssekk med relevant utstyr for 24 timer (mat, teltduk, ekstra bekledning etc.) " },
    id4: { word: "4. linje", description: "Angir hva slags bekledning og utstyr man skal ha. 3. linje + utstyr relevant for lengre oppdrag (én uke). Mer mat, utstyr og bekledning. Pakkes i storsekk " },
    id5: { word: "5. linje", description: "Angir hva slags bekledning og utstyr man skal ha. Alt utstyr som hver enkelt soldat har fått utdelt " }
}

exports.macro = (context) => {
    const config = context.params;
    const site = libs.portal.getContent();
    const data = {
        header: site.displayName,
        subheader: site.data.preface,
        inputPlaceholder: config.inputPlaceholder ? config.inputPlaceholder : libs.i18n.localize({ key: "" }),
        paginationIndex: config.paginationIndex ? config.paginationIndex : 30,
        paginationLimit: config.paginationLimit ? config.paginationLimit : 30,
        items: Object.keys(WORDS).map(key => WORDS[key]),
        localize: libs.i18n.getPhrases([], ["i18n/phrases"])
    };
    const model = {
        uniqueId: "militaere-forkortelser",
        data: JSON.stringify(data)
    };
    const view = resolve("slang-words.ftl");
    const body = libs.freemarker.render(view, model);
    const slangWordsCss = libs.portal.assetUrl({ path: "css/slang-words.css" });
    const slangWordsCssContribution = `<link rel="preload" href="${slangWordsCss}" as="style"><link rel="stylesheet" href="${slangWordsCss}">`;
    const initialDataScript = libs.freemarker.render(resolve("../../template/common/initial-data.ftl"), model);
    const vueScript = `<script src="${libs.portal.assetUrl({ path: "js/slangWordsVue.js" })}" async></script>`;

    return {
        body: body,
        pageContributions: {
            headEnd: [slangWordsCssContribution],
            bodyEnd: [initialDataScript, vueScript]
        }
    };
};