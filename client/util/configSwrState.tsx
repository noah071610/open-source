import useSWR from "swr";

export let swrState = {
  currentTitle: "aaaa",
  obj: { a: 1, b: [4, 5, 6] },
  opps: [1, 2, 3, { deep: [{ deepTwo: 3 }, 1, 3] }],
  dArray: [
    [1, 2, 3],
    [4, 5, 6],
  ],
};

export interface ISwrState {
  currentTitle: string;
  obj: any;
  opps: any;
  dArray: any;
}

export type ESwrStateKeys = keyof typeof swrState;

export type ESwrOneStateKeys = keyof typeof swrState | `${string}.${any}`;

declare global {
  export interface Window {
    swrState: ISwrState;
  }
}

export const initSwrGlobalState = () => {
  if (typeof window !== "undefined") {
    window.swrState = swrState;
  }
};

export const useGlobalState = (initialValue?: {
  [key in any]: any;
}) => {
  const { data, mutate, error } = useSWR("swrState", () => window.swrState);
  if (typeof window !== "undefined" && initialValue) {
    const swrGlobalState: any = {
      ...window.swrState,
    };
    const initiateKeyList = Object.keys(initialValue);
    for (const key of initiateKeyList) {
      let value: any = initialValue[key];
      swrGlobalState[key] = value;
    }
    window.swrState = swrGlobalState;
  }

  if (error) new Error("에러가 발생했습니다.");

  return {
    swr: data as ISwrState,
    mutate: (
      key: ESwrStateKeys | Array<ESwrStateKeys>,
      value: (prev?: any) => any
    ) => {
      const swrGlobalState: any = {
        ...window.swrState,
      };

      if (swrGlobalState != undefined) {
        if (typeof key !== "object") {
          swrGlobalState[key] = value(swrGlobalState[key]);
        } else {
          if (key.every((v) => v in swrState)) {
            for (const _key of key) {
              swrGlobalState[_key] = value(swrGlobalState[_key]);
            }
          } else {
            throw new Error("잘못된 스테이트를 입력했습니다.");
          }
        }
        window.swrState = swrGlobalState;
        swrState = swrGlobalState;
        return mutate();
      } else {
        throw new Error("잘못된 값입니다.");
      }
    },
    error,
  };
};

export const useOneState = (key: ESwrOneStateKeys, naming?: string) => {
  const { data, mutate, error } = useSWR("swrState", () => window.swrState);
  if (error) new Error("에러가 발생했습니다.");
  if (key.match(/\./g)) {
    const list = key.split(/\./g);
    let dataInObj: { [key in string]: any } = swrState[
      list.shift() as ESwrStateKeys
    ] as Object;

    for (let i = 0; i < list.length; i++) {
      let temp = dataInObj[list[i]];
      if (!temp) throw new Error("잘못된 프로퍼티 키 입니다.");
      dataInObj = temp;
    }
    const data: { [key in string]: any } = {
      mutate: (value: (prev?: any) => any) => {
        const swrGlobalState: any = {
          ...window.swrState,
        };
        if (swrGlobalState != undefined) {
          const list = key.split(".");

          let objArr = [];
          let objPicker: { [key in string]: any } = swrState[
            list[0] as ESwrStateKeys
          ] as Object;

          objArr.push(objPicker);

          for (let i = 1; i < list.length - 1; i++) {
            let temp = objPicker[list[i]];
            if (!temp) throw new Error("잘못된 프로퍼티 키 입니다.");
            objArr.push(temp);
            objPicker = temp;
          }

          let target = null;
          if (Array.isArray(objArr[objArr.length - 1])) {
            target = objArr[objArr.length - 1];
            target[list[list.length - 1]] = value(dataInObj);
          } else {
            target = {
              ...objArr[objArr.length - 1],
              [list[list.length - 1]]: value(dataInObj),
            };
          }

          for (let i = objArr.length - 1; i > 0; i--) {
            if (Array.isArray(objArr[i - 1])) {
              let arr = [];
              arr = objArr[i - 1];
              arr[list[i]] = target;
              target = arr;
            } else {
              target = { ...objArr[i - 1], [list[i]]: target };
            }
          }

          swrGlobalState[list[0] as ESwrOneStateKeys] = target;
          window.swrState = swrGlobalState;
          swrState = swrGlobalState;
          return mutate();
        } else {
          throw new Error("잘못된 값입니다.");
        }
      },
      error,
    };
    data[naming ? naming : "data"] = dataInObj;
    return data;
  } else {
    const data: { [key in string]: any } = {
      mutate: (value: (prev?: any) => any) => {
        let swrGlobalState: any = {
          ...window.swrState,
        };
        if (swrGlobalState != undefined) {
          swrGlobalState[key] = value(swrGlobalState[key]);
          window.swrState = swrGlobalState;
          swrState = swrGlobalState;
          return mutate();
        } else {
          throw new Error("잘못된 값입니다.");
        }
      },
      error,
    };
    data[naming ? naming : "data"] = swrState[key as ESwrStateKeys];
    return data;
  }
};

export const useManyState = (
  keys: Array<ESwrOneStateKeys>,
  namings: string[]
) => {
  const data: { [key in string]: any } = {};
  const mutate: { [key in string]: any } = {};
  const error: { [key in string]: any } = {};
  if (keys.length > namings.length) {
    throw new Error("데이터 길이에 맞는 별명을 지정해주세요.");
  }
  keys.forEach((key, i) => {
    const obj = useOneState(key, namings[i]);
    data[namings[i]] = obj[namings[i]];
    mutate[namings[i]] = obj.mutate;
    error[namings[i]] = obj.error;
  });
  return { data, mutate, error };
};
