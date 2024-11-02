import {  
    Dialog,  
    DialogContent,  
    DialogHeader,  
    DialogTitle,  
} from "@/components/ui/dialog";  
import { FormattedMessage } from "react-intl";  
import Image from "next/image";  
import { useState } from "react";  
import { XCircle } from 'lucide-react';  
import { useQuery } from "@tanstack/react-query";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";
import { getPermissionsQueryOptions } from "@/cyfax-api-client/queries";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
  } from "@/components/ui/select";
import { getAuthTokenOnClient } from "@/lib/utils";
import { toast } from "react-toastify";
import { Formik, ErrorMessage } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { cn } from "@/lib/utils";
import IconChekboxChecked from "@/components/icons/icon-chekbox-checked";
import IconChekboxUnChecked from "@/components/icons/icon-chekbox-unchecked";


interface EditOrgProps {  
    onClose: () => void;   
    onUpdate: (updatedGroup: any) => void;
    group: {  
      name: string;  
      authorized_domains: string[];  
      admin_user: string;  
      permissions: string[];
    };  
    role: 'CLIENT' | 'PARTNER';
    groupId: string;
}

const validationSchema = z.object({
    permissions: z.array(z.string()).min(1, "Permissions are required"),
  });

interface FormValues {  
    permissions: string[];  
}

