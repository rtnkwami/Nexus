

import { useState } from "react";
import { CardImage } from "./card"
import Image from "next/image";


const options=[
    {label:"Electronics" ,value:"A" ,image:'/email.png'},
    {label:"Shop2" ,value:"B" ,image:'/console.png'},
    {label:"Shop3" ,value:"C" ,image:'/grocery.png'},
    {label:"Shop4" ,value:"D" ,image:'/help.png'},
    {label:"Shop5" ,value:"E" ,image:'/globe.svg'},
    {label:"Shop5" ,value:"F" ,image:'/globe.svg'},
    {label:"Shop5" ,value:"G" ,image:'/globe.svg'},
    {label:"Shop5" ,value:"H" ,image:'/globe.svg'}


]



export default function Filter(){

    const [selected , setSelected]=useState(options[0])
    const [display , setDisplay]= useState(true)

    
    const handleDisplay=()=>{
        setDisplay(!display)
    }

    return(
        <div>
            <div className="max-w-fit h-fit bg-amber-50 grid grid-cols-5  space-x-3">
            
             <select>
                <option value=""></option>
                <option value=""></option>
                <option value=""></option>
                <option value=""></option>
                <option value=""></option>
             </select>
             <input type="number" name="" id="" />
              
              <select name="" id="">
                <option className="w-40 h-40" >
                  
                </option>
                    
               
              </select>
              
              <div>
                <div className="flex flex-row  space-x-2 w-fit h-fit cursor-pointer border-2 p-2 transition-all duration-150" onClick={handleDisplay}>
                    <img src={selected.image} alt={selected.value} width={20} height={20}/>
                    <span >{selected.label} </span>
                </div>
                
              </div>
              
            </div>
            <ul className={`${display ? 'hidden': ''} cursor-pointer block ml-145 `}>
                    {
                        options.map(
                            (option)=>(
                                <li 
                                key={option.value}
                                className="p-2 flex flex-row space-x-2 border-2 hover:shadow-2xl w-fit h-fit"
                                onClick={()=>setSelected(option)}>
                                <img src={option.image} width={20} height={20}/>
                                <span>{option.label}</span>
                                </li>
                            )
                        )
                    }
                    
                </ul>
        </div>
    )
}
   


  