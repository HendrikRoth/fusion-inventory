import { Tool } from "./tool";

const DEFAULT_UNIT = "millimeters";

const DEFAULT_LANGUAGE = "en";

const DEFAULT_FUSION_COLUMNS = [
  { path: "libraryName", visible: false, numeric: false },
  { path: "vendor", visible: false, numeric: false },
  { path: "productId", visible: false, numeric: false },
  { path: "productType", visible: false, numeric: false },
  { path: "numberOfFlutes", visible: true, numeric: true },
  { path: "diameter", visible: true, numeric: true },
  { path: "shaftDiameter", visible: true, numeric: true },
  { path: "fluteLength", visible: false, numeric: true },
  { path: "shoulderLength", visible: false, numeric: true },
  { path: "bodyLength", visible: true, numeric: true },
  { path: "overallLength", visible: false, numeric: true }
];

const DEFAULT_EXTRA_COLUMNS = [
  { path: "tuid", visible: false, numeric: false },
  { path: "rating", visible: true, numeric: false },
  { path: "amount", visible: true, numeric: false }
];

const DEFAULT_USER_COLUMNS = [];

const DEFAULT_PER_PAGE = 20;

export interface IFusionColumn {
  path: string;
  visible: boolean;
  numeric: boolean;
}

export interface IUserColumn extends IFusionColumn {
  label: string;
}

export interface IInventory {
  tools: Tool[];
  settings: {
    fusionColumns?: IFusionColumn[];
    extraColumns?: IFusionColumn[];
    userColumns?: IUserColumn[];
    perPage: number;
    language: string;
    unit: string;
  };
}

export class Inventory implements IInventory {
  public tools: Tool[];
  public settings: {
    fusionColumns?: IFusionColumn[];
    extraColumns?: IFusionColumn[];
    userColumns?: IUserColumn[];
    perPage: number;
    language: string;
    unit: string;
  };

  constructor(params: IInventory) {
    this.tools = Object.assign([], params.tools);

    if (!params.settings) {
      this.settings = {
        fusionColumns: DEFAULT_FUSION_COLUMNS,
        extraColumns: DEFAULT_EXTRA_COLUMNS,
        userColumns: DEFAULT_USER_COLUMNS,
        perPage: DEFAULT_PER_PAGE,
        language: DEFAULT_LANGUAGE,
        unit: DEFAULT_UNIT
      };
    } else {
      this.settings = {
        fusionColumns: Object.assign(
          DEFAULT_FUSION_COLUMNS,
          params.settings.fusionColumns
        ),
        extraColumns: Object.assign(
          DEFAULT_EXTRA_COLUMNS,
          params.settings.extraColumns
        ),
        userColumns: Object.assign(
          DEFAULT_USER_COLUMNS,
          params.settings.userColumns
        ),
        perPage: params.settings.perPage || DEFAULT_PER_PAGE,
        language: params.settings.language || DEFAULT_LANGUAGE,
        unit: params.settings.unit || DEFAULT_UNIT
      };
    }
  }

  public update(params: Tool) {
    const inventoryTool = this.tools.find(
      (tool: Tool) => tool.guid === params.guid
    );
    if (inventoryTool) {
      Object.assign(inventoryTool, params);
      inventoryTool.updated = true;
    } else {
      const options = params;
      options.updated = true;
      this.tools.push(options);
    }
  }

  public sort() {
    this.tools = this.tools.sort((a, b) =>
      a.postProcess > b.postProcess ? 1 : -1
    );
  }

  public clean() {
    this.tools = this.tools
      .filter((tool: Tool) => tool.updated)
      .map((tool: Tool) => {
        delete tool.updated;
        return tool;
      });
  }
}
