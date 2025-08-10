
function Card({className , ...props }: React.ComponentProps<"div">){
    return(
        <div
        data-slot="card"
        className="w-fit h-fit  hover:shadow-neutral-950 shadow-2xl  transition-all duration-100 "
        {...props}
        >
          
        
        </div>
    )
}



function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={"leading-none font-semibold pt-1 pb-1 pr-1 pl-1"}
      {...props}
    />
  )
}

function CardImage({ className , ...props}: React.ComponentProps<"div">){
    return(
        <div 
        data-slot = "card-image"
        className="w-fit h-fit pl-1 pr-1 pb-1 pt-1"
        {...props}
        >
           
        </div>
    )
}
 function CardDescription({className , ...props}: React.ComponentProps<"div">){
    return(
    <div

    data-slot="card-description"
    className="text-[15px] text-neutral-900 pt-1 pb-1 pr-1 pl-1"
    {...props}>

    </div>
    )
 }

 function CardObjectName({className , ...props}: React.ComponentProps<"div">){
  return(
    <div
    data-slot="card-object-name"
    className="text-[16px] text-neutral-900  pt-1 pb-1 pr-1 pl-1"
    {...props}>
      
    </div>
  )
 }
 function CardButton({className , ...props}: React.ComponentProps<"button">){
  return(
   
    <button
    data-slot="card-button"
    className="w-fit h-fit bg-black rounded-full hover:bg-neutral-50 transition-all duration-150 "
    {...props}>

    </button>

  )
 }

export {
    Card,
    CardTitle,
    CardImage,
    CardDescription,
    CardObjectName,
    CardButton
}