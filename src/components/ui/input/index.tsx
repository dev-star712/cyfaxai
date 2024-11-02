import { cn } from "@/lib/utils";
import { useField, useFormikContext } from "formik";
import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  forwardRef,
  useId,
} from "react";
import { FormattedMessage } from "react-intl";

type InputProps = {
  label: string;
  wrapper?: ComponentPropsWithoutRef<"div">;
} & ComponentPropsWithRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, id, wrapper, ...rest }, ref) => {
    const _id = useId();

    const inputId = id || _id;
    return (
      <div {...wrapper}>
        <label
          htmlFor={inputId}
          className="mb-4 inline-block text-sm font-medium md:text-base lg:text-xl"
        >
          <FormattedMessage id={label} />
        </label>
        <input
          ref={ref}
          className={cn(
            "block h-12 md:h-14 lg:h-[70px] w-full rounded-lg lg:rounded-xl bg-black/10 px-3 md:px-4 lg:px-6 outline-none backdrop-blur-xl placeholder:text-black/80 placeholder:opacity-100 placeholder:font-medium font-medium max-md:placeholder:text-xs max-md:text-xs",
            className,
          )}
          type="text"
          id={inputId}
          {...rest}
        />
      </div>
    );
  },
);
Input.displayName = "Input";
export default Input;

type FormikInputProps = Omit<InputProps, "name"> & {
  name: string;
  showError?: boolean;
};

export const FormikInput = forwardRef<HTMLInputElement, FormikInputProps>(
  ({ name, showError = true, ...props }, ref) => {
    const { getFieldProps } = useFormikContext();
    const [, meta] = useField(name);

    const hasError = meta.error && meta.touched;

    // {...getFieldProps(name)}
    return (
      <div>
        <Input
          ref={ref}
          {...props}
          {...getFieldProps(name)}
          className={cn(hasError && "ring-1 ring-red-500", props.className)}
        />
        {showError && hasError && (
          <p className="mt-2 text-xs text-red-500">{meta.error}</p>
        )}
      </div>
    );
  },
);
FormikInput.displayName = "FormikInput";
