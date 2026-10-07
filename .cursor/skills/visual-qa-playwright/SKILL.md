---
name: visual-qa-playwright
description: Visual and functional QA with Playwright MCP. Use at the end of every phase or feature to screenshot the UI at all device sizes and detect overflow, console errors and broken flows.
---
# Visual QA
1. Start the dev server.
2. For each viewport (320x568, 360x640, 390x844, 768x1024, 1024x768, 1440x900, 1920x1080) open the page(s) changed.
3. Check: no horizontal scroll (document.scrollingElement.scrollWidth <= innerWidth), no console errors, no overlapped/clipped elements, tap targets >= 44px, readable contrast.
4. Exercise the feature (click, type, submit) and confirm the expected WhatsApp URL starts with https://wa.me/918506905757?text=
5. Save screenshots to docs/qa/<phase>/<viewport>.png.
6. Fix every issue found, then re-run. Report a short table: page | viewport | result.
