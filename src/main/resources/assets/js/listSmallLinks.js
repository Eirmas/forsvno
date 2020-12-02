function runWhenReady() {
    const elements = document.getElementsByClassName('link-small-links__anchor');
    for (el of elements) {
        if (el && el.getAttribute('data-anchor') !== "" && el.getAttribute('data-page') === "true") {
            const target = document.getElementById(el.getAttribute('data-anchor'))
            if (target) {
                const targetY = target.getBoundingClientRect().y;
                const elY = el.getBoundingClientRect().y;
                el.classList.add((targetY > elY) ? 'list-small-links__anchor-down' : 'list-small-links__anchor-up');
                el.addEventListener('click', linkClick);
            }
        } else {
            el.classList.add('list-small-links__anchor-right');
        }
    }
}

function linkClick(e) {
    let target = e.target;
    if (target.tagName !== "A") target = target.parentElement;
    if (target.getAttribute('data-anchor') !== "" && target.getAttribute('data-page') === "true") {
        e.preventDefault();
        const element = document.getElementById(target.getAttribute('data-anchor'))
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }
    }
}

if (document.readyState !== "loading") {
    runWhenReady();
} else {
    document.addEventListener("DOMContentLoaded", runWhenReady);
}
