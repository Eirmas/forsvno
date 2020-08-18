<div class="list-small-links__wrapper">
    <div class="container">
        <div class="list-small-links__head">
            <span>Ressurser</span>
        </div>
        <div>
            [#list linkRows as row]
            <div class="list-small-links__row row">
                [#list row as link]
                <div class="list-small-links__col col-md-4">
                    <a target="[#if link.newTab]_blank[#else]_self[/#if]" href="${link.href}" class="underline-draw__root">
                        <img src="${link.icon}" alt="Lenke ikon"/>
                        <div>
                            <span class="underline-draw__target">${link.title}</span>
                        </div>
                    </a>
                </div>
                [/#list]
            </div>
            [/#list]
        </div>
    </div>
</div>
