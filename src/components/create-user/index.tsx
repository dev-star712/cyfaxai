import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
} from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import Image from "next/image";  
import React, { useState, useEffect } from 'react';
import { getAuthTokenOnClient } from "@/lib/utils";
import { toast } from "react-toastify";
import { Eye, EyeOff } from 'lucide-react'; 
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import { useQuery } from "@tanstack/react-query";
import { getRolesQueryOptions } from "@/cyfax-api-client/queries";


interface UpdateProfileProps {  
    onClose: () => void; 
    onUserCreate: (newUser: User) => void;
}  

interface IRoleNames {  
    client_admin: string;  
    client_user: string;  
    partner_user: string;  
    partner_admin: string;  
  }  

const CreateUser = ({ onClose, onUserCreate }: UpdateProfileProps) => {  
    const [formData, setFormData] = useState({  
        email: '',  
        password: '',  
        confirmPassword: '',  
        fullName: '',  
        phone: '',  
        role: ''  
    });  

    const [showPassword, setShowPassword] = useState(false);  
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);  

    const isFormFilled = () => {  
        return Object.values(formData).every((value) => value.trim() !== '') && formData.password === formData.confirmPassword;  
    };

    const { data } = useAuthUserAccount();  
    const currentRole = data?.role_name;
    const [roleOptions, setRoleOptions] = useState<string[]>([]); 
    const roleNames: IRoleNames = {  
        client_admin: 'Client Admin',  
        client_user: 'Client User',  
        partner_user: 'Partner User',  
        partner_admin: 'Partner Admin',  
    };
    useEffect(() => {  
        let options: string[] = [];  
        
        if (currentRole === 'super_admin' || currentRole === 'partner_admin') {  
            options = ['partner_user', 'client_user'];  
        } else if (currentRole === 'client_admin') {  
            options = ['client_user'];  
        } else {  
            options = [];  
        }
    
        setRoleOptions(options);  
    }, [currentRole]);

    const roles = useQuery({
        ...getRolesQueryOptions(),
    });
    const rolesData = roles?.data?.data
    const updateFormData = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>  
        setFormData({ ...formData, [e.target.id]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {  
        e.preventDefault(); 
        const selectedRole = rolesData?.find(role => role.role_name === formData.role)?.id;  

        if (!selectedRole) {  
          toast.error('Role selection is invalid.');  
          return;  
        } 
        const endpoint = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/user_management/`; 
        const payload: any = {
            email: formData.email,  
            password: formData.password,  
            full_name: formData.fullName,  
            phone: formData.phone,  
            role: selectedRole,  
        }
        const tokens = await getAuthTokenOnClient();
        try {  
            const response = await fetch(endpoint, {  
              method: 'POST',  
              headers: {  
                'Content-Type': 'application/json',  
                'Authorization': `Bearer ${tokens.accessToken}`,
              },  
              body: JSON.stringify(payload),  
            });  
        
            if (!response.ok) {  
              const errorResponse = await response.json(); 
              throw new Error(errorResponse.data);
            } 
            const {data}: {data: User} = await response.json();  
            toast.success("Completed to create new user."); 
            onUserCreate(data);
            onClose();
        } catch (error) {  
            console.error('Failed to create profile:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to create the profile. ${errorMessage}`);
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
                    <FormattedMessage id="profileTitle" />  
                    </h2>  
                </div>  
                <button onClick={onClose} className="text-[#ab00ab]">X</button>  
            </div>  
            </DialogTitle>  
            </DialogHeader>  
            <div className="mt-7">  
                <form onSubmit={handleSubmit}>  
                    <label htmlFor="email" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="email"/>  
                    </label>
                    <input  
                        id="email"  
                        type="text"  
                        value={formData.email}  
                        onChange={updateFormData}
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    />  
                    <label htmlFor="password" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="password"/>  
                    </label>
                    <div className="relative mb-2">  
                        <input  
                            id="password"  
                            type={showPassword ? 'text' : 'password'}  
                            value={formData.password}  
                            onChange={updateFormData}  
                            className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        />  
                        <span className="absolute inset-y-0 right-4 flex items-center">  
                            {showPassword ? (  
                            <EyeOff size={20} onClick={() => setShowPassword(false)} className="cursor-pointer" />  
                            ) : (  
                            <Eye size={20} onClick={() => setShowPassword(true)} className="cursor-pointer" />  
                            )}  
                        </span>  
                    </div> 
                    <label htmlFor="confirmPassword" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="confirmPassword"/>  
                    </label>
                    <div className="relative mb-2">  
                        <input  
                            id="confirmPassword"  
                            type={showConfirmPassword ? 'text' : 'password'}  
                            value={formData.confirmPassword}  
                            onChange={updateFormData}  
                            className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        />  
                        <span className="absolute inset-y-0 right-4 flex items-center">  
                            {showConfirmPassword ? (  
                            <EyeOff size={20} onClick={() => setShowConfirmPassword(false)} className="cursor-pointer" />  
                            ) : (  
                            <Eye size={20} onClick={() => setShowConfirmPassword(true)} className="cursor-pointer" />  
                            )}  
                        </span>  
                    </div> 
                    <label htmlFor="fullName" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="fullName"/>  
                    </label>
                    <input  
                        id="fullName"  
                        type="text"  
                        value={formData.fullName}  
                        onChange={updateFormData}  
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                        placeholder="full name"  
                    />  
                    <label htmlFor="phone" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="phone"/>  
                    </label>
                    <input  
                        id="phone"  
                        type="text"  
                        value={formData.phone}  
                        onChange={updateFormData}  
                        placeholder="phone number"  
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                    />  
                    <label htmlFor="role" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                        <FormattedMessage id="role"/>  
                    </label>
                    <select   
                        id="role"   
                        value={formData.role}   
                        onChange={updateFormData}   
                        className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none md:text-base lg:h-12 lg:px-4">  
                        <option value="">Select Role</option>  
                        {roleOptions.map((role) => (    
                            <option key={role} value={role}>{roleNames[role as keyof IRoleNames]}</option>  
                        ))}
                    </select>
                    <div className="mt-3.5 flex justify-end">  
                        <button  
                            disabled={!isFormFilled()} 
                            className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                        >  
                            <FormattedMessage id="createUserButton" />  
                        </button>  
                    </div>  
                </form>  
            </div>  
        </DialogContent>  
        </Dialog>  
    );  
};  

export default CreateUser;