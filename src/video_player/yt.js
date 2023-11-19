import React from "react";
import ReactPlayer from "react-player";

export const Youtube = ({youtubeLink}) =>{
    return(
        <ReactPlayer url={youtubeLink} controls/>
    )
}