// user-profile-update.tsx  
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
interface UpdateProfileProps {  
  onClose: () => void; 
  user: User;
  onUserUpdate: (user: User) => void;
}  
  
const UpdateProfile = ({ onClose, user, onUserUpdate }: UpdateProfileProps) => {  
  const displayFullNameOrEmailPart = (user: User) => user.full_name || user.email.split('@')[0];  
  const [fullName, setFullName] = useState(displayFullNameOrEmailPart(user));
  const [phone, setPhone] = useState(user.phone);
  const [isButtonDisabled, setIsButtonDisabled] = useState(!fullName); 
  useEffect(() => {  
    setIsButtonDisabled(!fullName); 
  }, [fullName]); 

  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setFullName(e.target.value); 
  }; 
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    setPhone(e.target.value); 
  };
  const handleSubmit = async (e: React.FormEvent) => {  
    e.preventDefault();  
    
    const payload: any = {  
      full_name: fullName,  
    };  
  
    if (phone) {  
      payload.phone = phone;  
    }  
   
    const endpoint = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/account_management/${user.id}/`;  
    
    const tokens = await getAuthTokenOnClient();
    try {  
      const response = await fetch(endpoint, {  
        method: 'PUT',  
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
      const data = await response.json();  
      toast.success(data.data); 
      onUserUpdate({...user, full_name: fullName, phone});
      onClose();
    } catch (error) {  
      console.error('Failed to edit profile:', error);  
      const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
      toast.error(`Failed to edit the profile. ${errorMessage}`);
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
          <form  
            onSubmit={handleSubmit}
          >  
              <label htmlFor="fullName" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                  <FormattedMessage id="fullName"/>  
              </label>
              <input  
                  id="fullName"  
                  type="text"  
                  className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                  placeholder="full name"  
                  defaultValue={displayFullNameOrEmailPart(user)}
                  value={fullName}  
                  onChange={handleFullNameChange}  
              />  
              {isButtonDisabled && (  
                <p className="text-red-500">Please enter a value for full name.</p> // Display error message if fullName is empty  
              )} 
              <label htmlFor="phone" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                  <FormattedMessage id="phone"/>  
              </label>
              <input  
                  id="phone"  
                  type="text"  
                  className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                  defaultValue={user.phone}
                  value={phone}  
                  onChange={handlePhoneChange}
              />  
              <label htmlFor="companyName" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                  <FormattedMessage id="companyName"/>  
              </label>
              <input  
                  id="companyName"  
                  type="text"  
                  className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                  defaultValue={user.group_name || ''}
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
              <label htmlFor="role" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                  <FormattedMessage id="role"/>  
              </label>
              <input  
                  id="role"  
                  type="text"  
                  className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                  defaultValue={user.role_name}
                  disabled={true}
              />  
              <div className="mt-3.5 flex justify-end">  
                  <button  
                  className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                  type="submit" 
                  disabled={isButtonDisabled} 
                  >  
                    <FormattedMessage id="updateProfile" />  
                  </button>  
              </div>  
          </form>  
        </div>  
      </DialogContent>  
    </Dialog>  
  );  
};  

export default UpdateProfile;