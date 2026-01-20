import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Heart, RotateCcw, Star, Zap } from "lucide-react";

interface SwipeActionsProps {
  onSwipe: (direction: "left" | "right") => void;
  onUndo: () => void;
  onSuperLike: () => void;
  canUndo: boolean;
  disabled: boolean;
}

const SwipeActions = ({
  onSwipe,
  onUndo,
  onSuperLike,
  canUndo,
  disabled,
}: SwipeActionsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center gap-4 py-6"
    >
      {/* Undo Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-soft"
      >
        <RotateCcw className="w-5 h-5" />
      </motion.button>

      {/* Pass Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSwipe("left")}
        disabled={disabled}
        className="w-16 h-16 rounded-full bg-background border-2 border-destructive/30 flex items-center justify-center text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-card"
      >
        <X className="w-7 h-7" />
      </motion.button>

      {/* Super Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSuperLike}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-soft"
      >
        <Star className="w-5 h-5" />
      </motion.button>

      {/* Like Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onSwipe("right")}
        disabled={disabled}
        className="w-16 h-16 rounded-full gradient-warm flex items-center justify-center text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-elevated"
      >
        <Heart className="w-7 h-7" />
      </motion.button>

      {/* Boost Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        disabled={disabled}
        className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-soft"
      >
        <Zap className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

export default SwipeActions;
