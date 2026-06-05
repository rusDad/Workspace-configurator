import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CATALOG_PATH = path.join(ROOT_DIR, 'src', 'catalog', 'demoCatalog.ts');

const SOURCE_DIRS = {
  carts: path.join(ROOT_DIR, 'asset-import', 'carts'),
  kits: path.join(ROOT_DIR, 'asset-import', 'kits'),
};

const OUTPUT_DIRS = {
  carts: path.join(ROOT_DIR, 'public', 'catalog-assets', 'carts'),
  kits: path.join(ROOT_DIR, 'public', 'catalog-assets', 'kits'),
  shelfKits: path.join(ROOT_DIR, 'public', 'catalog-assets', 'shelf-kits'),
  placeholders: path.join(ROOT_DIR, 'public', 'catalog-assets', 'placeholders'),
};

const PLACEHOLDER_URLS = {
  carts: '/catalog-assets/placeholders/cart-placeholder.svg',
  kits: '/catalog-assets/placeholders/kit-placeholder.svg',
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const KIT_CANVAS = { width: 570, height: 390 };
const CART_CANVAS = { width: 720, height: 570 };
const LIGHT_GRAY = { r: 243, g: 246, b: 248, alpha: 1 };

function normalizeArticleToAssetName(article, index = 0) {
  const normalized = article
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return normalized || `asset-${index}`;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function ensureDirectories() {
  await Promise.all([
    fs.mkdir(SOURCE_DIRS.carts, { recursive: true }),
    fs.mkdir(SOURCE_DIRS.kits, { recursive: true }),
    fs.mkdir(OUTPUT_DIRS.carts, { recursive: true }),
    fs.mkdir(OUTPUT_DIRS.kits, { recursive: true }),
    fs.mkdir(OUTPUT_DIRS.shelfKits, { recursive: true }),
    fs.mkdir(OUTPUT_DIRS.placeholders, { recursive: true }),
  ]);
}

async function writePlaceholders() {
  const kitPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="570" height="390" viewBox="0 0 570 390" role="img" aria-labelledby="title desc">
  <title id="title">Kit image placeholder</title>
  <desc id="desc">Neutral placeholder for a foam insert kit image.</desc>
  <rect width="570" height="390" rx="18" fill="#f3f6f8"/>
  <rect x="64" y="78" width="442" height="234" rx="18" fill="#e1e8ec" stroke="#b9c8d0" stroke-width="4"/>
  <path d="M124 142h116v42H124zM270 142h176v42H270zM124 214h92v42h-92zM248 214h198v42H248z" fill="#c7d3da"/>
  <text x="285" y="346" text-anchor="middle" fill="#66737d" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">Foam kit image</text>
</svg>
`;

  const cartPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="570" viewBox="0 0 720 570" role="img" aria-labelledby="title desc">
  <title id="title">Cart image placeholder</title>
  <desc id="desc">Neutral placeholder for a tool cart image.</desc>
  <rect width="720" height="570" rx="18" fill="#f3f6f8"/>
  <rect x="190" y="120" width="340" height="292" rx="22" fill="#e1e8ec" stroke="#b9c8d0" stroke-width="5"/>
  <path d="M226 178h268M226 236h268M226 294h268M226 352h268" stroke="#c0ccd3" stroke-width="12" stroke-linecap="round"/>
  <circle cx="252" cy="448" r="28" fill="#66737d"/>
  <circle cx="468" cy="448" r="28" fill="#66737d"/>
  <text x="360" y="516" text-anchor="middle" fill="#66737d" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">Tool cart image</text>
</svg>
`;

  await Promise.all([
    fs.writeFile(path.join(OUTPUT_DIRS.placeholders, 'kit-placeholder.svg'), kitPlaceholder, 'utf8'),
    fs.writeFile(path.join(OUTPUT_DIRS.placeholders, 'cart-placeholder.svg'), cartPlaceholder, 'utf8'),
  ]);
}

async function scanSourceImages(sourceDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const images = new Map();

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isFile()) continue;

    const extension = path.extname(entry.name);
    if (!IMAGE_EXTENSIONS.has(extension.toLowerCase())) continue;

    const article = path.basename(entry.name, extension);
    if (!images.has(article)) {
      images.set(article, path.join(sourceDir, entry.name));
    }
  }

  return images;
}

