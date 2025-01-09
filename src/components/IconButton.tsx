import { motion } from "framer-motion";

export default function IconButton({
  children,
  className,
  onClick,
}: {
  children: JSX.Element;
  className?: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onClick={onClick}
      type='button'
      className={`p-1 rounded-50 bg-primary text-primary-foreground shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    >
      {children}
    </motion.button>
  );
}
