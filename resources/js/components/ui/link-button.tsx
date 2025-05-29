import * as React from "react"
import { Link, type InertiaLinkProps } from "@inertiajs/react"
import { type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

type ButtonVariants = VariantProps<typeof buttonVariants>

export interface LinkButtonProps
  extends Omit<InertiaLinkProps, 'className' | 'size'> {
  className?: string
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  href: string
  external?: boolean
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, href, external = false, children, ...props }, ref) => {
    const linkClassName = cn(buttonVariants({ variant, size, className }))

    // use regular anchor tag for external links
    if (external) {
      return (
        <a
          href={href}
          className={linkClassName}
          ref={ref}
          target="_blank"
          rel="noopener noreferrer"
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      )
    }

    // use the inertia link component for internal navigation
    return (
      <Link
        href={href}
        className={linkClassName}
        ref={ref}
        {...props}
      >
        {children}
      </Link>
    )
  }
)
LinkButton.displayName = "LinkButton"

export { LinkButton }
