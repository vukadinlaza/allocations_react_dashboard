
import React from "react"

export const OpenDoc=(props)=>{
    const url = props.url;

    return(
        <div>
            <iframe title="docview" class="doc" src={url}></iframe>
        </div>
    )
}