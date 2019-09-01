// @ts-ignore
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId();

export interface ITool {}

export class Tool {
  public tuid: string;
  public guid: string;
  public name: string;
  public postProcess: number;
  public vendor: string;
  public productId: string;
  public productType: string;
  public productLink: string;
  public numberOfFlutes: number;
  public diameter: number;
  public shaftDiameter: number;
  public fluteLength: number;
  public shoulderLength: number;
  public bodyLength: number;
  public overallLength: number;
  public libraryId: string;
  public libraryName: string;
  public unit: string;
  public updated: boolean;

  constructor(params: any) {
    const { forgeTool, library } = params;

    this.guid = forgeTool.guid;
    this.name = forgeTool.description;
    this.vendor = forgeTool["vendor"];
    this.productId = forgeTool["product-id"];
    this.productType = forgeTool["type"];
    this.productLink = forgeTool["product-link"];
    this.unit = forgeTool["unit"];

    if (forgeTool["post-process"]) {
      this.postProcess = forgeTool["post-process"].number || -1;
    } else {
      this.postProcess = -1;
    }

    if (forgeTool["geometry"]) {
      this.numberOfFlutes = forgeTool["geometry"]["NOF"];
      this.diameter = forgeTool["geometry"]["DC"];
      this.shaftDiameter = forgeTool["geometry"]["SFDM"];
      this.fluteLength = forgeTool["geometry"]["LCF"];
      this.shoulderLength = forgeTool["geometry"]["shoulder-length"];
      this.bodyLength = forgeTool["geometry"]["LB"];
      this.overallLength = forgeTool["geometry"]["OAL"];
    }

    this.libraryId = library.id;
    this.libraryName = library.name;
    this.tuid = library.tuid || uid.randomUUID(6);
  }
}