function getArrayBody(source, exportName) {
  const declaration = `export const ${exportName}`;
  const declarationIndex = source.indexOf(declaration);
  if (declarationIndex === -1) {
    throw new Error(`Could not find ${declaration} in demoCatalog.ts`);
  }

  const assignmentIndex = source.indexOf('=', declarationIndex);
  if (assignmentIndex === -1) {
    throw new Error(`Could not find assignment for ${exportName}`);
  }

  const arrayStart = source.indexOf('[', assignmentIndex);
  if (arrayStart === -1) {
    throw new Error(`Could not find array start for ${exportName}`);
  }

  let depth = 0;
  let quote = null;
  let isEscaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;
      if (depth === 0) {
        return {
          before: source.slice(0, arrayStart + 1),
          body: source.slice(arrayStart + 1, index),
          after: source.slice(index),
        };
      }
    }
  }

  throw new Error(`Could not find array end for ${exportName}`);
}

function parseTopLevelItems(arrayBody) {
  const itemSources = [];
  const items = [];
  let depth = 0;
  let startIndex = null;
  let quote = null;
  let isEscaped = false;

  for (let index = 0; index < arrayBody.length; index += 1) {
    const char = arrayBody[index];

    if (quote) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === '{') {
      if (depth === 0) startIndex = index;
      depth += 1;
    } else if (char === '}') {
      depth -= 1;
      if (depth === 0 && startIndex !== null) {
        itemSources.push(arrayBody.slice(startIndex, index + 1));
        startIndex = null;
      }
    }
  }

  for (const itemSource of itemSources) {
    const articleMatch = itemSource.match(/^\s*article: '([^']+)',/m);
    if (!articleMatch) continue;

    const shelfUnitsMatch = itemSource.match(/^\s*shelfUnits: (\d+),/m);
    items.push({
      article: articleMatch[1],
      shelfUnits: shelfUnitsMatch ? Number(shelfUnitsMatch[1]) : null,
    });
  }

  return items;
}

function updateTopLevelPreviewUrls(arrayBody, urlsByArticle) {
  let updatedBody = arrayBody;

  for (const [article, previewUrl] of urlsByArticle) {
    const articlePattern = escapeRegExp(article);
    const itemPattern = new RegExp(
      `(^  \\{\\r?\\n    article: '${articlePattern}',[\\s\\S]*?^    previewUrl: )(null|'[^']*')(,)`,
      'm',
    );

    updatedBody = updatedBody.replace(itemPattern, `$1'${previewUrl}'$3`);
  }

  return updatedBody;
}

async function processCartImage(inputPath, outputPath) {
  await sharp(inputPath)
    .rotate()
    .resize({
      width: CART_CANVAS.width,
      height: CART_CANVAS.height,
      fit: 'contain',
      background: LIGHT_GRAY,
    })
    .flatten({ background: LIGHT_GRAY })
    .webp({ quality: 86 })
    .toFile(outputPath);
}

async function createNormalizedKitBuffer(inputPath, shelfUnits) {
  const visibleWidth = Math.round((KIT_CANVAS.width * (shelfUnits || 6)) / 6);

  return sharp(inputPath)
    .rotate()
    .resize({
      width: visibleWidth,
      height: KIT_CANVAS.height,
      fit: 'fill',
    })
    .webp({ quality: 86 })
    .toBuffer();
}

