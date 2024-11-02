"use client";
import {  
    DropdownMenu,  
    DropdownMenuContent,  
    DropdownMenuItem,  
    DropdownMenuTrigger,  
} from "@/components/ui/dropdown-menu"; 
import { FormattedMessage } from "react-intl";  
import { ChevronDown, BadgeDollarSign, CircleDollarSign } from "lucide-react";  

const PricesDropDown = () => {

  return (
    <DropdownMenu>  
        <DropdownMenuTrigger asChild>  
            <div className="flex cursor-pointer flex-row items-center gap-x-2">  
                <h3 className="hidden font-mulish text-base font-normal leading-5 text-gray-200 lg:block">  
                    <FormattedMessage id="prices" />  
                </h3>  
                <ChevronDown className="size-5 text-white" />  
            </div>  
        </DropdownMenuTrigger>  

        <DropdownMenuContent  
            collisionPadding={10}  
            sideOffset={10}  
            className="min-w-[200px]"  
        >  
            <DropdownMenuItem>  
                <CircleDollarSign className="size-4" /> <FormattedMessage id="free" />  
            </DropdownMenuItem>  
            <DropdownMenuItem>  
                <BadgeDollarSign className="size-4" /> <FormattedMessage id="premium" />  
            </DropdownMenuItem>  
        </DropdownMenuContent>  
    </DropdownMenu>  
  );
};

export default PricesDropDown;
