import { CheckSquare, X } from "lucide-react";
import Image from "next/image";

export default function CartPage(){
    return(
        <main>
            <div className="w-fit h-fit p-5">
                  <span className="text-4xl font-bold   p-5 text-neutral-950  "> Electronics</span>
                  <div className="w-fit h-fit flex flex-row space-x-30">
                    <div className="w-fit h-fit border-2 flex flex-col space-y-2">

                      <div className="w-fit h-fit flex flex-row space-x-5 p-5 border-b-[1.5px]">
                        <Image
                        src="/headphones.jpg"
                        alt="Product picture"
                        width={250}
                        height={250}
                        />
                        <div className="flex flex-col space-x-2">
                            <span className="text-gray-700 ">Headphones</span>
                            <span className="flex flex-row space-x-7 text-gray-500">
                            <span>Black</span><span>|</span><span>Medium</span>
                                </span>
                            <span>50.00</span>
                            <span className="flex flex-row mt-40">
                                <CheckSquare color="green"/>
                                <span className="text-gray-600">In stock</span>
                            </span>
                        </div> 
                        <select name="" id="" className="w-15 h-8 border-2 rounded-md ml-20 hover:border-blue-600">
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                        <option value="">5</option>
                        <option value="">6</option>
                        <option value="">7</option>
                        <option value="">8</option>
                        <option value="">9</option>
                        <option value="">10</option>
                      </select>

                      <X className="text-gray-600 hover:text-gray-500 ml-15"/>
                      </div>

                       <div className="w-fit h-fit flex flex-row space-x-5 p-5">
                        <Image
                        src="/headphones.jpg"
                        alt="Product picture"
                        width={250}
                        height={250}
                        />
                        <div className="flex flex-col space-x-2">
                            <span className="text-gray-700 ">Headphones</span>
                            <span className="flex flex-row space-x-7 text-gray-500">
                            <span>Black</span><span>|</span><span>Medium</span>
                                </span>
                            <span>50.00</span>
                            <span className="flex flex-row mt-40">
                                <CheckSquare color="green"/>
                                <span className="text-gray-600">In stock</span>
                            </span>
                        </div> 
                        <select name="" id="" className="w-15 h-8 border-2 rounded-md ml-20 hover:border-blue-600">
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                        <option value="">5</option>
                        <option value="">6</option>
                        <option value="">7</option>
                        <option value="">8</option>
                        <option value="">9</option>
                        <option value="">10</option>
                      </select>

                      <X className="text-gray-600 hover:text-gray-500 ml-15"/>
                      </div>

                       <div className="w-fit h-fit flex flex-row space-x-5 p-5">
                        <Image
                        src="/headphones.jpg"
                        alt="Product picture"
                        width={250}
                        height={250}
                        />
                        <div className="flex flex-col space-x-2">
                            <span className="text-gray-700 ">Headphones</span>
                            <span className="flex flex-row space-x-7 text-gray-500">
                            <span>Black</span><span>|</span><span>Medium</span>
                                </span>
                            <span>50.00</span>
                            <span className="flex flex-row mt-40">
                                <CheckSquare color="green"/>
                                <span className="text-gray-600">In stock</span>
                            </span>
                        </div> 
                        <select name="" id="" className="w-15 h-8 border-2 rounded-md ml-20 hover:border-blue-600">
                        <option value="">1</option>
                        <option value="">2</option>
                        <option value="">3</option>
                        <option value="">4</option>
                        <option value="">5</option>
                        <option value="">6</option>
                        <option value="">7</option>
                        <option value="">8</option>
                        <option value="">9</option>
                        <option value="">10</option>
                      </select>

                      <X className="text-gray-600 hover:text-gray-500 ml-15"/>
                      </div>

                      
                     
                    </div>
                    <div className="w-fit h-fit border-2 flex flex-row space-y-2 bg-gray-100">
                       <div className="w-fit h-fit flex flex-col space-y-5 p-5 ">
                        <span className="text-2xl font-bold p-2">Order Summary</span>
                        <span className="flex flex-row space-x-50 border-b-2">
                         <span className="p-2  text-gray-500" >Subtotal</span><span className="p-2">50</span> 
                        </span>
                        <span className="flex flex-row space-x-50 border-b-2">
                         <span className="p-2  text-gray-500">Subtotal</span><span className="p-2">50</span>
                        </span>
                        <span className="flex flex-row space-x-50 border-b-2">
                          <span className="p-2 text-gray-500">Subtotal</span><span className="p-2">50</span>
                        </span>
                        <span className="flex flex-row space-x-50 ">
                          <span className="p-2 font-bold ">Subtotal</span><span className="p-2 font-bold">50</span>
                        </span>
                       </div>
                    </div>
                  </div>
            </div>
        </main>
    )
}

