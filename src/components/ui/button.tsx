import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(  
    'focus-visible:ring-ring inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',  
    {  
      variants: {  
        variant: {  
          default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',  
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',  
          outline: 'border-input border border-[#eee] shadow-sm hover:bg-black hover:text-white dark:border-white',  
          clear: 'border-none',  
          secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',  
          ghost: 'hover:text-[#720072]-foreground hover:bg-[#720072]',  
          link: 'text-primary underline-offset-4 hover:underline',  
          glow: 'btn btn--wide !rounded-md',  
        },  
        size: {  
          default: 'h-9 px-4 py-2',  
          sm: 'h-8 rounded-md px-3 text-xs',  
          lg: 'h-10 rounded-md px-8',  
          icon: 'size-8',  
        },  
        float: {  
          default: 'justify-center',  
          left: 'justify-start',  
          right: 'justify-end',  
        },  
      },  
      defaultVariants: {  
        float: 'default',  
        variant: 'default',  
        size: 'default',  
      },  
    }  
  );

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, float, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        aria-label='lang'
        className={cn(buttonVariants({ variant, size, className, float }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
