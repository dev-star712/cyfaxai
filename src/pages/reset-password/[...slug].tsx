'use client';
import IconKey from "@/components/icons/icon-key";
import routes from "@/constants/routes";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';  
import { cn } from "@/lib/utils";
import { Formik, useField, useFormikContext } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import useAuthUserAccount from "@/hooks/useAuthUserAccount";
import { ComponentProps, forwardRef, ReactNode, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({  
    oldPassword: z.string().min(1, "Old Password is required"),  
    newPassword: z.string().min(1, "New Password is required"),  
    verifyPassword: z.string().min(1, "Verify Password is required"),  
  }).refine((data) => data.newPassword === data.verifyPassword, {  
    message: "New passwords do not match",  
    path: ["verifyPassword"],  
  });

interface FormValues {  
oldPassword: string;  
newPassword: string;  
verifyPassword: string;  
}  

const ResetPassword = () => {
  const router = useRouter();
  const keys = router.query.slug;
  const intl = useIntl();
  const { logout } = useAuthUserAccount();

  const handleSubmit = async (values: FormValues) => {  
    if (!keys || keys.length < 2) {  
      toast.error("Invalid password reset link.");  
      return;  
    }  
    
    const url = `${process.env.NEXT_PUBLIC_CYFAX_API_BASE_URL}/change_password/`;  
    const headers = {  
      'Content-Type': 'application/json',  
      // Include other headers as required by your backend  
    };  
    const body = JSON.stringify({  
      password: values.oldPassword,  
      new_password: values.newPassword,  
      pk: keys[0],  
      token: keys[1],  
    });  

    try {  
      const response = await fetch(url, { method: "POST", headers, body });  
      if (response.ok) {  
        toast.success("Password successfully changed.");  
        logout()
      } else {  
        // Handle non-2xx responses here  
        const error = await response.json(); 
        toast.error(`Failed to change password: ${error.data}`);  
      }  
    } catch (error) {  
      // Handle network errors here  
      toast.error("Failed to change password due to network error.");  
    }  
  };  

  return (
    <div className="flex flex-col items-center px-5 pb-20 lg:pb-[148px]">
      <div className="mt-6 w-full max-w-[643px] font-inter sm:mt-20 lg:mt-[104px]">
        <Link  
          href={routes.login}  
          className="mt-4 flex justify-start text-sm text-[#720072] underline-offset-4 duration-300 hover:opacity-90 max-md:font-medium md:underline"  
        >  
          <ArrowLeft className='mr-2 size-5' />  
          <FormattedMessage id="goBack" />  
        </Link> 
        <div className='mt-4 flex flex-col justify-center space-y-1 text-left'>  
          <h2 className="text-[30px] font-bold leading-[150%]"> 
            <FormattedMessage id="changePassword" />
          </h2>
        </div>

        <Formik  
        initialValues={{ oldPassword: '', newPassword: '', verifyPassword: '' }}  
        validationSchema={toFormikValidationSchema(validationSchema)}  
        onSubmit={(values, { setSubmitting }) => {  
          handleSubmit(values).finally(() => setSubmitting(false));  
        }}  
      >
          {({ submitForm, isSubmitting }) => (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              className="mt-2 sm:mt-8 lg:mt-10"
            >
              <div className="space-y-4 md:space-y-[20px]">
                <FormikInput
                  name="oldPassword"
                  type="password"
                  placeholder={intl.formatMessage({ id: "oldPassword" })}
                  autoComplete="old-password"
                  icon={
                    <IconKey className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />
                  }
                />
                <FormikInput
                  name="newPassword"
                  type="password"
                  placeholder={intl.formatMessage({ id: "newPassword" })}
                  autoComplete="new-password"
                  icon={
                    <IconKey className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />
                  }
                />
                <FormikInput
                  name="verifyPassword"
                  type="password"
                  placeholder={intl.formatMessage({ id: "verifyPassword" })}
                  autoComplete="verify-password"
                  icon={
                    <IconKey className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />
                  }
                />
              </div>
              <button
                type="submit"
                className="mt-10 h-[56px] w-full rounded-[10px] bg-[#720072] text-center font-semibold text-white duration-300 hover:opacity-90 md:h-[75px] md:rounded-[15px] md:text-xl"
                disabled={isSubmitting}
              >
                <FormattedMessage id={isSubmitting ? "pleaseWait" : "confirm"} />
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;

type FormikInputProps = Omit<ComponentProps<"input">, "name"> & {
  icon: ReactNode;
  name: string;
  showError?: boolean;
  type?: string;
};

const FormikInput = forwardRef<HTMLInputElement, FormikInputProps>(
  ({ icon, name, showError = true, type= "text", ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);  
    const { getFieldProps } = useFormikContext();
    const [, meta] = useField(name);

    const hasError = meta.error && meta.touched;
    const isPasswordType = type === "password";  
    const inputType = showPassword && isPasswordType ? "text" : type;
    const togglePasswordVisibility = () => setShowPassword(!showPassword);  

    return (
      <div>
        <div className="relative">
          <input
            ref={ref}
            {...props}
            {...getFieldProps(name)}
            type={inputType}  
            className={cn(
              "h-12 w-full rounded-[10px] bg-black/10 px-5 outline-none backdrop-blur-xl placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm max-md:placeholder:text-sm md:h-[66px] md:rounded-xl md:pl-[60px]",
              hasError && "ring-1 ring-red-500",
              props.className,
            )}
          />
            {isPasswordType && (  
                <button  
                type="button" // Ensure this is a button to avoid form submission  
                className="absolute inset-y-0 right-0 flex items-center pr-3"  
                onClick={togglePasswordVisibility}  
                >  
                {showPassword ? <EyeOff /> : <Eye />}  
                </button>  
            )}  
            {icon}
        </div>
        {showError && hasError && (
          <p className="mt-2 text-xs text-red-500">{meta.error}</p>
        )}
      </div>
    );
  },
);
FormikInput.displayName = "FormikInput";
