import { read } from "./files";
import { Tool } from "./tool";

export async function linuxcnc(req, res) {
  const { user } = req.session;
  const inventory = (await read(user.userId)) || {};
  const { tools } = inventory;

  const result = tools
    .filter((tool: Tool) => tool.productType !== "holder")
    .map((tool: Tool) => {
      return `t${tool.postProcess} p${tool.postProcess} z0 d${tool.diameter} ;${
        tool.vendor
      } ${tool.name} (${tool.tuid})`;
    });

  res.type(".tools");
  res.send(result.join("\n"));
}
