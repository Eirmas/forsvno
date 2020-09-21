<div class="link-activate">
    <div class="link-activate__wrapper container blue-light">
        <div class="link-activate__head">
            <label class="link-activate__label">
                <input type="checkbox" onchange="for(i=0;i<this.parentElement.parentElement.parentElement.children[1].children.length;i++){this.parentElement.parentElement.parentElement.children[1].children[i].children[0].classList[(this.checked)?'remove':'add']('link-activate__link-disabled')}">
                <span class="link-activate__checkbox"></span>
                <span class="link-activate__head-text">${text}</span>
            </label>
        </div>
        <div class="link-activate__body">
            <div>
                <a href="${link1href}" target="_blank" rel="noopener noreferrer" class="link-activate__link link-activate__link-disabled">
                    <span>${link1text}</span>
                    <img src="${icon}" alt="Pil til høyre">
                </a>
            </div>
            <div>
                <a href="${link2href}" target="_blank" rel="noopener noreferrer" class="link-activate__link link-activate__link-disabled">
                    <span>${link2text}</span>
                    <img src="${icon}" alt="Pil til høyre">
                </a>
            </div>
        </div>
    </div>
</div>
