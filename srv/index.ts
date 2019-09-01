import config from "./config";
import * as express from "express";
// @ts-ignore
import session from "express-session";
import { resolve } from "path";
import { read, write } from "./files";
import { forgeLogin, forgeMiddleware, getLibrary, getLibraries } from "./forge";
import { Tool } from "./tool";
import { Inventory } from "./inventory";
import { linuxcnc } from "./linuxcnc";

export default (app: any) => {
  app.use(express.json());

  app.use(
    session({
      // @ts-ignore
      key: "fusion-inventory",
      secret: config.session.secret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.SECURE === "true"
      }
    })
  );

  app.post("/updateTool", async (req, res) => {
    const { userId, tool } = req.body;
    const inventory = (await read(userId)) || {};

    if (!inventory.tools) {
      throw new Error("No tool library.");
    }

    let inventoryTool = inventory.tools.find((t: any) => t.guid === tool.guid);

    if (!inventoryTool) {
      throw new Error("Tool not found.");
    }

    inventoryTool = Object.assign(inventoryTool, tool);

    await write(userId, inventory);
    res.json({ ok: true });
  });

  app.post("/update", forgeMiddleware, async (req, res) => {
    const { user } = req.session;
    const { tool } = req.body;
    const inventory = (await read(user.userId)) || {};

    if (!inventory.tools) {
      throw new Error("No tool library.");
    }

    let inventoryTool = inventory.tools.find((t: any) => t.guid === tool.guid);

    if (!inventoryTool) {
      throw new Error("Tool not found.");
    }

    inventoryTool = Object.assign(inventoryTool, tool);

    await write(user.userId, inventory);
    res.json({ ok: true });
  });

  app.post("/updateSettings", forgeMiddleware, async (req, res) => {
    const { user } = req.session;
    const {
      perPage,
      fusionColumns,
      extraColumns,
      userColumns,
      unit
    } = req.body;
    const inventory = (await read(user.userId)) || {};

    inventory.settings.fusionColumns = fusionColumns;
    inventory.settings.extraColumns = extraColumns;
    inventory.settings.userColumns = userColumns;
    inventory.settings.perPage = perPage;
    inventory.settings.unit = unit;
    await write(user.userId, inventory);

    res.json({ ok: true });
  });

  app.get("/libraries", forgeMiddleware, async (req, res) => {
    const { user, credentials } = req.session;

    const inventoryFile = (await read(user.userId)) || {};
    const inventory = new Inventory(inventoryFile);
    const forgeLibrariesMeta = await getLibraries(credentials);
    const forgeLibraries = await Promise.all(
      forgeLibrariesMeta.map(async (library: any) => {
        const result = await getLibrary(
          credentials,
          library.projectId,
          library.id
        );
        return result.map((forgeTool: any) => {
          return new Tool({
            inventory,
            forgeTool,
            library
          });
        });
      })
    );
    const tools = [].concat(...forgeLibraries);

    tools.forEach((tool: any) => inventory.update(tool));
    inventory.sort();
    inventory.clean();
    inventory.settings.language = user.language;
    await write(user.userId, inventory);

    res.json({
      inventory,
      user
    });
  });

  app.get("/tool/:userId/:guid", async (req, res) => {
    const { userId, guid } = req.params;
    const inventoryFile = (await read(userId)) || {};

    if (!inventoryFile.tools) {
      throw new Error("No tool library.");
    }

    const inventoryTool = inventoryFile.tools.find((t: any) => t.guid === guid);

    if (!inventoryTool) {
      throw new Error("Tool not found.");
    }

    res.json({
      settings: inventoryFile.settings,
      tool: inventoryTool
    });
  });

  app.get("/download/inventory.json", forgeMiddleware, async (req, res) => {
    const { user } = req.session;
    const inventoryFile = (await read(user.userId)) || {};
    res.type(".json");
    res.send(inventoryFile);
  });

  app.get("/download/linuxcnc.tools", forgeMiddleware, linuxcnc);

  app.get("/callback", forgeMiddleware, (_, res) => {
    res.redirect("/");
  });

  app.get("/login", forgeLogin);

  const publicPath = resolve(__dirname, "../dist");
  app.use(express.static(publicPath));
};
