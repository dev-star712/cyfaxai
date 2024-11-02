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
import { getAuthTokenOnClient } from "@/lib/utils";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface ChangeProfileProps {  
    onClose: () => void;
    user: User;
}  

const ChangePassword = ({ onClose, user }: ChangeProfileProps) => {  
    const queryClient = useQueryClient();
    const [isPasswordVisible, setPasswordVisible] = useState(false);  
    const [isVerifyPasswordVisible, setVerifyPasswordVisible] = useState(false);  
    const displayFullNameOrEmailPart = (user: User) => user.full_name || user.email.split('@')[0];
    const [newPassword, setNewPassword] = useState('');  
    const [verifyPassword, setVerifyPassword] = useState(''); 
    const togglePasswordVisibility = () => {  
        setPasswordVisible(!isPasswordVisible);  
    }; 

    const toggleVerifyPasswordVisibility = () => {  
        setVerifyPasswordVisible(!isVerifyPasswordVisible);  
    }; 
    const isSubmitDisabled = newPassword !== verifyPassword || newPassword === '';

    const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {  
        e.preventDefault();  

        if (isSubmitDisabled) return; 

        const requestBody = {  
            email: user.email, 
            new_password: newPassword,
        };  
        const tokens = await getAuthTokenOnClient();
        const endpoint = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/hard_reset_password/`;  
        try {  
            const response = await fetch(endpoint, {  
              method: 'POST',  
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
            const data = await response.json();  
            toast.success(data.data); 
            queryClient.invalidateQueries({  
                queryKey: ["get-users"],  
                exact: true,  // Optional exact matching of query key  
            });

            onClose();
        } catch (error) {  
            console.error('Failed to change profile:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to change the profile. ${errorMessage}`);
        }  
    };  

    return (  
        <Dialog open>  
        <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
            <DialogHeader>  
            <DialogTitle>  
            <div className="flex w-full items-center justify-between">  
                <div className="flex items-center space-x-2 border-b border-[#ab00ab] pb-2">  
                    <Image src="/profile.svg" width="24" height="24" alt="Profile" />  
                    <h2 className="text-xl font-semibold text-[#ab00ab]">  
                    <FormattedMessage id="changePasswordTitle" />  
                    </h2>  
                </div>  
                <button onClick={onClose} className="text-[#ab00ab]">X</button>  
            </div>  
            </DialogTitle>  
            </DialogHeader>  
            <div className="mt-7">  
            <form  
                onSubmit={handleChangePassword}
            >  
                <label htmlFor="userName" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                    <FormattedMessage id="userName"/>  
                </label>
                <input  
                    id="userName"  
                    type="text"  
                    className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    placeholder="user name"  
                    defaultValue={displayFullNameOrEmailPart(user)}
                    disabled={true}
                />  
                <label htmlFor="email" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                    <FormattedMessage id="email"/>  
                </label>
                <input  
                    id="email"  
                    type="text"  
                    className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    defaultValue={user.email} 
                    disabled={true}
                />  
                <label htmlFor="newPassword" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                    <FormattedMessage id="newPasswordLabel"/>  
                </label>
                <div className="relative">  
                    <input  
                        id="newPassword"  
                        type={isPasswordVisible ? "text" : "password"}  
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        placeholder="new password"  
                        value={newPassword}  
                        onChange={(e) => setNewPassword(e.target.value)}
                    />  
                    <span className="absolute inset-y-0 right-4 flex items-center">  
                        {isPasswordVisible ? (  
                        <EyeOff className="cursor-pointer" onClick={togglePasswordVisibility} />  
                        ) : (  
                        <Eye className="cursor-pointer" onClick={togglePasswordVisibility} />  
                        )}  
                    </span>  
                </div>
                <label htmlFor="verifyPassword" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                    <FormattedMessage id="verifyPasswordLabel"/>  
                </label>
                <div className="relative">  
                    <input  
                        id="verifyPassword"  
                        type={isVerifyPasswordVisible ? "text" : "password"}  
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        placeholder="verify new password" 
                        value={verifyPassword}  
                        onChange={(e) => setVerifyPassword(e.target.value)}  
                    />  
                    <span className="absolute inset-y-0 right-4 flex items-center">  
                        {isVerifyPasswordVisible ? (  
                        <EyeOff className="cursor-pointer" onClick={toggleVerifyPasswordVisibility} />  
                        ) : (  
                        <Eye className="cursor-pointer" onClick={toggleVerifyPasswordVisibility} />  
                        )}  
                    </span>  
                </div> 
                <div className="mt-3.5 flex justify-end">  
                    <button  
                    className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                    type="submit"  
                    disabled={isSubmitDisabled}
                    >  
                    <FormattedMessage id="changePasswordTitle" />  
                    </button>  
                </div>  
            </form>  
            </div>  
        </DialogContent>  
        </Dialog>  
    );  
};  

export default ChangePassword;