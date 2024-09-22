// import type { Message, PluginMessageEvent } from "../../src/globals";
import type { EventTS } from "../../shared/universals";

export const dispatch = (data: any, origin = "*") => {
  // TODO
};

export const dispatchTS = <Key extends keyof EventTS>(
  event: Key,
  data: EventTS[Key],
  origin = "*"
) => {
  dispatch({ event, data }, origin);
};

export const listenTS = <Key extends keyof EventTS>(
  eventName: Key,
  callback: (data: EventTS[Key]) => any,
  listenOnce = false
) => {
  const func = (event: any) => {
    if (event.event === eventName) {
      callback(event);
      if (listenOnce) {
        // TODO
      }
    }
  };

  // TODO
};

export const getStore = async (key: string) => {
  // TODO
};

export const setStore = async (key: string, value: string) => {
  // TODO
};
