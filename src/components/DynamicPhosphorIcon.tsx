import React from "react";
import * as PhosphorIcons from "phosphor-react-native";
import { IconProps } from "phosphor-react-native";

interface DynamicPhosphorIconProps extends IconProps {
  name: string;
}

const DynamicPhosphorIcon: React.FC<DynamicPhosphorIconProps> = ({
  name,
  ...rest
}) => {
  const IconComponent = PhosphorIcons[name as keyof typeof PhosphorIcons] as React.ElementType;

  if (!IconComponent) {
    console.warn(`Phosphor Icon "${name}" not found.`);
    return null;
  }

  return <IconComponent {...rest} />;
};

export default DynamicPhosphorIcon;
