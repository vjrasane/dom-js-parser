import freeze from "deep-freeze";
import { exists } from "~/utils";
import { Update } from "~/engine/update";
import { Cmd, processCommand } from "~/engine/command";

export default (procedure, dispatchMsg) => (context, model) => {
  const processed = procedure(context, model);
  if (processed instanceof Update) {
    processed.cmds.forEach(cmd => processCommand(cmd, dispatchMsg));
    return freeze(processed.model);
  } else if (processed instanceof Cmd) {
    processCommand(processed, dispatchMsg);
    return model;
  } else if (exists(processed)) {
    return freeze(processed);
  }
  return model;
};
