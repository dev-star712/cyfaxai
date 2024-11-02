import IconKey from "@/components/icons/icon-key";
import IconSms from "@/components/icons/icon-sms";
import routes from "@/constants/routes";
import { getLoginMutationOptions } from "@/cyfax-api-client/mutations";
import { cn, getApiErrorMessage } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Formik, useField, Field, useFormikContext } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { ComponentProps, forwardRef, ReactNode, useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import { z } from "zod";
import { Eye, EyeOff } from 'lucide-react'; 
import { toFormikValidationSchema } from "zod-formik-adapter";

const validationSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Invalid email address"),
  password: z.string({ message: "Password is required" }),
});

const Login = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const intl = useIntl();

  const loginMutation = useMutation({
    ...getLoginMutationOptions(),
    onError(error) {
      toast.error(getApiErrorMessage(error));
    },
    onSuccess: async () => {  
      try {  
        await router.push(routes.dashboard);  
        
        await queryClient.cancelQueries();  
        await queryClient.invalidateQueries();  
  
        toast.success(intl.formatMessage({ id: "logInSuccessMessage" }));  
      } catch (error) {  
        console.error("An error occurred during navigation or query update", error);  
      }  
    }, 
  });
  const [initialValues, setInitialValues] = useState({  
    email: '',  
    password: '',  
    rememberMe: false,  
  });  
  useEffect(() => {  
    const storedEmail = localStorage.getItem('email');  
    const storedPassword = localStorage.getItem('password');  
    
    setInitialValues({  
      email: storedEmail ? storedEmail : "",  
      password: storedPassword ? storedPassword : "",  
      rememberMe: !!storedEmail && !!storedPassword 
    });  
  }, []);

  return (
    <div className="flex flex-col items-center px-5 pb-20 lg:pb-[148px]">
      <h1 className="mt-4 max-w-[862px] text-center font-medium max-sm:max-w-[244px] sm:mt-11 sm:text-[34px]/[46px] lg:text-[50px]/[70px]">
        <FormattedMessage id="logInTitle" />
      </h1>
      <div className="mt-6 w-full max-w-[643px] sm:mt-20 lg:mt-[104px]">
        
        <div className='mb-8 flex flex-col items-center justify-center space-y-1 text-center'>  
          <h2 className="text-[40px] font-medium leading-[150%]"> 
            <FormattedMessage id="login" />
          </h2>
        </div>

        <Formik
          initialValues={initialValues}
          onSubmit={async (values, actions) => {
            try {
              if (values.rememberMe) {  
                localStorage.setItem('email', values.email);  
                localStorage.setItem('password', values.password);  
              } else {  
                localStorage.removeItem('email');  
                localStorage.removeItem('password');  
              }
              await loginMutation.mutateAsync(values);
            } catch (error) {
              actions.setSubmitting(false);
            }
          }}
          validationSchema={toFormikValidationSchema(validationSchema)}
          enableReinitialize={true}
        >
          {({ submitForm, isSubmitting }) => (
            <form
              autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              className="mt-6 sm:mt-8 lg:mt-10"
            >
              <div className="space-y-4 md:space-y-[34px]">
                <FormikInput
                  name="email"
                  placeholder={intl.formatMessage({ id: "email" })}
                  icon={
                    <IconSms className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />
                  }
                  autoComplete="off"
                />
                <FormikInput
                  name="password"
                  type="password"
                  placeholder={intl.formatMessage({ id: "password" })}
                  autoComplete="new-password"
                  icon={
                    <IconKey className="absolute left-6 top-1/2 max-w-6 -translate-y-1/2 text-black/60 max-md:hidden" />
                  }
                />
              </div>
              <div className="mb-8 mt-4 flex w-full items-center justify-between">  
                <label className="flex min-w-[120px] cursor-pointer items-center space-x-2">  
                  <Field type="checkbox" name="rememberMe" className="size-4"/>  
                  <span className="text-sm text-gray-700"><FormattedMessage id="rememberMe" /></span>  
                </label>  
                <Link  
                  href={routes.forgotPassword}  
                  style={{color: '#720072'}}
                  className="flex min-w-[120px] justify-end text-sm underline-offset-4 duration-300 hover:opacity-90 md:underline"  
                >  
                  <FormattedMessage id="forgotPassword" />  
                </Link>  
              </div> 
              <button
                type="submit"
                style={{backgroundColor: '#720072'}}
                className="h-[56px] w-full rounded-[10px] text-center font-semibold text-white duration-300 hover:opacity-90 md:h-[75px] md:rounded-[15px] md:text-xl"
                disabled={isSubmitting}
              >
                <FormattedMessage id={isSubmitting ? "pleaseWait" : "login"} />
              </button>
              <div className="mt-[50px] flex justify-center">
                <p className="text-sm">
                  <span className="inline-block opacity-60">
                    <FormattedMessage id="dontHaveAnAccount" />
                  </span>{" "}
                  <Link href={"#"} style={{color: '#720072'}} className="underline underline-offset-[3px]">
                    <FormattedMessage id="signUp" />
                  </Link>
                </p>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;

type FormikInputProps = Omit<ComponentProps<"input">, "name"> & {
  icon: ReactNode;
  name: string;
  showError?: boolean;
};

const FormikInput = forwardRef<HTMLInputElement, FormikInputProps>(
  ({ icon, name, showError = true, ...props }, ref) => {
    const { getFieldProps } = useFormikContext();
    const [, meta] = useField(name);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);  
    const inputType = name === "password" && showPassword ? "text" : props.type

    const hasError = meta.error && meta.touched;
    const endIcon = name === "password" ? (  
      showPassword ? (  
        <EyeOff onClick={togglePasswordVisibility} className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer" />  
      ) : (  
        <Eye onClick={togglePasswordVisibility} className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer" />  
      )  
    ) : null;  

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
          {icon}
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
