import freeze from "deep-freeze";
import { exists } from "~/utils";
import { Return } from "~/engine/return";
import { Effect } from "~/engine/effect";

export default (procedure, dispatch) => (context, model) => {
  const processed = procedure(context, model);
  if (processed instanceof Return) {
    processed.effects.forEach(dispatch);
    return freeze(processed.model);
  } else if (processed instanceof Effect) {
    dispatch(processed);
    return model;
  } else if (exists(processed)) {
    return freeze(processed);
  }
  return model;
};
