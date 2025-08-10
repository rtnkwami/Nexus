 "use client"

 import {use, useState} from 'react'
 import Image from 'next/image';
 
 export default function Sidebar(){

    const [items , setItem]=useState(false);
    const [categories , setCategories]= useState(false);
    const [service , setService]= useState(false);

    const[hideSidebar , SethideSidebar]=useState(true)

    const handleSidebar=()=>
        {SethideSidebar(!hideSidebar);};

    return(
        <main> 
           
            <div className="w-100 h-fit transition-all duration-300">
                <button className='w-fit h-fit border-2 rounded-full relative top-15'>
                    <Image
                    alt="Menu"
                    src="/menu.png"
                    width={30}
                    height={30}/>
                </button>
                <div className={`flex flex-col space-y-4 relative left-15 top-10 h-fit  bg-neutral-950 text-neutral-50  pb-5 transition-all duration-500 rounded-br-[20px] rounded-tr-[20px] ${hideSidebar ? 'w-16' : ''}`}>
                    <button className={`w-10 h-10 relative left-80 top-2  rounded-full hover:border-2 transition-all duration-150 ${hideSidebar ? '-translate-x-77':''} `} onClick={handleSidebar}>
                   
                   <Image
                   alt="hide"
                   src="/show.png"
                   width={25}
                   height={25}
                  className='   bg-neutral-50 rounded-full  relative left-1.5  '
                  />
 
                </button>
               <ul className="pl-4 pt-6 space-y-4 relative left-10 bottom-8 pb-6">
                <a href="">
                <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className={`w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-9 right-8 ${hideSidebar ? 'mt-5':''}`}/>
                     </a>
                <li className={`w-fit h-fit border-2 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150 ${hideSidebar ? 'hidden':''}`}><a href="" className="pt-2 pb-2 pl-2 pr-2">
                   
                   Home
                    </a></li>
                    <a href="">
                    <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className={`w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-9 right-8 ${hideSidebar ? 'mt-7':''}`}/>
                     </a>
                <li className={`w-fit h-fit border-2 border-l-0 border-r-0 border-t-0 border-b-0  hover:border-b-2 transition-all duration-150 ${hideSidebar ? 'hidden':''}`}><a href="" className="pt-1 pb-1 pl-1 pr-1">
                    
                    About
                    </a></li>
                <li  >
                    <a href="">
                    <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className={`w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-7 right-8 ${hideSidebar ? 'mt-7':''}`}/>
                    </a>
                   <button 
                   className={`w-fit h-fit  border-2 pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150 ${hideSidebar ? 'hidden':''}`}
                    onClick={()=>setItem(!items)}
                   >
                    
                    Items
                    </button>
                   {
                    items &&(
                         <ul className="space-y-2 w-fit h-fit border-0 relative left-7">
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                            <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-7 right-8'/>
                            Item 1
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                            <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Item 2
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Item 3
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           
                            <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                     Item 4
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Item 5
                            </button></li>
                    </ul>
                    )
                   } 
                   
                   
                </li>
                <li >
                     <a href="">
                        <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className={`w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-7 right-8 ${hideSidebar ? 'mt-7':''} `}/>
                       </a>
                    < button 
                        className={`w-fit h-fit border-2 pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150 ${hideSidebar ? 'hidden':''}`}
                    onClick={()=> setCategories(!categories)}
                    >
                       
                        Category
                       
                        </button>
                    {
                        categories && (
                        <ul className="space-y-2 w-fit h-fit border-0 pt-3 relative left-7">
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Category 1
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                            <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Category 2
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                            <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Category 3
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Category 4
                            </button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">
                           <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className='w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-5.5 right-8'/>
                            Category 5
                            </button></li>
                    </ul>
                        )
                    }
                    
                </li>
                <li  >
                     <a href="" className='pb-10 relative'>
                    <Image
                    alt="Home"
                    src="/filter.png"
                    width={20}
                    height={20}
                     className={`w-fit h-fit border-2 bg-neutral-50 rounded-full relative top-7 right-8 ${hideSidebar ? 'mt-7':''}`}/>
                    </a>
                  <button 
                  className={`w-fit h-fit border-2 pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150 ${hideSidebar ? 'hidden':''}`}
                  onClick={()=>setService(!service) }
                  >
                   
                    Services
                    </button>
                  {
                    service &&(
                        <ul className="space-y-2 w-fit h-fit border-0 relative left-7">
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">Service 1</button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">Service 2</button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">Service 3</button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">Service 4</button></li>
                        <li><button className="pt-1 pb-1 pl-1 pr-1 border-l-0 border-r-0 border-t-0 border-b-0 hover:border-b-2 transition-all duration-150">Service 5</button></li>
                    </ul>
                    )
                  }
                  
                </li>
               </ul>
               </div>
            </div>
        </main>
    )
 }

