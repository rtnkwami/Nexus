import Image from "next/image"


export default function Menu(){
    return(
        <main>
           
            <div className="w-5xl h-15 transition-all duration-500 ml-10 rounded-2xl border-r-4 border-l-4 hover:border-r-0 hover:border-l-0 hover:border-t-2 hover:border-b-2 border-t-0 border-b-0 border-red-600 border-3 font-serif bg-black text-neutral-100"> 
        <span className="absolute top-1">Website Logo</span>
                <div className=" space-x-15 ml-60 absolute top-3 pb-2 text-[17px]">
             <a href=""><button className=" hover:border-2 border-top-0 border-bottom-0 hover:rounded-tl-2xl hover:rounded-br-2xl hover:bg-red-500 transition-all  w-15 h-fit">Home</button></a>
            <a href=""><button className="   hover:border-2 border-top-0 border-bottom-0 hover:rounded-tl-2xl hover:rounded-br-2xl hover:bg-red-500 transition-all  w-15 h-fit">About</button></a>
              <a href=""><button className=" hover:border-2 border-top-0 border-bottom-0 hover:rounded-tl-2xl hover:rounded-br-2xl hover:bg-red-500 transition-all  w-15 h-fit">Items</button></a>
               <a href=""><button className=" hover:border-2 border-top-0 border-bottom-0 hover:rounded-tl-2xl hover:rounded-br-2xl hover:bg-red-500 transition-all  w-25 h-fit">Cartegories</button></a>
                <a href=""><button className=" hover:border-2 border-top-0 border-bottom-0 hover:rounded-tl-2xl hover:rounded-br-2xl hover:bg-red-500 transition-all  w-18 h-fit"> Services</button></a>   

             
                </div>
             <button className="w-10 h-10 bg-red-500 hover:bg-neutral-50 transition-all duration-200 relative left-230 top-2 rounded-full" name="cart-button" id="cart-button" >
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
            
                
                <div>
                    <button className="ml-270 relative bottom-7 border-black rounded-full border-1 ">
                    
                </button>
               
                </div>
                <a href="/auth/login">
             <button className="w-11 h-11 bg-red-500  hover:bg-neutral-50 transition-all duration-200 border-2 relative left-277 bottom-18 rounded-full">
                      <Image
                                           src={"/people.png"}
                                           alt="User"
                                           width={30}
                                           height={30}
                                           className="relative left-1"/>
                     </button> 
            </a>
        </main>
    )
}