import { motion } from "framer-motion";
import { useMemo } from "react";

export default function IconButton({
  children,
  className,
  onClick,
  variant = "primary",
}: {
  children: JSX.Element;
  className?: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const colorDetails = useMemo(() => {
    switch (variant) {
      case "primary":
        return "bg-primary hover:bg-primary/90";
      case "secondary":
        return "bg-secondary hover:bg-secondary/90";
    }
  }, [variant]);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      type='button'
      className={`p-1 rounded-50 text-primary-foreground rounded-md shadow-md  focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className} ${colorDetails}`}
    >
      {children}
    </motion.button>
  );
}
