# Marvin booth model

`marvin-booth.glb` is a binary glTF export of the current Three.js model. It includes the supplied olive velvet curtain, exact Marvin logo, printer label/interior/metal finish, structural meshes, named parts, an interior seat, chrome/cream materials, and reference portraits. See [asset mapping](assets.md). Inferred dimensions are modeling units rather than verified manufacturing dimensions.

Regenerate it from `marvin-web/` with the Vite dev server running and `npm run export:model`. The script reimports the result and writes `validation.json`. Web animation uses `src/lib/timeline.ts` and `src/scene/curtainMotion.ts`; the GLB is a static closed-booth handoff. Lighting and procedural bump detail can vary in other viewers. Reference photographs remain demonstration assets.
