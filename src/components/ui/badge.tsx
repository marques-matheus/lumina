import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        waiting: "border-yellow-500 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        inProgress: "border-blue-500 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        completed: "border-green-300 bg-green-100 text-green-800 dark:bg-green-600/80 dark:text-white",
        delivered: "border-green-500 bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
        canceled: "border-red-500 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        default: "border-gray-300 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
