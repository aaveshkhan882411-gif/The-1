import * as React from "react";

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<
  NonNullable<AvatarProps["size"]>,
  string
> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  function Avatar(
    {
      src,
      alt = "",
      fallback,
      size = "md",
      className = "",
      ...props
    },
    ref,
  ) {
    const [imageError, setImageError] = React.useState(false);

    const showImage = Boolean(src) && !imageError;

    return (
      <div
        ref={ref}
        className={[
          "relative inline-flex shrink-0 items-center justify-center",
          "overflow-hidden rounded-full border border-white/10",
          "bg-white/[0.06] text-white/80",
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <span aria-hidden={!fallback}>
            {fallback || "?"}
          </span>
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export default Avatar;
