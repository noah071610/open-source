import { useCallback } from "react";
import { useGlobalState, useOneState } from "util/configSwrState";


export default function Home() {
  const {swr , mutate} = useGlobalState({name:'new'});
  const {data, mutate:slideMutate} = useOneState('obj.b.c');

  const onClickPopup =useCallback(
    () => {
      mutate('name',()=> 'hyunsoo');
      slideMutate((prev) => prev+22)
    },[]
  );

  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <h1>Hello SWR State</h1>
      <br/>
      <button onClick={onClickPopup} style={{background:'black',color:'white', width:'250px',height:'100px',fontSize:'52px'}}>클릭 미</button>
      <h1>{swr?.name}</h1>
      <h1>{String(data)}</h1>
    </div>
  )
};
