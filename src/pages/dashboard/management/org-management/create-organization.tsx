import IconChekboxChecked from "@/components/icons/icon-chekbox-checked";
import IconChekboxUnChecked from "@/components/icons/icon-chekbox-unchecked";
import { Eye, EyeOff } from 'lucide-react';
import Router from 'next/router';  
import routes from "@/constants/routes";
import {
  FormikSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  FormikDomainInput,
} from "@/components/ui/select";
import { getPermissionsQueryOptions, getRolesQueryOptions } from "@/cyfax-api-client/queries";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ErrorMessage, Formik, useField, useFormikContext } from "formik";
import {
  useMemo,
  forwardRef,
  useState,
  useEffect,
  ComponentProps,
} from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import useDetailReport from "@/views/current-risk/hooks/useDetailReport";

import cyfaxApiClient from "@/cyfax-api-client";
import { cn, getApiErrorMessage } from "@/lib/utils";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { z } from "zod";
import useAuthUserAccount from "@/hooks/useAuthUserAccount";


const validationSchema = z.object({
  permissions: z.array(z.string()).min(1, "Permissions are required"),
  email: z
    .string({
      message: "Email is required",
    })
    .email("Invalid email address"),
  password: z.string({
    message: "Password is required",
  }),
  confirmPassword: z.string({  
    message: "Confirm Password is required",  
  }), 
  full_name: z.string({
    message: "Full name is required",
  }),
  name: z.string({
    message: "Name is required",
  }),
  authorized_domains: z.array(z.string().min(1, "Domain name is required")).min(1, "At least one domain is required"),
  group_kind: z.string({ message: "Group kind is required" }),
}).refine((data) => data.password === data.confirmPassword, {  
  message: "Passwords do not match",  
  path: ["confirmPassword"],
});  

const initialValues = {
  permissions: null,
  email: "",
  password: "",
  confirmPassword: "",
  full_name: "",
  name: "",
  authorized_domains: [],
  group_kind: "",
};

interface PermissionOption {  
  label: string;  
  value: string;  
}

