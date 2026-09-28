# Design System Findings

Token and naming issues found in the live Figma file (`oodzXY4lwyWIu5qK05VTP7`, Bernardo Designs System) during the native MCP migration on 2026-09-28. These are problems in the Figma file itself, not in the sync pipeline.

Record only. Nothing has been changed in Figma or in `design-map.json`.

| # | Issue | What it is | Why it matters |
|---|---|---|---|
| 1 | Popover inverted | `popover/popover` (`VariableID:618:31290`) is black in light mode and white in dark; `popover/popover foreground` is the reverse. | Popovers render as dark surfaces in light mode, unlike every other surface (card, background). Looks like a light/dark swap. |
| 2 | Invisible small shadows | `2xs/color` and `xs/color` (`VariableID:848:48160`, `:48177`) point at `black/alpha-0`, so `shadow-2xs` and `shadow-xs` draw nothing. | shadcn's `shadow-xs` is 5% black; any component using it (inputs, buttons) loses its edge definition. |
| 3 | Serif is Inter | `font definitions/font-family-serif` (`VariableID:845:1253576`) is `"Inter"`, a sans, and `font-family-body` aliases to it. | Token names say serif, the value is sans; anyone reading the tokens or generated CSS gets the wrong mental model. |
| 4 | Brand colors are blue | `brand-shades/*` alias Tailwind blue, and all `brand-combinations/*` build on them, while `general/primary` is `amber/700`. | The "brand" collection doesn't match the actual brand color; anything built from brand-combinations ships blue. |
| 5 | Heading 3 weight name | `heading 3/heading 3 weight` (`VariableID:845:1253581`); headings 1, 2 and 4 use `heading N/weight`. | Breaks the pattern, so anything that addresses weights by path misses heading 3. |
| 6 | Inconsistent names | `paragraph/small/line height` and `paragraph/mini/line height` vs `line-height` everywhere else; comma decimals in spacing (absolute) (`0,5`, `0,75`, `1,25`…); `sm/shadow 2/x2` vs `sm/shadow 1/x`. | Pattern-based tooling and code generation trip on the odd ones out, and comma decimals don't survive CSS/JS naming. |
| 7 | Spacing shims | 11 `spacing/hacks to fit scale/*` variables (3, 5.5, 6, 7, 7.5, 8.5, 9, 9.5, 10, 14, 15.5), raw values with no alias. Marked `ignored-candidate` in the map. | Off-scale values leak into designs and undermine the spacing scale; each use should be fixed or promoted to a real step. |
| 8 | Hex instead of aliases | `general/destructive` dark (`#9E4042`) and `focus/ring error` dark (`#6D2E2F`) are typed hex; all 11 `chart colors` are typed hex in both modes. (`obra-shadcn-docs/*` dark too, docs-only.) | These don't follow the raw color ramps, so a palette change silently leaves them behind and they drift. |
