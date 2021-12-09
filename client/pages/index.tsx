import { useCallback } from "react";
import { useGlobalState, useOneState } from "util/configSwrState";


export default function Home() {
  const {swr , mutate} = useGlobalState({name:'changed name'});
  const {data:obj, mutate:objMutate} = useOneState('obj.a');
  const {data:arr, mutate:arrMutate} = useOneState('arr');

  const onClickPopup =useCallback(
    () => {
      mutate('name',()=> 'HyunSoo');
      objMutate((prev) => prev+10)
    },[]
  );
  
  return (
    <div style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <h1>Hello SWR State</h1>
      <br/>
      <button onClick={onClickPopup} style={{background:'black',color:'white', width:'250px',height:'100px',fontSize:'52px'}}>클릭 미</button>
      <h1>{swr?.name}</h1>
    </div>
  )
};
