import useSWR from "swr";

export let swrState = {
  str: "Hi there",
  num: 940716,
  obj: { fn: "Jang", ln: "Noah" },
  arr: [{ zero: 0 }, "two", 3, null, () => {}],
  dArr: [
    [1, 2, 3],
    [4, 5, 6],
  ],
  cards: [
    {
      id: 1,
      title: "Hello SWR State1",
      content: "Some Contents...1",
      date: new Date(),
    },
    {
      id: 2,
      title: "Hello SWR State2",
      content: "Some Contents...2",
      date: new Date(),
    },
    {
      id: 3,
      title: "Hello SWR State3",
      content: "Some Contents...3",
      date: new Date(),
    },
    {
      id: 4,
      title: "Hello SWR State4",
      content: "Some Contents...4",
      date: new Date(),
    },
  ],
};

interface ICard {
  id: number;
  title: string;
  content: string;
  date: Date;
}

export interface ISwrState {
  str: string;
  num: number;
  obj: object;
  arr: any[];
  dArr: Array<Array<number>>;
  cards: ICard[];
}

export type ESwrStateKeys = keyof typeof swrState;

declare global {
  export interface Window {
    swrState: ISwrState;
  }
}

export const initSwrState = () => {
  if (typeof window !== "undefined") {
    window.swrState = swrState;
  }
};

function mutator(key: ESwrStateKeys | `${string}.${any}`, value: any) {
  if (key.match(/\./g)) {
    const input = key.split(/\./g);
    let stateArr: any[] = [];
    let targetState = targetStateFinder(input, stateArr);

    // Build State from lastState to mainState with stateBuilder and StateArr
    let stateBuilder = null;
    let lastState = stateArr[stateArr.length - 1];
    let lastInput = input[input.length - 1];

    if (Array.isArray(lastState)) {
      stateBuilder = lastState;
      stateBuilder[parseInt(lastInput)] =
        typeof value === "function"
          ? value(targetState[parseInt(lastInput)])
          : value;
    } else {
      stateBuilder = {
        ...lastState,
        [lastInput]:
          typeof value === "function" ? value(targetState[lastInput]) : value,
      };
    }

    for (let i = stateArr.length - 1; i > 0; i--) {
      let currentState = input[i];
      let previousState = stateArr[i - 1];

      if (Array.isArray(previousState)) {
        let arr = previousState;
        arr[parseInt(currentState)] = stateBuilder;
        stateBuilder = arr;
      } else {
        stateBuilder = {
          ...previousState,
          [currentState]: stateBuilder,
        };
      }
    }
    const copyState = {
      ...swrState,
      [input[0] as ESwrStateKeys]: stateBuilder,
    };
    window.swrState = copyState;
    swrState = copyState;
  } else {
    const copyState = {
      ...swrState,
      [key as ESwrStateKeys]:
        typeof value === "function"
          ? value(swrState[key as ESwrStateKeys])
          : value,
    };
    window.swrState = copyState;
    swrState = copyState;
  }
}

function targetStateFinder(input: string[], stateArr?: any[]) {
  // Pick initiate state

  let targetState: { [key in string]: any } = swrState[
    input[0] as ESwrStateKeys
  ] as Object;

  if (stateArr) stateArr.push(targetState);

  // Find Target State in Obj or Arr by using loop
  for (let i = 1; i < input.length - (stateArr ? 1 : 0); i++) {
    let temp = targetState[input[i]];
    if (!temp) throw new Error("잘못된 프로퍼티 키 입니다.");
    if (stateArr) stateArr.push(temp);
    targetState = temp;
  }

  return targetState;
}

export const useGlobalState = () => {
  const { data, mutate, error } = useSWR("swrState", () => window.swrState);
  if (error) new Error("에러가 발생했습니다.");
  return {
    data,
    mutate: (key: ESwrStateKeys | `${string}.${any}`, value: any) => {
      mutator(key, value);
      mutate();
    },
    error,
  };
};

export const useOneState = (
  key: ESwrStateKeys | `${string}.${any}`,
  alias?: string
) => {
  const { data, mutate, error } = useSWR("swrState", () => window.swrState.arr);
  if (error || !swrState) new Error("에러가 발생했습니다.");

  const isChainingKey = key.match(/\./g);
  const res: { [key in string]: any } = {
    mutate: (value: any) => {
      mutator(key, value);
      mutate();
    },
    error,
  };

  let targetState: any = isChainingKey
    ? targetStateFinder(key.split(/\./g))
    : swrState[key as ESwrStateKeys];

  res[alias ? alias : "data"] = targetState;
  return res;
};

export const useManyState = (
  keys: Array<ESwrStateKeys | `${string}.${any}`>,
  aliases: string[]
) => {
  const data: { [key in string]: any } = {};
  const mutate: { [key in string]: any } = {};
  const error: { [key in string]: any } = {};
  if (keys.length > aliases.length) {
    throw new Error("데이터 길이에 맞는 별명을 지정해주세요.");
  }
  keys.forEach((key, i) => {
    const obj = useOneState(key, aliases[i]);
    data[aliases[i]] = obj[aliases[i]];
    mutate[aliases[i]] = obj.mutate;
    error[aliases[i]] = obj.error;
  });
  return { data, mutate, error };
};
