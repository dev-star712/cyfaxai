// user-profile-update.tsx  
import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
  } from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  

interface ChooseOptionProps {  
    onClose: () => void;  
    onRemove: () => void; 
    onDelete: () => void;
} 

const ChooseOption = ({ onClose, onRemove, onDelete }: ChooseOptionProps) => {  

    return (  
        <>
            <Dialog open>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                    <DialogHeader>  
                    <DialogTitle>  
                    <div className="flex w-full items-center justify-between">  
                        <button onClick={onClose} className="ml-auto text-[#ab00ab]">X</button>  
                    </div>
                    <div className="flex flex-1 justify-center">  
                        <h2 className="text-center text-xl font-semibold text-[#ab00ab]">  
                            <FormattedMessage id="chooseOption" />  
                        </h2>  
                    </div>  
                    </DialogTitle>  
                    </DialogHeader>  
                    <div className="mt-3.5 flex justify-center">  
                        <button  
                            className="mr-2 h-11 w-32 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                            onClick={onRemove}
                        >  
                            <FormattedMessage id="remove" />  
                        </button>  
                        <button  
                            className="h-11 w-32 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                            onClick={onDelete} 
                        >  
                            <FormattedMessage id="delete" />  
                        </button>   
                    </div>
                </DialogContent>  
            </Dialog> 
        </>
    );  
};  

export default ChooseOption;