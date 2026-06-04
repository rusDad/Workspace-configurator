# Workplace Configurator Demo — AGENTS.md

## Project purpose

This repository is a fast demo prototype for a browser-based configurator of stationary workplaces, tool carts, shelves, cases, and foam insert kits.

The goal of the first demo is not to build a full ERP/e-commerce system. The goal is to show a clear product flow:

1. Select a tool cart.
2. Fill shelves step by step.
3. Add catalog foam insert kits.
4. Optionally launch the external custom layment constructor for a shelf-sized insert.
5. Receive custom layment result back into the configurator.
6. Show total price and commercial order summary.
7. Confirm the parent workplace order and then confirm included custom layment orders.

## Core product model

The configurator is slot-based, but the business meaning is:

- foam insert size is relative to one cart shelf;
- implementation may represent one shelf as 6 units;
- catalog modules consume shelf units.

Canonical shelf unit mapping:

- 1/6 shelf = 1 shelfUnit
- 1/3 shelf = 2 shelfUnits
- 2/3 shelf = 4 shelfUnits
- full shelf = 6 shelfUnits

Do not call this model generic drag-and-drop slots in domain code.
Prefer names like:

- shelfUnits
- shelfCapacityUnits
- shelfFillUnits
- moduleSizeLabel

Avoid naming the business size field `slotFraction` as the canonical field.
A display label like `sizeLabel: "1/3 shelf"` is acceptable.

## First demo scope

The first working demo must include only:

- Vue 3 + Vite + TypeScript app skeleton;
- wizard-style flow;
- two demo tool carts;
- shelf selection;
- placeholder catalog structure;
- placeholder catalog cards;
- shelf fill state;
- simple price summary;
- printable/order summary placeholder;
- stub integration boundary for external custom layment constructor.

The first PR must not include real production catalog data or final assets.
Use placeholders and typed mock structures only.

## UI direction

Use a wizard-style interface, not a large dashboard showing everything at once.

Recommended steps:

1. Select cart.
2. Select shelf.
3. Choose shelf filling.
4. Review current shelf.
5. Move to next shelf or summary.
6. Review workplace order.

The UI should be attractive and demo-friendly, but simple.

No drag-and-drop is required in the first demo.
Use explicit buttons:

- Add to selected shelf
- Remove
- Replace
- Create custom layment
- Next shelf
- Go to summary

## Architecture boundaries

### Vue shell

Vue owns:

- wizard flow;
- selected cart;
- selected shelf;
- demo catalog UI;
- shelf filling state;
- price summary;
- order preview;
- launch of external layment constructor;
- receiving custom layment result;
- parent workplace order composition.

Vue shell must not own:

- manufacturing geometry;
- G-code/DXF semantics;
- layment editor state internals;
- Fabric.js object semantics;
- backend artifact generation.

### External layment constructor

The custom layment constructor is a separate application/module.

The configurator launches it with shelf dimensions and context.
After layment order creation, the constructor returns:

- orderId;
- optional orderNumber;
- synthetic article;
- name;
- price;
- previewPngUrl;
- shelfUnits;
- widthMm;
- heightMm;
- laymentType;
- composition.

The configurator stores the returned result as a custom layment placement.

### Backend

For the first demo, backend integration may be stubbed.

Future backend responsibilities:

- store parent workplace order;
- confirm parent order;
- confirm included custom layment orders;
- provide real catalog/prices/availability;
- integrate with sales/ERP/CRM.

Do not implement real backend integration in the first PR unless explicitly requested.

## Catalog demo model

The demo catalog must distinguish:

### Tool carts

Each cart has:

- article;
- name;
- previewUrl;
- price;
- shelves.

Each shelf has:

- id;
- name;
- widthMm;
- heightMm;
- capacityUnits = 6.

### Catalog foam insert kits

Each catalog kit has:

- article;
- name;
- previewUrl;
- shelfUnits;
- sizeLabel;
- priceEmpty;
- priceWithTools;
- includedTools.

