"use strict";

function runWhenReady() {
    var elements = document.getElementsByClassName('link-small-links__anchor');
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            el = _step.value;

            if (el && el.getAttribute('data-anchor') !== "" && el.getAttribute('data-page') === "true") {
                var target = document.getElementById(el.getAttribute('data-anchor'));

                if (target) {
                    var targetY = target.getBoundingClientRect().y;
                    var elY = el.getBoundingClientRect().y;
                    el.classList.add(targetY > elY ? 'list-small-links__anchor-down' : 'list-small-links__anchor-up');
                    el.addEventListener('click', linkClick);
                }
            } else {
                el.classList.add('list-small-links__anchor-right');
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}

function linkClick(e) {
    var target = e.target;
    if (target.tagName !== "A") target = target.parentElement;

    if (target.getAttribute('data-anchor') !== "" && target.getAttribute('data-page') === "true") {
        e.preventDefault();
        var element = document.getElementById(target.getAttribute('data-anchor'));

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }
}

if (document.readyState !== "loading") {
    runWhenReady();
} else {
    document.addEventListener("DOMContentLoaded", runWhenReady);
}