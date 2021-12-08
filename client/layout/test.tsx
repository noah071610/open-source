import { useGlobalState } from "util/configSwrState";


export default function Test() {
  const {data , mutate} = useGlobalState({is:888});
  return (
    <div>
      Testing <br/>
      <h1 style={{color:'green'}}>{String(data)}</h1>
    </div>
  )
}
