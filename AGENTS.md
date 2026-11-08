<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Use Embla with its Auto Scroll plugin for the Google reviews carousel, keeping drag and arrow navigation; a continuous track makes automatic movement visible and reliable.
- Centralize font families and shared title treatment in src/styles.css and load fonts in the root head; this keeps typography consistent across all pages.
- Keep the tax-credit explanation in a dedicated homepage section and its illustrative calculation in a tested browser-safe module; this separates fiscal rules from presentation.
- Render the supplied SAP and tax-credit logos through one shared component with individually selectable transparent assets; this preserves their proportions while allowing separate placements without changing the company identity.
- Render the service-area map with Google Maps JavaScript loaded near the viewport in an effect, preserving its frame dimensions; this keeps SSR safe and retains the managed map connection. Keep the standard basemap and its attribution.
- Clip service-area geometry to the Natural Earth 1:10m France boundary before rendering it on the Google Maps Data layer; this prevents Belgian territory from being highlighted. Source commune positions from geo.api.gouv.fr, keep geographic rule tests, and retain source attribution in src/data/README.md.
