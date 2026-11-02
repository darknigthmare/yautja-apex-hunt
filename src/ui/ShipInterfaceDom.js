export const shipEscape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]));

export function setShipText(node, value) {
  if (node && node.textContent !== String(value)) node.textContent = String(value);
}

/** Local dialog focus and Escape handling; movement ownership stays with Game. */
export function bindShipDialog(root, onClose) {
  let previousFocus = null;
  if (!root?.ownerDocument || typeof root.querySelectorAll !== 'function') return null;
  root.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault(); event.stopPropagation(); onClose(); return;
    }
    if (event.key !== 'Tab') return;
    const controls = [...root.querySelectorAll('button,select,input,[tabindex]')]
      .filter(node => !node.disabled && !node.hidden && node.tabIndex >= 0 && !node.closest('.hidden'));
    const first = controls[0], last = controls.at(-1);
    if (!first) return;
    const active = root.ownerDocument.activeElement;
    if (!controls.includes(active)) {
      event.preventDefault(); event.stopPropagation();
      (event.shiftKey ? last : first).focus();
    } else if (event.shiftKey && active === first) {
      event.preventDefault(); event.stopPropagation(); last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault(); event.stopPropagation(); first.focus();
    }
  });
  return {
    get isOpen() { return !root.classList.contains('hidden'); },
    open() {
      previousFocus = root.ownerDocument.activeElement;
      root.classList.remove('hidden'); root.setAttribute('aria-hidden', 'false');
      root.querySelector('.ship-dialog-title')?.focus({ preventScroll: true });
    },
    close({ restoreFocus = false } = {}) {
      root.classList.add('hidden'); root.setAttribute('aria-hidden', 'true');
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    },
  };
}
