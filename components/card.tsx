import * as React from "react";

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "glass";
}

const variantClasses: Record<
  NonNullable<CardProps["variant"]>,
  string
> = {
  default:
    "border-white/10 bg-white/[0.04]",
  elevated:
    "border-white/15 bg-white/[0.06] shadow-2xl shadow-black/20",
  glass:
    "border-white/10 bg-white/[0.03] backdrop-blur-xl",
};

export const Card = React.forwardRef<
  HTMLDivElement,
  CardProps
>(function Card(
  {
    variant = "default",
    className = "",
    children,
    ...props
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "rounded-2xl border",
        "transition-all duration-200",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export interface CardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  CardHeaderProps
>(function CardHeader(
  { className = "", children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "flex flex-col gap-1.5 p-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = "CardHeader";

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  CardTitleProps
>(function CardTitle(
  { className = "", children, ...props },
  ref,
) {
  return (
    <h3
      ref={ref}
      className={[
        "text-lg font-semibold tracking-tight text-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription(
  { className = "", children, ...props },
  ref,
) {
  return (
    <p
      ref={ref}
      className={[
        "text-sm leading-6 text-white/55",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = "CardDescription";

export interface CardContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<
  HTMLDivElement,
  CardContentProps
>(function CardContent(
  { className = "", children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "p-6 pt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  CardFooterProps
>(function CardFooter(
  { className = "", children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={[
        "flex items-center p-6 pt-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = "CardFooter";

export default Card;
