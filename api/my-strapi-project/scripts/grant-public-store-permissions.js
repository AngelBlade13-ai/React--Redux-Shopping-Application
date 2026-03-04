"use strict";

async function setPublicPermissions(strapi, permissionMap) {
  const publicRole = await strapi.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
  });

  if (!publicRole) {
    throw new Error("Public role not found.");
  }

  for (const [controller, actions] of Object.entries(permissionMap)) {
    for (const action of actions) {
      const actionName = `api::${controller}.${controller}.${action}`;
      const exists = await strapi.query("plugin::users-permissions.permission").findOne({
        where: { action: actionName, role: publicRole.id },
      });

      if (!exists) {
        await strapi.query("plugin::users-permissions.permission").create({
          data: {
            action: actionName,
            role: publicRole.id,
          },
        });
      }
    }
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require("@strapi/strapi");
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  await setPublicPermissions(app, {
    product: ["find", "findOne"],
    "sub-category": ["find", "findOne"],
    category: ["find", "findOne"],
    order: ["create"],
  });

  console.log("Public permissions granted for store APIs.");
  await app.destroy();
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to grant public permissions:", err);
  process.exit(1);
});
