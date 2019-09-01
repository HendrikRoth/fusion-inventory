import * as Forge from "forge-apis";
import Request from "request-promise-native";
import config from "./config";

const auth = new Forge.AuthClientThreeLegged(
  config.autodesk.client_id,
  config.autodesk.client_secret,
  config.autodesk.redirect_url,
  ["data:read", "data:write"],
  config.autodesk.auto_refresh
);

const UserApi = new Forge.UserProfileApi();
const HubsApi = new Forge.HubsApi();
const ProjectsApi = new Forge.ProjectsApi();
const FoldersApi = new Forge.FoldersApi();
const ItemsApi = new Forge.ItemsApi();

export async function forgeLogin(req, res) {
  const authUrl = auth.generateAuthUrl();
  res.redirect(authUrl);
}

export async function forgeMiddleware(req, res, next) {
  if (!req.session.credentials) {
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
      //      const authUrl = auth.generateAuthUrl();
      //      res.redirect(authUrl);
      const err = new Error("Not logged in");
      return next(err);
    } else {
      req.session.credentials = await auth.getToken(authorizationCode);
      const userProfileResult = await UserApi.getUserProfile(
        auth,
        req.session.credentials
      );
      req.session.user = userProfileResult.body;
      return next();
    }
  }
  return next();
}

export async function getLibrary(
  credentials: any,
  projectId: string,
  libId: string
) {
  const itemResult = await ItemsApi.getItem(
    projectId,
    libId,
    auth,
    credentials
  );

  const fileLocation =
    itemResult.body.included[0].relationships.storage.meta.link.href;

  const requestOptions = {
    auth: {
      bearer: credentials.access_token
    }
  };
  const contentResult = await Request(fileLocation, requestOptions);
  const content = JSON.parse(contentResult).data;

  return content;
}

export async function getLibraries(credentials: any) {
  const hubsResult = await HubsApi.getHubs({}, auth, credentials);
  const hubs = hubsResult.body.data;
  const hub = hubs[0];

  const projectsResult = await ProjectsApi.getHubProjects(
    hub.id,
    {},
    auth,
    credentials
  );

  const projects = projectsResult.body.data;
  const assetsProject = projects.find(
    (project: any) => project.attributes.name === "Assets"
  );

  const assetsFolder = assetsProject.relationships.rootFolder.data;

  const foldersResult = await FoldersApi.getFolderContents(
    assetsProject.id,
    assetsFolder.id,
    {},
    auth,
    credentials
  );

  const folders = foldersResult.body.data;

  const toolFolder = folders.find(
    (folder: any) => folder.attributes.name === "CAMTools"
  );

  const toolFolderResult = await FoldersApi.getFolderContents(
    assetsProject.id,
    toolFolder.id,
    {},
    auth,
    credentials
  );

  const libraries = toolFolderResult.body.data.map((tf: any) => {
    return {
      id: tf.id,
      name: tf.attributes.displayName.replace(/\.[^/.]+$/, ""),
      folderId: assetsFolder.id,
      projectId: assetsProject.id,
      userId: tf.attributes.createUserId,
      userName: tf.attributes.createUserName,
      lastModified: tf.attributes.lastModifiedTime
    };
  });

  return libraries;
}
