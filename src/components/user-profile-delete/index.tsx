// user-profile-update.tsx  
import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
  } from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import DeleteSuccess from "@/components/delete-success-dialog";
import { toast } from "react-toastify";  
import { getAuthTokenOnClient } from "@/lib/utils";  
import { useQueryClient } from "@tanstack/react-query"; 

interface DeleteProfileProps  {  
    onClose: () => void;
    user: User;
}  

const DeleteProfile = ({ onClose, user }: DeleteProfileProps ) => {  
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [isPasswordVisible, setPasswordVisible] = useState(false);   
    const [isConfirmDeletionVisible, setIsConfirmDeletionVisible] = useState(false); 

    const togglePasswordVisibility = () => {  
        setPasswordVisible(!isPasswordVisible);  
    }; 

    const handleDialogClose = () => {  
        setIsDialogOpen(false);
        onClose();
    }; 

    const [password, setPassword] = useState('');  
    const [error, setError] = useState('');  

    const handleDeletion = async () => {  
        if (!password) {  
            setError('Password is required');  
            return;  
        }  
        setError('');  
        const tokens = await getAuthTokenOnClient();  
        const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/account_management/${user.id}/`;  
        const requestBody = {
            "password": password,
        }
        try {  
            const response = await fetch(apiUrl, {  
                method: 'DELETE', 
                headers: {  
                    'Content-Type': 'application/json',  
                    'Authorization': `Bearer ${tokens.accessToken}`,  
                },  
                body: JSON.stringify(requestBody),  
            });  
    
            if (!response.ok) {  
                const errorResponse = await response.json(); 
                throw new Error(errorResponse.data);
            }  
            
            toast.success("User Removed successfully."); 
            queryClient.setQueryData(['get-users'], (oldUsers: User[] | undefined) =>   
                oldUsers ? oldUsers.filter(u => u.id !== user.id) : []  
            );
            setIsDialogOpen(false); 
            setIsConfirmDeletionVisible(true);
        } catch (error) {  
            console.error('Failed to Remove user:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to remove the user. ${errorMessage}`);   
        } 
    }; 

    return (  
        <>
        {isDialogOpen && (
            <Dialog open>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                    <DialogHeader>  
                    <DialogTitle>  
                    <div className="flex justify-between items-center w-full">  
                        <div className="flex justify-center flex-1">  
                            <h2 className="text-xl font-semibold text-[#ab00ab]">  
                                <FormattedMessage id="deleteProfileTitle" />  
                            </h2>  
                        </div>  
                        <button onClick={handleDialogClose} className="close-btn text-[#ab00ab] ml-auto">X</button>  
                    </div>
                    </DialogTitle>  
                    </DialogHeader>  
                    <div className="mt-7">  
                    <form  
                        onSubmit={(e) => {  
                        e.preventDefault();  
                        handleDeletion();
                        }}  
                    >  
                        <label htmlFor="password" style={{ fontSize: '15px' }} className="block mb-2 font-semibold text-gray-900">  
                            <FormattedMessage id="enterPasswordLabel"/>  
                        </label>
                        <div className="relative">  
                            <input  
                                id="password"  
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                type={isPasswordVisible ? "text" : "password"}  
                                className="h-11 w-full rounded-lg mb-2 border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                                placeholder="enter password"  
                            />  
                            <span className="absolute inset-y-0 right-4 flex items-center">  
                                {isPasswordVisible ? (  
                                <EyeOff className="cursor-pointer" onClick={togglePasswordVisibility} />  
                                ) : (  
                                <Eye className="cursor-pointer" onClick={togglePasswordVisibility} />  
                                )}  
                            </span>  
                        </div>
                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        <div className="mt-3.5 flex justify-end">  
                            <button  
                            className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                            type="submit"
                            disabled={!password} 
                            >  
                            <FormattedMessage id="confirmDeletion" />  
                            </button>  
                        </div>  
                    </form>  
                    </div>  
                </DialogContent>  
            </Dialog> 
        )} 
            {isConfirmDeletionVisible && <DeleteSuccess option={"deletionLabel"} onCloseConfirm={handleDialogClose} />} 
        </>
    );  
};  

export default DeleteProfile;