import freeze from "deep-freeze";
import { exists } from "~/utils";
import { Return } from "~/engine/return";
import { Effect } from "~/engine/effect";

export default (procedure, dispatchMsg) => (context, model) => {
  const processed = procedure(context, model);
  if (processed instanceof Return) {
    processed.effects.forEach(
      effect => effect instanceof Effect && effect.dispatch(dispatchMsg)
    );
    return freeze(processed.model);
  } else if (processed instanceof Effect) {
    processed.dispatch(dispatchMsg);
    return model;
  } else if (exists(processed)) {
    return freeze(processed);
  }
  return model;
};
