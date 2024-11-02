import React from "react";  
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import { useInputState } from "@mantine/hooks";  
import { getAuthTokenOnClient } from "@/lib/utils";  
import { toast } from "react-toastify"; 

type SearchDialogProps = {  
    isOpen: boolean;  
    onClose: () => void;  
};  

const SearchDialog: React.FC<SearchDialogProps> = ({ isOpen, onClose }) => {  
    const [domainValue, setDomainValue] = useInputState("");  

    const onSubmit = async (e: React.FormEvent) => {  
        e.preventDefault();  
        const tokens = await getAuthTokenOnClient();  

        try {  
            const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/manual_scan/`;  
            const response = await fetch(apiUrl, {  
                method: "POST",  
                headers: {  
                    "Content-Type": "application/json",  
                    Authorization: `Bearer ${tokens.accessToken}`,  
                },  
                body: JSON.stringify({ domain_name: domainValue }),  
            });  
        
            if (response.status === 429) { 
                const data = await response.json();
                toast.error(data.data);
                onClose();
                return; 
            }  
        
            if (!response.ok) {  
                throw new Error(`HTTP error! Status: ${response.status}`);  
            }  
        
            const data = await response.json();  
            toast.success(data.data);  
        
            onClose();   
        
        } catch (error: unknown) {  
            console.error("An error occurred:", error);  
            let errorMessage = "Failed to create new alert. An unexpected error occurred.";  
            
        }
    };  

    return (  
        <>  
            <Dialog open={isOpen} onOpenChange={onClose}>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                    <DialogHeader>  
                        <DialogTitle>  
                            <h2 className="text-left text-xl font-semibold">  
                                <FormattedMessage id="dialogTitle" />  
                            </h2>  
                        </DialogTitle>  
                    </DialogHeader>  
                    <div className="mt-7">  
                        <form onSubmit={onSubmit}>  
                            <input  
                                type="text"  
                                className="h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                placeholder="Enter Domain"  
                                value={domainValue}  
                                onChange={(e) => setDomainValue(e.target.value)}  
                            />  
                            <div className="mt-3.5 flex justify-end">  
                                <button  
                                    style={{ backgroundColor: '#720072' }}  
                                    className="h-11 rounded-md px-8 font-medium text-white duration-300 hover:opacity-80"  
                                    type="submit"  
                                >  
                                    <FormattedMessage id="submit" />  
                                </button>  
                            </div>  
                        </form>  
                    </div>  
                </DialogContent>  
            </Dialog>  
        </>  
    );  
};  

export default SearchDialog;