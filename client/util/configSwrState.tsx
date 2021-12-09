import useSWR from "swr";

export let swrState = {
  onSlide: 'slide!!!',
  name : 'noah',
  obj: {
    a : 1,
    b : 2,
    c: {
      position:'developer'
    }
  },
  arr: [1,2,3,4]
};

export type ISwrState = typeof swrState;

export type ESwrStateKeys = keyof typeof swrState;

export type ESwrOneStateKeys = keyof typeof swrState | `${string}.${any}`;

export const initGlobalState = () => {
  if (typeof window !== "undefined") {
    window.swrState = swrState;
  }
};

export const useGlobalState = (initialValue?: {
  [key in any]: any
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

  if(error) new Error("에러가 발생했습니다.");
  
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

export const useOneState = (key:ESwrOneStateKeys)=> {
  const { data, mutate, error } = useSWR("swrState", () => window.swrState);

  if(error) new Error("에러가 발생했습니다.");
  if(key.match(/\./g)) {
    const list = key.split('.');

    let dataInObj : {[key in string]:any} = swrState[list.shift() as ESwrStateKeys] as Object;
    for (let i = 0; i < list.length; i++) {
      let temp = dataInObj[list[i]];
      if(!temp) throw new Error("잘못된 프로퍼티 키 입니다.");
      dataInObj = temp;
    }

    return {
      data:dataInObj as any,
      mutate: (
        value: (prev?: any) => any
      ) => {
        const swrGlobalState: any = {
          ...window.swrState,
        };
        if (swrGlobalState != undefined) {
          const list=key.split('.');
          let objArr = []
          let objPicker : {[key in string]:any} = swrState[list[0] as ESwrStateKeys] as Object;
          objArr.push(objPicker);
          for (let i = 1; i < list.length-1; i++) {
            let temp = objPicker[list[i]];
            if(!temp) throw new Error("잘못된 프로퍼티 키 입니다.");
            objArr.push(temp);
            objPicker = temp;
          }
          
          let target = {...objArr[objArr.length-1] ,[list[list.length-1]]:value(dataInObj)};

          for (let i = objArr.length-1; i > 0; i--) {
            target = {...objArr[i-1],[list[i]] : target};
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
  } else {
    return {
      data : swrState[key as ESwrStateKeys],
      mutate: (
        value: (prev?: any) => any
      ) => {
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
  }
  
  
}