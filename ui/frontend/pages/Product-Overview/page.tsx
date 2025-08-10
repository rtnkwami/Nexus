import { Minus, Plus, StarIcon } from "lucide-react";
import Image from "next/image"
import { useState } from "react";
import Menu from "../../components/menu";


export default function ProductOverview(){

        const [showMore1, setShowMore1] = useState(false);
        const [showMore2, setShowMore2] = useState(false);
        const [showMore3, setShowMore3] = useState(false);
        const [showMore4, setShowMore4] = useState(false);
        


        const hanleShowMore1=()=>{
            setShowMore1(!showMore1)
              
        }
         const hanleShowMore2=()=>{
           
            setShowMore2(!showMore2)
        }
        const hanleShowMore3=()=>{
            setShowMore3(!showMore3)
        }
      const hanleShowMore4=()=>{
            setShowMore4(!showMore4)
        }
     




     return(
        <main>
            <Menu/>
            <div className="w-fit h-fit flex flex-row p-7 ">
                <div className="w-fit h-fit">
                <Image
               src="/headphones.jpg"
               alt="Product picture"
               width={500}
               height={500} />

                </div>
                <div className="w-fit h-fit ml-10 flex flex-col">
                <span className="text-4xl font-bold   pt-10 text-neutral-950  "> Electronics</span>
                <span className="text-4xl">140</span>
                <div className="flex flex-row space-x-2">
                 <StarIcon color="blue"/>
                 <StarIcon color="blue"/>
                 <StarIcon color="blue"/>
                 <StarIcon color="gray"/>
                 <StarIcon color="gray"/>
                </div>
                <p className="text-gray-400 w-100 h-fit pt-2"> We have various cartegories of products to choose from from your home appliances to your basic nessercty items whivch we provide here with the lowest prices you can find </p>
                <div className="flex flex-row space-x-4 pt-5">
                   <a href=""> <button className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">Add to Cart</button></a>
                   <a href=""> <button className="bg-gray-300 hover:bg-gray-200 text-black px-4 py-2 rounded">Buy Now</button></a>
                 </div>

                 <div className="w-fit h-fit pt-5 ">
                    <div className=" w-150 h-fit flex flex-col space-4 border-t-2 border-b-2 p-3 mb-5 cursor-pointer " onClick={hanleShowMore1}>
                    <div className="flex flex-row space-4  p-3">
                    <span className={`mr-8 ${showMore1? 'text-blue-600':''}`}>Product Features</span> 
                    <span className="flex flex-row ml-80"><Plus className={`  ${showMore1?'hidden':''}`}/> <Minus className= {`relative right-6 ${showMore1? '':'hidden'}`} /> </span>
                  </div>
                 
                    <ol className={`list-disc pl-5 text-gray-500 space-y-2 ${showMore1? '':'hidden'} ` }>
                      <li>Blue</li>
                      <li>Violet</li>
                      <li>Hyunne idjjd</li>
                      <li>hhjdkkkkkkw</li>
                      <li>hfjfkkkdkd</li>
                      <li>hfhjfioddkk</li>
                    </ol> 
                     </div>
                    
                    <div className=" w-150 h-fit flex flex-col space-4 border-t-2 border-b-2 p-3 mb-5 cursor-pointer " onClick={hanleShowMore2}>
                    <div className="flex flex-row space-4  p-3">
                    <span className={`mr-8 ${showMore2? 'text-blue-600':''}`}>Product Features</span> 
                    <span className="flex flex-row ml-80"><Plus className={`  ${showMore2?'hidden':''}`}/> <Minus className= {`relative right-6 ${showMore2? '':'hidden'}`} /> </span>

                  </div>
                 
                    <ol className={`list-disc pl-5 text-gray-500 space-y-2 ${showMore2? '':'hidden'} ` }>
                      <li>Blue</li>
                      <li>Violet</li>
                      <li>Hyunne idjjd</li>
                      <li>hhjdkkkkkkw</li>
                      <li>hfjfkkkdkd</li>
                      <li>hfhjfioddkk</li>
                    </ol> 
                     </div>

                     <div className=" w-150 h-fit flex flex-col space-4 border-t-2 border-b-2 p-3 mb-5 cursor-pointer " onClick={hanleShowMore3}>
                    <div className="flex flex-row space-4  p-3">
                    <span className={`mr-8 ${showMore3? 'text-blue-600':''}`}>Product Features</span> 
                    <span className="flex flex-row ml-80"><Plus className={`  ${showMore2?'hidden':''}`}/> <Minus className= {`relative right-6 ${showMore3? '':'hidden'}`} /> </span>

                  </div>
                 
                    <ol className={`list-disc pl-5 text-gray-500 space-y-2 ${showMore3? '':'hidden'} ` }>
                      <li>Blue</li>
                      <li>Violet</li>
                      <li>Hyunne idjjd</li>
                      <li>hhjdkkkkkkw</li>
                      <li>hfjfkkkdkd</li>
                      <li>hfhjfioddkk</li>
                    </ol> 
                     </div>

                     <div className=" w-150 h-fit flex flex-col space-4 border-t-2 border-b-2 p-3 mb-5 cursor-pointer " onClick={hanleShowMore4}>
                    <div className="flex flex-row space-4  p-3">
                    <span className={`mr-8 ${showMore4? 'text-blue-600':''}`}>Product Features</span> 
                    <span className="flex flex-row ml-80"><Plus className={`  ${showMore4?'hidden':''}`}/> <Minus className= {`relative right-6 ${showMore4? '':'hidden'}`} /> </span>

                  </div>
                 
                    <ol className={`list-disc pl-5 text-gray-500 space-y-2 ${showMore4? '':'hidden'} ` }>
                      <li>Blue</li>
                      <li>Violet</li>
                      <li>Hyunne idjjd</li>
                      <li>hhjdkkkkkkw</li>
                      <li>hfjfkkkdkd</li>
                      <li>hfhjfioddkk</li>
                    </ol> 
                     </div>
                     
                 </div>
                </div>
            </div>
            
        </main>
     )
}