import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

/**
 * Renders an API-supplied image, falling back to the theme's bundled asset whenever the
 * admin has not uploaded one.
 *
 *   <img [appSrc]="banner.image" fallback="assets/images/banner/01.webp" alt="">
 *
 * Two distinct things can go wrong, and both land on the same fallback:
 *
 *  1. The field is empty — the admin never uploaded an image, so the API sends `null`.
 *     Binding that straight to `src` would request the page's own URL and render a broken
 *     image, so we substitute the asset before it ever reaches the DOM.
 *  2. The field is set but the file does not resolve (storage symlink missing, file
 *     deleted, backend down). We only learn this from the element's `error` event, so we
 *     swap the source then.
 *
 * `swapped` guards case 2: if the fallback asset itself were to fail we would otherwise
 * reassign `src` from within the handler for its own error and spin forever.
 */
@Directive({
  selector: 'img[appSrc]',
  standalone: true,
  host: {
    '(error)': 'onError()',
  },
})
export class ImgSrcDirective implements OnChanges {
  /** The API value. Empty, whitespace or null all count as "not uploaded". */
  @Input() appSrc: string | null | undefined;

  /** The bundled asset to show instead. */
  @Input() fallback = 'assets/images/banner/01.webp';

  private swapped = false;

  constructor(private el: ElementRef<HTMLImageElement>) { }

  ngOnChanges(): void {
    this.swapped = false;
    this.el.nativeElement.src = this.resolved();
  }

  private onError(): void {
    if (this.swapped || this.el.nativeElement.src.endsWith(this.fallback)) {
      return;
    }

    this.swapped = true;
    this.el.nativeElement.src = this.fallback;
  }

  private resolved(): string {
    const value = this.appSrc?.trim();

    return value ? value : this.fallback;
  }
}