Included tool price is not displayed as separate price inside a catalog kit, but it must exist in data for future custom layment and loose-tool scenarios.

### Tool items

Each tool has:

- article;
- name;
- price.

Tool price may be used when a tool is added as a separate item or as part of a custom layment composition.

## Layment supply mode

The customer chooses layment supply mode in the workplace configurator, not inside the layment constructor.

Canonical type:

LaymentSupplyMode = "empty" | "with-tools"

Meaning:

- empty: customer orders foam insert only;
- with-tools: customer orders foam insert together with tools/components.

For catalog foam kits:

- empty price = priceEmpty;
- with-tools price = priceWithTools.

For custom layments:

- empty price = custom layment manufacturing price;
- with-tools price = custom layment manufacturing price + selected tool/component prices.

## Parent order vs custom layment order

Do not merge these concepts.

Custom layment order:

- production-oriented order for one foam insert;
- created by external layment constructor;
- has orderId;
- may produce manufacturing artifacts.

Parent workplace order:

- commercial configuration of the whole workplace;
- contains cart, shelves, catalog kits, loose tools, and custom layment references;
- confirms included custom layment orders only when the parent order is confirmed.

Lifecycle:

1. Custom layment created.
2. Custom layment result returned to configurator.
3. User reviews full workplace order.
4. Parent order confirmed.
5. Configurator sends confirmed for included custom layment orders.

Do not confirm custom layment orders immediately after creation.

## State rules

Keep state simple and explicit.

Recommended core state:

- selectedCartArticle
- activeShelfId
- laymentSupplyMode
- shelfPlacements
- looseTools
- customLaymentResults
- wizardStep

Avoid introducing global state managers in the first PR.
Vue reactive state/composables are enough.

If state grows later, extract composables first:

- useWorkplaceConfig
- useWizardFlow
- usePriceSummary
- useCustomLaymentBridge

Do not add Pinia/Vuex in the first PR unless explicitly requested.

## Styling rules

Use plain CSS or scoped Vue component CSS.

The demo should look like a polished industrial B2B configurator:

- clean layout;
- restrained colors;
- clear cards;
- clear progress indicator;
- visible current cart and shelf;
- readable price summary;
- no excessive animation.

Do not depend on a heavy UI kit in the first PR.

## Integration rules

The first PR may include a stub bridge:

- launchCustomLayment(request)
- handleCustomLaymentResult(result)

The bridge may use mock data for now.
Do not implement real cross-window postMessage flow in PR 1 unless explicitly requested.

Future integration may use:

- window.open
- postMessage
- localStorage/sessionStorage fallback
- backend draft/order id

## Testing / verification

At minimum, the first PR must support:

- npm install
- npm run dev
- npm run build

The app must run through Vite dev server.
Do not treat opening index.html from disk as a valid integration check.

## What not to do in the first PR

Do not:

- implement real backend API;
- import real catalog data;
- add real product photos;
- add drag-and-drop;
- add authentication;
- add user account / personal cabinet;
- add ERP/1C integration;
- add PDF generation;
- add complex compatibility rules;
- add custom layment editor implementation;
- mix layment editor internals into this repo.

## Coding preferences

Prefer:

- small typed models;
- explicit functions;
- simple Vue components;
- readable state transitions;
- deterministic price calculation;
- minimal abstractions.

Avoid:

- premature generic engines;
- over-normalized state;
- framework-specific complexity for domain logic;
- hidden conversions of dimensions;
- ambiguous naming around shelf size.

## Terminology

Use:

- workplace configurator
- tool cart
- shelf
- shelf units
- shelf capacity
- foam insert kit
- catalog kit
- custom layment
- parent workplace order
- layment supply mode

Avoid:

- generic CAD terms for the configurator shell;
- slotFraction as a canonical domain field;
- treating the custom layment constructor as part of Vue shell internals.
