export function getElement(element) {
  if(element instanceof Element) {
    return element;
  } else if(element instanceof Function) {
    return getElement(element());
  } else if(typeof(element) === 'string') {
    return document.querySelector(element);
  }

  return null;
}

export function getInputSelection(el) {
    var start = 0, end = 0, normalizedValue, range,
        textInputRange, len, endRange;

    if (typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
    } else {
        range = document.selection.createRange();

        if (range && range.parentElement() == el) {
            len = el.value.length;
            normalizedValue = el.value.replace(/\r\n/g, "\n");

            // Create a working TextRange that lives only in the input
            textInputRange = el.createTextRange();
            textInputRange.moveToBookmark(range.getBookmark());

            // Check if the start and end of the selection are at the very end
            // of the input, since moveStart/moveEnd doesn't return what we want
            // in those cases
            endRange = el.createTextRange();
            endRange.collapse(false);

            if (textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                start = end = len;
            } else {
                start = -textInputRange.moveStart("character", -len);
                start += normalizedValue.slice(0, start).split("\n").length - 1;

                if (textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                    end = len;
                } else {
                    end = -textInputRange.moveEnd("character", -len);
                    end += normalizedValue.slice(0, end).split("\n").length - 1;
                }
            }
        }
    }

    return {
        start: start,
        end: end
    };
}


export function delay(func, frames = 0) {
  window.requestAnimationFrame(() => {
    if(--frames <= 0) {
      func();
    } else {
      delay(func, frames);
    }
  });
}

export function getDescendants(elem) {
  return Array.prototype.slice.call(elem.querySelectorAll('*'));
}

export function isElementHidden(elem) {
  return !( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
}

export function isElementVisible(elem) {
  return !isElementHidden(elem);
}

export function isFocusable(elem) {
  if(!elem || isElementHidden(elem)) {
    return false;
  }

  switch(elem.nodeName.toLowerCase()) {
    case 'input':
    case 'select':
    case 'textarea':
    case 'button':
      if(!elem.hasAttribute('disabled')) {
        return true;
      }
      break;
    case 'a':
    case 'area':
      if(elem.hasAttribute('href')) {
        return true;
      }
      break;
    case 'iframe':
      return true;
    default:
      if(elem.hasAttribute('tabindex') && (+elem.getAttribute('tabindex')) > -2) {
        return true;
      }
  }

  return false;
}

export function getFocusableElements(container) {
  return getDescendants(container).filter(isFocusable);
}
