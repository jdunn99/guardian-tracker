"use client";
import React from "react";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, children, heading = "", ...rest }, ref) => (
    <div
      ref={ref}
      {...rest}
      className="bg-slate-800 p-[18px] rounded-lg border border-slate-700 break-all"
    >
      <h1 className="font-semibold mb-4  text-sm text-slate-200 border-yellow-500">
        {heading}
      </h1>
      {children}
    </div>
  )
);
Container.displayName = "Container";