const OrgManagement = () => {
  const [isOpenPermissionsSelect, setIsOpenPermissionsSelect] = useState(false);

  const intl = useIntl();
  const { data } = useAuthUserAccount();

  const {roleNameToIdMap, rolesData} = useDetailReport()
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

  const groupKindOptions = useMemo(() => {  
    const roleName = data?.role ? roleNameToIdMap[data.role] : undefined; 
  
    switch (roleName) {  
      case "super_admin":  
        return [  
          { label: "client", value: "client" },  
          { label: "partner", value: "partner" },  
        ];  
      case "partner_admin":  
        return [{ label: "client", value: "client" }];  
      default:  
        return []; 
    }  
  }, [data?.role, roleNameToIdMap]); 




  const permissionsQuery = useQuery({
    ...getPermissionsQueryOptions(),
  });


  const permissionValues = permissionsQuery?.data;

  const roles = useQuery({
    ...getRolesQueryOptions(),
  });

  const createUserManagementMutation = useMutation({
    mutationKey: ["create-user-management"],
    mutationFn: (data: any) =>
      cyfaxApiClient.post<{
        id: string;
        is_admin: boolean;
        email: string;
        last_login: string;
        date_joined: string;
        full_name: string;
        phone: string;
        is_active: true;
        groups: any[];
        permissions: any[];
      }>("/user_management/", data),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const createGroupsMutation = useMutation({
    mutationKey: ["create-groups"],
    mutationFn: (data: any) =>
      cyfaxApiClient.post<{
        data: {
          id: string;
          name: string;
          authorized_domains: string[];
          group_kind: string;
          admin_email: string;
          permissions: string[];
        };
      }>("/groups/", data),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  const addGroupPermissionMutation = useMutation({
    mutationKey: ["add-group-permission"],
    mutationFn: (data: any) => cyfaxApiClient.post("/group_permission/", data),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
  
  const [currentGroupKind, setCurrentGroupKind] = useState('');  
  const [permissionOptions, setPermissionOptions] = useState<PermissionOption[]>([]);
  
  useEffect(() => {  
    let permissionsToMap: string[] = [];  
  
    if (currentGroupKind === 'client') {  
      permissionsToMap = clientAdminPermissions;  
    } else if (currentGroupKind === 'partner') {  
      permissionsToMap = partnerAdminPermissions;  
    }  
  
    const filteredAndMappedPermissions: PermissionOption[] = permissionsToMap  
    .map(permissionId => {  
      const foundPermission = permissionValues?.find(permission => permission.id === permissionId);  
      if (foundPermission) {  
        return {  
          label: foundPermission.name,  
          value: permissionId,  
        } as PermissionOption; 
      }  
      return null;   
    })  
    .filter((permission): permission is PermissionOption => Boolean(permission));  
    
  setPermissionOptions(filteredAndMappedPermissions);
  }, [currentGroupKind, clientAdminPermissions, partnerAdminPermissions, permissionValues]);
  

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={async (values, actions) => {
        try {
          const rolesData = roles.data?.data;

          if (!rolesData) {  
            return;  
          }  
          const clientAdminRole = rolesData.find(role => role.role_name === 'client_admin');  
          const partnerAdminRole = rolesData.find(role => role.role_name === 'partner_admin');  

          let selectedRoleId;  
          if (values.group_kind === 'client') {  
            selectedRoleId = clientAdminRole?.id; 
          } else if (values.group_kind === 'partner') {  
            selectedRoleId = partnerAdminRole?.id;  
          }  

          if (!selectedRoleId) {  
            console.error('Selected role ID not found.');  
            return;
          } 
          await createUserManagementMutation.mutateAsync({
            email: values.email,
            password: values.password,
            full_name: values.full_name,
            role: selectedRoleId,
          });
          const res = await createGroupsMutation.mutateAsync({
            name: values.name,
            authorized_domains: values.authorized_domains,
            group_kind: values.group_kind,
            admin_email: values.email,
          });
          await addGroupPermissionMutation.mutateAsync({
            group: res.data.data.id,
            permissions: values.permissions,
          });
          toast.success("Organization created successfully");
          actions.setSubmitting(false);
          actions.resetForm();
          Router.push(routes.orgManagement); 
        } catch (error) {
          actions.setSubmitting(false);
        }
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
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitForm();
            }}
            className="p-4 font-inter md:p-6"
          >
            <h2 className="font-mulish text-base font-semibold md:text-xl lg:text-2xl/[120%]">
              <FormattedMessage id="organizationalManagement" />
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl md:p-5 md:shadow-[0_0_12px_rgba(0,0,0,0.12)] lg:grid-cols-2 lg:gap-6">
              <FormikInput
                name="name"
                label="createAnOrganization"
                placeholder={intl.formatMessage({ id: "writeFullNameHere" })}
              />
              <FormikSelect  
                name="group_kind"  
                label="isThisOrganizationAClientOrPartner"  
                placeholder="Select"  
                options={groupKindOptions}  
                onChange={value => {
                  setCurrentGroupKind(value);
                  setFieldValue("permissions", [])
                  setFieldValue("authorized_domains", [])
                }}
              /> 
              <FormikInput
                name="full_name"
                label="authorizedAdministrator"
                placeholder={intl.formatMessage({
                  id: "writeAdministratorFullNameHere",
                })}
              />
              <FormikInput
                name="email"
                label="authorizedAdministratorEmail"
                placeholder={intl.formatMessage({
                  id: "inputTheAuthorizedAdministratorEmailHere",
                })}
              />
              <FormikInput
                name="password"
                label="password"
                type="password"
                placeholder={intl.formatMessage({ id: "inputTemporaryPasswordHere" })}
                autoComplete="new-password"
              />
              <FormikInput
                name="confirmPassword"
                label="confirmPassword"
                type="password"
                placeholder={intl.formatMessage({ id: "inputConfirmPasswordHere" })}
                autoComplete="confirm-password"
              />
              <div className="lg:col-span-2">  
              <FormikDomainInput  
                name="authorized_domains"  
                groupKind={values.group_kind} // Ensure this is based on your form state  
                label="authorizedOrganizationalDomain"  
                placeholder={intl.formatMessage({ id: "inputTheDomainNameOfTheOrganization" })}
                onChange={(domains)=>setFieldValue("authorized_domains", domains)}
              />
              </div>
              <div className="relative lg:col-span-2">

                <label className="mb-4 inline-block text-sm font-medium md:text-base lg:text-xl">
                  <FormattedMessage id="permissions" />
                </label>

                <Select
                  open={isOpenPermissionsSelect}
                  onOpenChange={(value) => {
                    if (value === true) {
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
                    {permissionOptions.map((permission) => {
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
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button  
                  type="submit"  
                  className="h-14 w-40 rounded-lg bg-[#720072] px-8 text-base font-semibold text-white duration-300 hover:opacity-90 sm:w-48 md:text-lg lg:text-xl"  
                  disabled={isSubmitting}  
              >  
                  {isSubmitting ? (  
                      <FormattedMessage id="pleaseWait" />  
                  ) : (  
                      <FormattedMessage id="submit" />  
                  )}  
              </button>
            </div>
          </form>
        );
      }}
    </Formik>
  );
};

export default OrgManagement;

type FormikInputProps = Omit<ComponentProps<"input">, "name"> & {
  name: string;
  showError?: boolean;
  label?: string;
};

const FormikInput = forwardRef<HTMLInputElement, FormikInputProps>(
  ({ name, showError = true, label, ...props }, ref) => {
    const { getFieldProps } = useFormikContext();
    const [, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);
    const intl = useIntl();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);  
    const inputType = (name === "password" || name === "confirmPassword") && showPassword ? "text" : props.type;  

    const hasError = meta.error && meta.touched;  
    const endIcon = (name === "password" || name === "confirmPassword") ? (  
      showPassword ? (  
        <EyeOff onClick={togglePasswordVisibility} className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer" />  
      ) : (  
        <Eye onClick={togglePasswordVisibility} className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer" />  
      )  
    ) : null; 

    return (
      <div>
        {label && (  
          <label className="mb-4 inline-block text-sm font-medium md:text-base lg:text-xl">{intl.formatMessage({id: label})}</label>  
        )} 
        <div className="relative">
          <input
            ref={ref}
            {...props}
            {...getFieldProps(name)}
            type={inputType}
            className={cn(
              "h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl",
              hasError && "ring-1 ring-red-500",
              props.className,
            )}
          />
          {endIcon}
        </div>
        {showError && hasError && (
          <p className="mt-2 text-xs text-red-500">{meta.error}</p>
        )}
      </div>
    );
  },
);
FormikInput.displayName = "FormikInput";


