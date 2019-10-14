import { exists, mapValues } from "~/utils";
import { Effect } from "~/engine/effect";

export const queues = {
  msg: [],
  effect: []
};

const dispatcher = queue => queueable =>
  exists(queueable) && queue.push(queueable);

const dispatchers = mapValues(queues, dispatcher);

export const dispatch = queueable =>
  queueable instanceof Effect
    ? dispatchers.effect(queueable)
    : dispatchers.msg(queueable);
