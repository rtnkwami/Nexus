import Image from "next/image"

export default function MenuSearchbar(){
  return(
    <main>
              
               <div className="w-5xl h-15 transition-all ml-10 rounded-2xl border-r-2 border-l-2 hover:border-r-0 hover:border-l-0 hover:border-t-2 hover:border-b-2 border-t-0 border-b-0 border-red-600 border-2 font-serif bg-black text-neutral-100"> 
                
                  <div className="relative top-5">
                    Website Logo
                  </div>

                  
              <div className="relative bottom-2">
                    <input 
                    type="text"
                    placeholder=" Search for shops and products"
                    className="bg-neutral-50 text-neutral-950 relative left-60 bottom-2 w-140 h-8 rounded-tl-2xl rounded-tr-2xl"
                    />
                  
                    <button className="bg-red-500 w-10 h-8 relative left-50 bottom-1/10 border-2 rounded-r-2xl rounded-tl-2xl rounded-tr-2xl">
                    <Image 
            src="/search-interface-symbol.png" 
            alt="Search Icon" 
            width={22} 
            height={22}
         className="relative left-1" />
                    </button>
                 </div>
                
                 <div>
                                    
                                
                                 </div>
                        <button className="w-10 h-10 bg-red-500 hover:bg-neutral-50 transition-all duration-200 relative left-230 bottom-13 rounded-full" name="cart-button" id="cart-button" >
                                     <Image
                                      src={"/shopping-cart.png"}
                                      alt="Cart"
                                    width={23}
                                    height={23}
                                    popoverTarget="cart-button"
                                    className="relative left-1"
                                     />
                                     </button>        
                   </div>
                   <button className="w-11 h-11 bg-red-500  hover:bg-neutral-50 transition-all duration-200 border-2 relative left-277 bottom-13 rounded-full">
                      
                      <Image
                      src={"/people.png"}
                      alt="User"
                      width={30}
                      height={30}
                      className="relative left-1"/>
                      
                     </button>
                      
           </main>
  )
}