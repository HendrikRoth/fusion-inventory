import * as fs from "fs-extra";

const DIR = process.env.DATA_DIR || __dirname + "/../data";

export async function read(userId: string): Promise<any> {
  return fs.readJsonSync(`${DIR}/${userId}.json`, { throws: false });
}

export async function write(userId: string, inventory: any) {
  return await fs.outputJson(`${DIR}/${userId}.json`, inventory);
}