async function processKitCardImage(inputPath, outputPath, shelfUnits) {
  const visibleWidth = Math.round((KIT_CANVAS.width * (shelfUnits || 6)) / 6);
  const normalized = await createNormalizedKitBuffer(inputPath, shelfUnits);

  await sharp({
    create: {
      width: KIT_CANVAS.width,
      height: KIT_CANVAS.height,
      channels: 4,
      background: LIGHT_GRAY,
    },
  })
    .composite([
      {
        input: normalized,
        left: 0,
        top: 0,
      },
    ])
    .webp({ quality: 86 })
    .toFile(outputPath);
}

async function processKitShelfImage(inputPath, outputPath, shelfUnits) {
  const normalized = await createNormalizedKitBuffer(inputPath, shelfUnits);
  await fs.writeFile(outputPath, normalized);
}

async function prepareAssets() {
  await ensureDirectories();
  await writePlaceholders();

  const catalogSource = await fs.readFile(CATALOG_PATH, 'utf8');
  const cartsArray = getArrayBody(catalogSource, 'demoToolCarts');
  const carts = parseTopLevelItems(cartsArray.body);

  const catalogWithCartsPlaceholder = [
    cartsArray.before,
    cartsArray.body,
    cartsArray.after,
  ].join('');
  const kitsArray = getArrayBody(catalogWithCartsPlaceholder, 'demoCatalogKits');
  const kits = parseTopLevelItems(kitsArray.body);

  const cartSources = await scanSourceImages(SOURCE_DIRS.carts);
  const kitSources = await scanSourceImages(SOURCE_DIRS.kits);
  const cartUrls = new Map();
  const kitUrls = new Map();
  let generatedFiles = 0;

  for (const [index, cart] of carts.entries()) {
    const sourcePath = cartSources.get(cart.article);
    if (!sourcePath) {
      cartUrls.set(cart.article, PLACEHOLDER_URLS.carts);
      continue;
    }

    const fileName = `${normalizeArticleToAssetName(cart.article, index)}.webp`;
    const outputPath = path.join(OUTPUT_DIRS.carts, fileName);
    await processCartImage(sourcePath, outputPath);
    cartUrls.set(cart.article, `/catalog-assets/carts/${fileName}`);
    generatedFiles += 1;
  }

  for (const [index, kit] of kits.entries()) {
    const sourcePath = kitSources.get(kit.article);
    if (!sourcePath) {
      kitUrls.set(kit.article, PLACEHOLDER_URLS.kits);
      continue;
    }

    const fileName = `${normalizeArticleToAssetName(kit.article, index)}.webp`;
    const outputPath = path.join(OUTPUT_DIRS.kits, fileName);
    const shelfOutputPath = path.join(OUTPUT_DIRS.shelfKits, fileName);
    await processKitCardImage(sourcePath, outputPath, kit.shelfUnits);
    await processKitShelfImage(sourcePath, shelfOutputPath, kit.shelfUnits);
    kitUrls.set(kit.article, `/catalog-assets/kits/${fileName}`);
    generatedFiles += 2;
  }

  const updatedCartsBody = updateTopLevelPreviewUrls(cartsArray.body, cartUrls);
  const sourceAfterCarts = `${cartsArray.before}${updatedCartsBody}${cartsArray.after}`;
  const updatedKitsArray = getArrayBody(sourceAfterCarts, 'demoCatalogKits');
  const updatedKitsBody = updateTopLevelPreviewUrls(updatedKitsArray.body, kitUrls);

  await fs.writeFile(
    CATALOG_PATH,
    `${updatedKitsArray.before}${updatedKitsBody}${updatedKitsArray.after}`,
    'utf8',
  );

  const matchedCarts = carts.filter((cart) => cartSources.has(cart.article)).length;
  const matchedKits = kits.filter((kit) => kitSources.has(kit.article)).length;

  console.log(`carts matched / missing: ${matchedCarts} / ${carts.length - matchedCarts}`);
  console.log(`kits matched / missing: ${matchedKits} / ${kits.length - matchedKits}`);
  console.log(`generated files count: ${generatedFiles}`);
}

prepareAssets().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
