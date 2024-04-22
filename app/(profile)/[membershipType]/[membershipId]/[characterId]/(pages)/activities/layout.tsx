import React from "react";
import { FilterProvider } from "./filter/filterContext";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <React.Fragment>
      <FilterProvider>{children}</FilterProvider>
    </React.Fragment>
  );
}
