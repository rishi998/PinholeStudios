import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-[transform,opacity,background-color,box-shadow] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "overflow-hidden bg-[linear-gradient(180deg,#ffc857,#e8890c)] text-[#07060a] shadow-[0_10px_40px_-10px_rgba(255,176,32,0.6),inset_0_1px_0_rgba(255,255,255,0.45)] before:pointer-events-none before:absolute before:inset-y-0 before:left-0 before:w-1/3 before:-translate-x-[220%] before:bg-white/40 before:transition-transform before:duration-500 [@media(hover:hover)]:hover:before:translate-x-[420%]",
        outline:
          "border-border bg-background hover:bg-muted aria-expanded:bg-muted",
        secondary:
          "border-white/10 bg-white/5 text-foreground backdrop-blur-md [@media(hover:hover)]:hover:bg-white/10",
        ghost:
          "hover:bg-muted aria-expanded:bg-muted",
        destructive:
          "bg-destructive/15 text-destructive hover:bg-destructive/25",
        link: "text-primary underline-offset-4 hover:underline",
        whatsapp:
          "bg-whatsapp text-black shadow-[0_10px_28px_-14px_var(--whatsapp)] [@media(hover:hover)]:hover:brightness-105",
      },
      size: {
        default: "h-11 min-h-11 gap-2 px-5",
        xs: "h-8 gap-1 px-2.5 text-xs",
        sm: "h-9 min-h-9 gap-1.5 px-4 text-sm",
        lg: "h-[52px] min-h-[52px] gap-2 px-6 text-base",
        icon: "size-11",
        "icon-xs": "size-8",
        "icon-sm": "size-11",
        "icon-lg": "size-[52px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2Icon className="animate-spin" /> : null}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
