<div class="social-links__wrapper">
    <div class="social-links ${backgroundColor}">
        <div class="social-links__container">
            <div>${title}</div>
            <div class="social-links__items-wrapper">
                [#list items as item]
                    <div class="social-links__item">
                        <a target="[#if newTab]_blank[#else]_self[/#if]" href="${item.href}">
                            <div style="background-image: url('${item.icon}')" class="social-links__icon"></div>
                        </a>
                        <div class="social-links__text underline-draw">
                            <a href="${item.href}" target="[#if newTab]_blank[#else]_self[/#if]">${ item.text }</a>
                        </div>
                    </div>
                [/#list]
            </div>
        </div>
    </div>
</div>
