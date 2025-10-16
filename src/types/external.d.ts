declare module "framer-motion" {
  export const motion: {
    div: React.ComponentType<React.HTMLAttributes<HTMLDivElement>>;
    [key: string]: React.ComponentType<React.HTMLAttributes<HTMLElement>>;
  };
}
