import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import React from "react";  
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";  
import { useInputState } from "@mantine/hooks";  

const SearchDialog = () => {
    const { getDetailReportQuery, isOpenDomainModal, setDomain } = useDetailReport();  
    const [domainValue, setDomainValue] = useInputState("");  
    const handleSubmit = (e: React.FormEvent) => {  
        e.preventDefault();  
        if (!domainValue.trim()) return;  
        setDomain(domainValue);  
        setDomainValue("");  
        getDetailReportQuery.refetch(); 
    };  
    return(
        <>
            <Dialog open={isOpenDomainModal}>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                <DialogHeader>  
                    <DialogTitle>  
                    <h2 className="text-left text-xl font-semibold">  
                        <FormattedMessage id="dialogTitle" />  
                    </h2>  
                    </DialogTitle>  
                </DialogHeader>  
                <div className="mt-7">  
                    <form onSubmit={handleSubmit}>  
                    <input  
                        type="text"  
                        className="h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        placeholder="Enter Domain" // Adjust if you use intl for placeholders  
                        value={domainValue}  
                        onChange={(e) => setDomainValue(e.target.value)}  
                    />  
                    <div className="mt-3.5 flex justify-end">  
                        <button  
                        disabled={!domainValue.trim()}  
                        style={{ backgroundColor: '#720072' }}  
                        className="h-11 rounded-md px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
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
    )
};  

export default SearchDialog;