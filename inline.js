/* La CSP no admite atributos style en el HTML. Las plantillas escriben data-s="…" y aquí se pasa a estilo
   por CSSOM (permitido por la CSP) en cuanto el nodo entra en la página, antes de que se pinte. */
export function hydrateStyles(root = document) {
  const apply = (el) => {
    el.style.cssText = el.dataset.s;
    el.removeAttribute('data-s');
  };
  if (root.nodeType === 1 && root.hasAttribute('data-s')) apply(root);
  root.querySelectorAll('[data-s]').forEach(apply);
}
export function watchStyles() {
  new MutationObserver((records) => {
    for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) hydrateStyles(n);
  }).observe(document.body, { childList: true, subtree: true });
}
