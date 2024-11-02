// user-profile-update.tsx  
import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
  } from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import Image from "next/image";  
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";

interface ConfirmDeletionProps {  
    onCloseConfirm: () => void;
    option: string;
}  

const DeleteSuccess = ({ onCloseConfirm, option }: ConfirmDeletionProps) => {   

    return (  
        <Dialog open>  
        <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
            <DialogHeader>  
                <DialogTitle>  
                    <div className="flex justify-between items-center w-full">  
                        <div className="flex justify-center flex-1">  
                            {/* Updated part: Image component showing check.svg */}  
                            <Image src="/check.svg" alt="Success" width={50} height={50} />  
                        </div>  
                    </div>  
                </DialogTitle>  
            </DialogHeader> 
            <div className="flex flex-col items-center justify-center"> {/* Centering the content vertically and horizontally */}  
                <label htmlFor="password" style={{ fontSize: '15px' }} className="mt-3 block font-semibold text-gray-900 text-center">  
                    <FormattedMessage id={option}/>  
                </label>  
                <div className="mt-8">  
                    <button  
                    className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                    onClick={onCloseConfirm}  
                    >  
                    <FormattedMessage id="ok" />  
                    </button>  
                </div>  
            </div>   
        </DialogContent>  
        </Dialog>  
    );  
};  

export default DeleteSuccess;