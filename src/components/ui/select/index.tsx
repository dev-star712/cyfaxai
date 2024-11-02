import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown, ChevronUp } from "lucide-react";

import IconChevronDown from "@/components/icons/icon-chevron-down";
import { ErrorMessage, useFormikContext, useField } from "formik";
import { FormattedMessage } from "react-intl";
import React, { useState, KeyboardEvent } from 'react';  
import { XCircle } from 'lucide-react';  
import { cn } from "@/lib/utils";  


const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex w-full h-12 md:h-14 lg:h-[70px] rounded-lg lg:rounded-xl outline-none bg-black/10 px-3 md:px-4 lg:px-6 font-medium backdrop-blur-xl items-center justify-between border border-input py-2 max-md:text-xs",
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <IconChevronDown className="w-4 text-[#292D32] md:w-5 lg:w-6" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronUp className="size-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-center py-1",
      className,
    )}
    {...props}
  >
    <ChevronDown className="size-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 rounded-b-lg lg:rounded-b-xl bg-white font-medium shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      sideOffset={0}
      {...props}
    >
      <SelectScrollUpButton />  
      <SelectPrimitive.Viewport  
        className={cn(  
          "p-1 overflow-y-auto", // Apply overflow-y-auto here for the scroll, and a padding for visual spacing  
          "max-h-60", // This controls the maximum height before scrolling; adjust as needed  
          position === "popper" &&  
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",  
        )}  
      >  
        {children} 
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex py-4 w-full cursor-pointer select-none items-center rounded lg:rounded-md px-3 md:px-4 lg:pl-6 lg:pr-2 text-base font-medium outline-none focus:bg-black/10 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 max-md:text-xs",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

type FormikSelectProps = {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  label?: string;
  placeholder?: string;
  selectTrigger?: React.ComponentPropsWithoutRef<
    typeof SelectPrimitive.Trigger
  >;
  onChange?: (value: string) => void;
};

const FormikSelect = ({
  name,
  options,
  label,
  placeholder,
  selectTrigger,
  onChange,
}: FormikSelectProps) => {
  const { values, errors, touched, setFieldTouched, setFieldValue } =
    useFormikContext<any>();

  const id = React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-4 inline-block text-sm font-medium md:text-base lg:text-xl"
        >
          <FormattedMessage id={label} />
        </label>
      )}
      <div>
        <Select
          value={values[name] || ""}
          onValueChange={(value) => {
            setFieldValue(name, value);
            onChange?.(value);
          }}
        >
          <SelectTrigger
            aria-label={`Select ${label}`}
            {...selectTrigger}
            id={id}
            className={cn(
              errors[name] && touched[name] && "border-red-500",
              selectTrigger?.className,
            )}
            onBlur={(e) => {
              selectTrigger?.onBlur && selectTrigger?.onBlur(e);
              setFieldTouched(name);
            }}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.length > 0 ? (
              options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <FormattedMessage id={option.label} />
                </SelectItem>
              ))
            ) : (
              <div>
                <p className="px-5 py-6 text-center text-sm text-black/60">
                  Nothing to show here :(
                </p>
              </div>
            )}
          </SelectContent>
        </Select>
        <ErrorMessage name={name}>
          {(errorMessage) => (
            <p className="mt-2 text-xs text-red-500">{errorMessage}</p>
          )}
        </ErrorMessage>
      </div>
    </div>
  );
};

interface FormikDomainInputProps {  
  name: string;  
  groupKind: string;
  label?: string;  
  placeholder?: string;  
  onChange?:(domains: string[]) => void;
}  

const FormikDomainInput: React.FC<FormikDomainInputProps> = ({ name, groupKind, label, placeholder, onChange }) => {  
  const { setFieldValue } = useFormikContext();  
  const [field, meta] = useField(name);  
  const [inputValue, setInputValue] = useState("");  

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {  
    if (e.key === 'Enter' && inputValue.trim() !== '') {  
      e.preventDefault();  
      // If groupKind is 'client', replace the value else add to it  
      const newDomains = groupKind === 'client' ? [inputValue.trim()] : [...field.value, inputValue.trim()];  
      
      setFieldValue(name, newDomains, true); // Update the domains in Formik state  
      onChange && onChange(newDomains); // Ensures it calls onChange if provided  
      setInputValue(""); 
    }  
  };  

  const removeDomain = (domainToRemove: string) => {  
    const newDomains = field.value.filter((domain: string) => domain !== domainToRemove);  
    setFieldValue(name, newDomains, true); // Update the domains in Formik state  
  };  

  return (  
    <div>  
      {label && <label className="mb-4 inline-block text-sm font-medium md:text-base lg:text-xl"><FormattedMessage id={label} /></label>}  
      <div className="relative flex flex-wrap items-center gap-2 rounded-[10px] border bg-black/10 px-3 py-2 outline-none backdrop-blur-xl md:h-[66px] lg:h-[70px]">  
        {field.value.map((domain: string, index: number) => (  
          <div key={index} className="flex items-center gap-2 rounded bg-blue-100 px-2 py-1">  
            {domain}  
            <XCircle className="size-4 cursor-pointer text-blue-500" onClick={() => removeDomain(domain)} />  
          </div>  
        ))}  
        <input  
          type="text"  
          value={inputValue}  
          onChange={(e) => setInputValue(e.target.value)}  
          onKeyDown={handleKeyDown}  
          placeholder={placeholder}  
          className="flex-1 border-none bg-transparent outline-none placeholder:font-medium placeholder:text-black/80 placeholder:opacity-100 max-md:text-sm"  
        />  
      </div>  
      {meta.touched && meta.error && <div className="text-sm text-red-500">{meta.error}</div>}  
    </div>  
  );  
};  


export {
  FormikSelect,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  FormikDomainInput
};
