'use client';

import Image from "next/image";
import Menu from "../components/menu";
import MenuSearchbar from "../components/menu-searchbar";
import Sidebar from "../components/sidebar";
import DropdownMenu from "../components/footer";
import { Card,CardDescription,CardImage,CardTitle } from "../components/card";
import { Line, LineChart } from "recharts";
import TinyChart from "../components/Barchat"
import ProductCard from "../components/product-card";
import Filter from "../components/filter";
import Homepage from "../pages/Home/page";
import ProductPage from "../pages/Product/page";
import CategoryPage from "../pages/Category/page";
import ProductOverview from "../pages/Product-Overview/page";
import CartPage from "../pages/Cart/page";


export default function Home() {
  return (
    <div>
      
         <Menu/>
        <CartPage/>
    </div>
  
  );
}
