import React,{useState} from "react";

export const Form = ({setYoutubeLink}) => {
    
    const[input, setInput] = useState('');

    const handleSubmit=(e)=>{
        e.preventDefault();
        setYoutubeLink(input);
        setInput('');
    }

    return (
        <form className = 'video_id_form' onSubmit={handleSubmit}>

        <input type='text' className="form-control" placeholder="Enter the URL" required
        onChange={(e)=> setInput(e.target.value)} value={input || ''}
        ></input>



        <button type="submit" className="submit_button">Submit</button>
            
        </form>
    )


}