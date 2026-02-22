export const toCamelCase = (str: string | null | undefined): string => {
  if (!str) return "";
  const parts = str.split(" ");
  return (
    parts[0].toLowerCase() +
    parts
      .slice(1)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("")
  );
};