const EditOrg: React.FC<EditOrgProps> = ({ onClose, onUpdate, group, role, groupId }) => {
    const editOrgInitialValues = {
        permissions: group.permissions || [],
    }
    const [authorizedDomains, setAuthorizedDomains] = useState<string[]>(group.authorized_domains || []);  

    const [newDomain, setNewDomain] = useState<string>('');
    const {rolesData} = useDetailReport()
    const getPartnerAdminPermissions = () => {  
    if (!rolesData) {  
        return [];
    }   
    const partnerAdmin = rolesData.find(role => role.role_name === "partner_admin");  
    return partnerAdmin?.authorized_permissions || []; 
    }  
    const getClientAdminPermissions = () => {  
    if (!rolesData) {  
        return []; 
    }   
    const clientAdmin = rolesData.find(role => role.role_name === "client_admin");  
    return clientAdmin?.authorized_permissions || []; 
    }
    const partnerAdminPermissions = getPartnerAdminPermissions();
    const clientAdminPermissions = getClientAdminPermissions(); 
    const permissionsQuery = useQuery({
        ...getPermissionsQueryOptions(),
    });
    const permissionValues = permissionsQuery.data ?? [];
    const userPermissions = role === 'PARTNER' ? partnerAdminPermissions : clientAdminPermissions;  
    const displayPermissions = permissionValues?.filter(permission => userPermissions.includes(permission.id))  
        .map(permission => ({  
            value: permission.id, 
            label: permission.name 
        }));  
    const handleAddDomain = (event: React.KeyboardEvent<HTMLInputElement> | React.FormEvent<HTMLFormElement>) => {  
        if(event.type === 'keydown' && (event as React.KeyboardEvent).key !== 'Enter') {  
            return;  
        }  
        event.preventDefault();  
        const domainToAdd = newDomain.trim();  
        if (domainToAdd) {  
            if (role === 'CLIENT') {  
                setAuthorizedDomains([domainToAdd]);
            } else if (!authorizedDomains.includes(domainToAdd)) {  
                setAuthorizedDomains([...authorizedDomains, domainToAdd]); 
            }  
            setNewDomain('');  
        }  
    };
    const handleRemoveDomain = (domainToRemove: string) => {  
        setAuthorizedDomains(authorizedDomains.filter(domain => domain !== domainToRemove));  
    };

    const [isOpenPermissionsSelect, setIsOpenPermissionsSelect] = useState(false);

    const handleSubmit = async (values: FormValues) => {  
        const { permissions } = values;  

        const apiUrl = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/group/${groupId}/`;  
        const requestBody = {  
            authorized_domains: authorizedDomains,  
            permissions,  
        };  
        const tokens = await getAuthTokenOnClient();

        try {  
            const response = await fetch(apiUrl, {  
                method: 'PUT',  
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
            onUpdate({ ...group, authorized_domains: authorizedDomains, permissions });  
            onClose(); 
        } catch (error) {  
            console.error('Failed to edit group:', error);  
            const errorMessage = typeof error === "object" && error !== null && "message" in error ? error.message : String(error);  
            toast.error(`Failed to edit the group. ${errorMessage}`);   
        }  
    };  
    
    return (  
        <Formik
            initialValues={editOrgInitialValues}
            onSubmit={(values: FormValues, actions) => {  
                handleSubmit(values).then(() => {  
                    actions.setSubmitting(false); 
                    onClose(); 
                }).catch(error => {  
                    console.error("Form submission error:", error);  
                });  
            }}
              validationSchema={toFormikValidationSchema(validationSchema)}
        >
            {({
                submitForm,
                setFieldValue,
                values,
                errors,
                touched,
                setFieldTouched,
                isSubmitting,    
            }) => {
                const selectedPermissions = values.permissions || [];
            return(
            <Dialog open>  
                <DialogContent className="w-full max-w-[550px] p-4 max-sm:max-w-[95vw] md:p-5">  
                    <DialogHeader>  
                    <DialogTitle>  
                    <div className="flex w-full items-center justify-between">  
                        <div className="flex items-center space-x-2 border-b border-[#ab00ab] pb-2">  
                            <Image src="/profile.svg" width="24" height="24" alt="Profile" />  
                            <h2 className="text-xl font-semibold text-[#ab00ab]">  
                            <FormattedMessage id="editOrgTitle" />  
                            </h2>  
                        </div>  
                        <button onClick={onClose} className="text-[#ab00ab]">X</button>  
                    </div>  
                    </DialogTitle>  
                    </DialogHeader>  
                    <div className="mt-7">  
                    <form  
                        onSubmit={submitForm}  
                    >  
                        <label htmlFor="orgName" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                            <FormattedMessage id="orgName"/>  
                        </label>
                        <input  
                            id="orgName"  
                            type="text"  
                            className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                            placeholder="orgName"
                            defaultValue= {group?.name}
                            disabled={true}
                        />
                        <label htmlFor="authorizedDomains" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                            <FormattedMessage id="authorizedDomains"/>  
                        </label>
                        {role === 'CLIENT' && (  
                            <>
                            <div className="my-4 flex flex-wrap gap-2">  
                                {authorizedDomains.map((domain, index) => (  
                                    <div key={index} className="flex items-center gap-2 rounded bg-blue-100 p-1">  
                                    {domain}  
                                    <XCircle className="size-4 cursor-pointer text-blue-500" onClick={() => handleRemoveDomain(domain)} />  
                                    </div>  
                                ))}  
                            </div>  
                            <input  
                                id="domainInput"  
                                type="text"  
                                value={authorizedDomains[0] || ''} 
                                onChange={(e) => setAuthorizedDomains([e.target.value.trim()])}  
                                className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none"  
                                placeholder="Domain name"   
                            />  
                            </>
                        )}  

                        {role === 'PARTNER' && (  
                            <>  
                                <div className="my-4 flex flex-wrap gap-2">  
                                    {authorizedDomains.map((domain, index) => (  
                                        <div key={index} className="flex items-center gap-2 rounded bg-blue-100 p-1">  
                                            {domain}  
                                            <XCircle className="size-4 cursor-pointer text-blue-500" onClick={() => handleRemoveDomain(domain)} />  
                                        </div>  
                                    ))}  
                                </div>  
                                <input  
                                    id="domainInput"  
                                    type="text"  
                                    value={newDomain}  
                                    onChange={(e) => setNewDomain(e.target.value)}  
                                    onKeyDown={handleAddDomain}   
                                    className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none"  
                                    placeholder="Add more domains"   
                                />  
                            </>  
                        )}
                        <label htmlFor="permissions" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                            <FormattedMessage id="permissions"/>  
                        </label>
                        <Select
                            open={isOpenPermissionsSelect}
                            onOpenChange={(value)=>{
                                if(value===true){
                                    setIsOpenPermissionsSelect(true);
                                }
                            }}
                        >
                            <SelectTrigger
                                onFocus={() => {
                                    setFieldTouched("permissions");
                                  }}
                                  className={cn(
                                    errors["permissions"] &&
                                      touched["permissions"] &&
                                      "ring-1 ring-red-500",
                                  )}
                            >
                                {selectedPermissions.length > 0
                                ? `${selectedPermissions.length} permissions selected`
                                : "Select"}
                            </SelectTrigger>
                            <SelectContent
                                onPointerDownOutside={() => {
                                setIsOpenPermissionsSelect(false);
                                }}
                            >
                               {displayPermissions.map((permission) => {
                                    const isSelected = selectedPermissions.includes(
                                        permission.value as never,
                                    );
                                    return (
                                        <SelectItem
                                        key={permission.value}
                                        value={permission.value}
                                        className="px-4"
                                        onClick={() => {
                                            if (isSelected) {
                                            setFieldValue(
                                                "permissions",
                                                selectedPermissions.filter(
                                                (p) => p !== permission.value,
                                                ),
                                            );
                                            } else {
                                            setFieldValue("permissions", [
                                                ...selectedPermissions,
                                                permission.value,
                                            ]);
                                            }
                                        }}
                                        >
                                        <span className="flex items-center gap-[14px]">
                                            {isSelected ? (
                                            <IconChekboxChecked className="w-10 shrink-0" />
                                            ) : (
                                            <IconChekboxUnChecked className="w-10 shrink-0" />
                                            )}
                                            {permission.label}
                                        </span>
                                    </SelectItem>
                                    );
                                })} 
                            </SelectContent>
                        </Select>
                        <ErrorMessage name={"permissions"}>
                            {(errorMessage) => (
                                <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
                            )}
                        </ErrorMessage>
                        <label htmlFor="adminEmail" style={{ fontSize: '15px' }} className="mb-2 block font-semibold text-gray-900">  
                            <FormattedMessage id="adminEmail"/>  
                        </label>
                        <input  
                            id="adminEmail"  
                            type="text"  
                            defaultValue={group?.admin_user}  
                            className="mb-2 h-11 w-full rounded-lg border px-3 text-sm outline-none placeholder:text-sm md:text-base md:placeholder:text-base lg:h-12 lg:px-4"  
                            placeholder="adminEmail"  
                            disabled={true}
                        />  
                        <div className="mt-3.5 flex justify-end">  
                        <button  
                            className="h-11 rounded-md bg-[#720072] px-8 font-medium text-white duration-300 enabled:hover:opacity-80 disabled:opacity-50"  
                            type="submit"  
                            onClick={submitForm}
                            disabled={  
                                (authorizedDomains.length === 0 && !newDomain) || 
                                selectedPermissions.length === 0 || 
                                Object.keys(errors).length !== 0 || 
                                isSubmitting 
                            }  
                        >  
                            <FormattedMessage id="updateOrg" />  
                        </button>
                        </div>  
                    </form>  
                    </div>  
                </DialogContent>  
            </Dialog>  
            );
        }}
        </Formik>
        
    );  
};  

export default EditOrg;