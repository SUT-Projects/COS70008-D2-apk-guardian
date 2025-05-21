import React from "react";

export interface RouteInterface {
  path: string;
  label: string;
  exact?: boolean;
  icon?: React.ComponentType;
  nestedRoutes?: Array<RouteInterface>;
}
