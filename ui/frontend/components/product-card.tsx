 import { CurrencyIcon, ShoppingCart } from "lucide-react"
import {Card , CardImage , CardDescription , CardTitle, CardObjectName, CardButton} from "../components/card"
 import Image from "next/image"
export default function ProductCard(){
    return(
        <div>
             <Card className="border-2">
          
            
            <CardImage>
              <Image
              src="/headphones.jpg"
              alt="pic"
              width={580}
              height={580}/>
            </CardImage>
             <CardObjectName>
              Message Image
             </CardObjectName>
            <CardDescription>
              GHS 190092
            </CardDescription>
            <div className="ml-36 w-fit h-fit">
              <a href="" className="relative left-10">
                <CardButton  >
              <ShoppingCart className="text-neutral-50 pt-1 pb-1 pr-1 pl-1  hover:text-neutral-900  " size={30}/>
              </CardButton>
              </a>
               
            </div>
           
          </Card>
            
        </div>
    )
}