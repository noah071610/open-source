import React from 'react';
import { useGlobalState } from 'util/configSwrState';

function Loading() {  
    const {data , mutate} = useGlobalState({obj:{c:5}});

    return (
        <div>
            {data ? <h1 style={{fontSize:'10rem'}}>로딩중 입니다!!!</h1> : <h1 style={{fontSize:'50rem'}}>dd</h1>}
        </div>
    )
}

export default Loading;
