 import {Card , CardImage , CardDescription , CardTitle} from "../components/card"
 import Image from "next/image"
export default function ShopCard(){
    return(
        <div>
             <Card className="border-2">
          
            <CardTitle>
               Table
            </CardTitle>
            <CardImage>
              <Image
              src="/email.png"
              alt="pic"
              width={180}
              height={180}/>
            </CardImage>
            <CardDescription>
              GHS 190092
            </CardDescription>
          
          </Card>
            
        </div>
    )
}