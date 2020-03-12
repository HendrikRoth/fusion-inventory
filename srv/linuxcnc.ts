import { read } from "./files";
import { Tool } from "./tool";

export async function matchLinuxcnc(req, res) {
  const { user } = req.session;
  const inventory = (await read(user.userId)) || {};
  const { tools } = inventory;
  const upload = req.file.buffer.toJSON();

  upload.forEach(line => {
    const data = line.split(";");
    const match = data[1].test(/([^.]*){{([^.]*)}}/gi);
    const name = match[0];
    const id = match[1];
    // TODO
    const parameters = data[0].test(/T([^.]+)*/gi);
  });
}

export async function linuxcnc(req, res) {
  const { user } = req.session;
  const inventory = (await read(user.userId)) || {};
  const { tools } = inventory;

  const result = tools
    .filter((tool: Tool) => tool.productType !== "holder")
    .map((tool: Tool) => {
      return `T${tool.postProcess} P${tool.pocket || 0} X${tool.x_offset || 0} Y${tool.y_offset || 0} Z${tool.z_offset || 0} A${tool.a_offset || 0} B${tool.b_offset} D${tool.diameter} ;${
        tool.vendor
      } ${tool.name} {{${tool.tuid}}}`;
    });

  res.type(".tools");
  res.send(result.join("\n"));
}
