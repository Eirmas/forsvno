<div class="list-small-links__wrapper ${color}">
    <div class="container">
        <div class="list-small-links__head">
            <span>Ressurser</span>
        </div>
        <div>
            [#list linkRows as row]
            <div class="list-small-links__row row">
                [#list row as link]
                <div class="list-small-links__col col-md-4">
                    <a
                        target="[#if link.newTab]_blank[#else]_self[/#if]"
                        href="${link.path}"
                        class="link-small-links__anchor underline-draw__root"
                        data-anchor="${link.anchor}"
                        data-page="${link.isSamePage?c}"
                    >
                        <img
                            src="${link.icon}"
                            alt="Lenke ikon"
                        />
                        <span class="underline-draw__target">${link.title}</span>
                    </a>
                </div>
                [/#list]
            </div>
            [/#list]
        </div>
    </div>
</div>
