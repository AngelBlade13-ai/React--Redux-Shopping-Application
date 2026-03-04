/* eslint-disable no-console */
"use strict";

const path = require("path");
const fs = require("fs");
const os = require("os");

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getExtFromMime(mimeType) {
  if (!mimeType) return "jpg";
  if (mimeType.includes("png")) return "png";
  if (mimeType.includes("webp")) return "webp";
  return "jpg";
}

async function downloadToTemp(url, filenameBase) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const mimeType = res.headers.get("content-type") || "image/jpeg";
  const ext = getExtFromMime(mimeType);
  const filename = `${filenameBase}.${ext}`;

  const tmpPath = path.join(os.tmpdir(), filename);
  fs.writeFileSync(tmpPath, buffer);
  return { tmpPath, fileName: filename, mimeType };
}

async function uploadFileToStrapi(strapi, filePath, fileName, mimeType) {
  const uploadService =
    (strapi.plugin && strapi.plugin("upload")?.service("upload")) ||
    (strapi.plugins && strapi.plugins.upload?.services?.upload);

  if (!uploadService) {
    throw new Error("Upload plugin service not found. Is the upload plugin enabled?");
  }

  const stats = fs.statSync(filePath);
  const fileNameNoExt = fileName.replace(/\.[^/.]+$/, "");

  const uploaded = await uploadService.upload({
    data: {
      fileInfo: {
        name: fileNameNoExt,
        caption: fileNameNoExt,
        alternativeText: fileNameNoExt,
      },
    },
    files: {
      filepath: filePath,
      originalFileName: fileName,
      mimetype: mimeType,
      size: stats.size,
    },
  });

  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  if (!file?.id) throw new Error("Upload succeeded but no file id returned.");
  return file.id;
}

async function getOrCreateCategoryId(strapi, categoryName) {
  const existing = await strapi.db.query("api::category.category").findOne({
    where: { title: categoryName },
    select: ["id"],
  });

  if (existing?.id) return existing.id;

  const created = await strapi.entityService.create("api::category.category", {
    data: {
      title: categoryName,
      desc: `Seeded from Fake Store API category: ${categoryName}`,
    },
  });

  return created.id;
}

function getSubCategoryTitles(product) {
  const title = String(product.title || "").toLowerCase();
  const category = String(product.category || "").toLowerCase();

  if (category.includes("electronics")) {
    if (title.includes("ssd") || title.includes("hard drive")) return ["Storage", "Computer"];
    if (title.includes("monitor") || title.includes("gaming")) return ["Gaming", "Displays"];
    return ["Electronics", "Accessories"];
  }

  if (category.includes("jewel")) {
    if (title.includes("ring")) return ["Rings", "Luxury"];
    if (title.includes("bracelet")) return ["Bracelets", "Luxury"];
    return ["Jewelry", "Accessories"];
  }

  if (category.includes("women")) {
    if (title.includes("jacket") || title.includes("coat")) return ["Outerwear", "Women"];
    if (title.includes("shirt")) return ["Tops", "Women"];
    return ["Women", "Apparel"];
  }

  if (category.includes("men")) {
    if (title.includes("jacket") || title.includes("coat")) return ["Outerwear", "Men"];
    if (title.includes("shirt")) return ["Tops", "Men"];
    return ["Men", "Apparel"];
  }

  return ["General", "Apparel"];
}

async function getOrCreateSubCategoryId(strapi, subCategoryName, categoryId) {
  const existing = await strapi.db.query("api::sub-category.sub-category").findOne({
    where: { title: subCategoryName },
    select: ["id"],
  });

  if (existing?.id) {
    const existingDoc = await strapi.entityService.findOne("api::sub-category.sub-category", existing.id, {
      populate: ["categories"],
    });
    const attachedCategoryIds =
      existingDoc?.categories?.map((category) => category.id) ||
      existingDoc?.data?.attributes?.categories?.data?.map((category) => category.id) ||
      [];

    if (!attachedCategoryIds.includes(categoryId)) {
      await strapi.entityService.update("api::sub-category.sub-category", existing.id, {
        data: {
          categories: [...attachedCategoryIds, categoryId],
          publishedAt: Date.now(),
        },
      });
    }

    return existing.id;
  }

  const created = await strapi.entityService.create("api::sub-category.sub-category", {
    data: {
      title: subCategoryName,
      categories: [categoryId],
      publishedAt: Date.now(),
    },
  });

  return created.id;
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");

  const appContext = await compileStrapi();
  const strapi = await createStrapi(appContext).load();

  const productsRes = await fetch("https://fakestoreapi.com/products");
  if (!productsRes.ok) {
    throw new Error(`Failed to fetch Fake Store products: ${productsRes.status} ${productsRes.statusText}`);
  }
  const sourceProducts = await productsRes.json();
  if (!Array.isArray(sourceProducts) || sourceProducts.length === 0) {
    throw new Error("Fake Store API returned no products.");
  }

  await strapi.db.query("api::product.product").deleteMany({ where: {} });

  for (const item of sourceProducts) {
    const key = `fakestore-${item.id}-${slugify(item.title).slice(0, 30)}`;
    const mainDownload = await downloadToTemp(item.image, `${key}-main`);
    const altDownload = await downloadToTemp(item.image, `${key}-alt`);

    const imgId1 = await uploadFileToStrapi(
      strapi,
      mainDownload.tmpPath,
      mainDownload.fileName,
      mainDownload.mimeType
    );
    const imgId2 = await uploadFileToStrapi(strapi, altDownload.tmpPath, altDownload.fileName, altDownload.mimeType);
    const categoryId = await getOrCreateCategoryId(strapi, item.category);
    const subCategoryTitles = getSubCategoryTitles(item);
    const subCategoryIds = [];

    for (const subCategoryTitle of subCategoryTitles) {
      const subCategoryId = await getOrCreateSubCategoryId(strapi, subCategoryTitle, categoryId);
      subCategoryIds.push(subCategoryId);
    }

    const product = await strapi.entityService.create("api::product.product", {
      data: {
        title: item.title,
        desc: item.description,
        price: item.price,
        isNew: item.id % 2 === 0,
        img: imgId1,
        img2: imgId2,
        categories: [categoryId],
        sub_categories: subCategoryIds,
        publishedAt: Date.now(),
      },
    });

    fs.unlinkSync(mainDownload.tmpPath);
    fs.unlinkSync(altDownload.tmpPath);

    console.log(`Created: ${product.title}`);
  }

  console.log("Seeding complete.");
  await strapi.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
