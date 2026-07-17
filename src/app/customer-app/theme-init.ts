/**
 * Boots the theme's jQuery plugins (Swiper sliders, sal scroll animations, Magnific
 * popup, the odometer counters) over the markup Angular has just rendered.
 *
 * The components used to call this on a blind `setTimeout(…, 500)` from
 * `ngAfterViewInit`, which was safe only while every section was hardcoded. Now that the
 * sections are rendered from `*ngFor` over API data, the slides do not exist at
 * `ngAfterViewInit` — Swiper would bind to an empty container and the carousels would
 * come up dead. So each page calls this *after* its data has landed instead.
 *
 * Call it once per page load. `PublicContentService` swallows request failures into empty
 * results, so the data streams always resolve and this always runs — even with the
 * backend down, the static parts of the page still animate.
 *
 * The short delay gives Angular's renderer a beat to flush the new nodes to the DOM
 * before the plugins measure them.
 */
export function initThemeScripts(delay = 100): void {
  setTimeout(() => {
    const invJs = (window as any).invJs;

    if (invJs) {
      invJs.swiperJs();
      invJs.odoMeter();
      invJs.salActive();
      invJs.magnificPopupActivation();
      invJs.dataCss();
    }
  }, delay);
}
