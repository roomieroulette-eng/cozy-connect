import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from "lucide-react";
import { Profile } from "@/data/profiles";
import confetti from "canvas-confetti";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchedProfile: Profile | null;
  onSendMessage: () => void;
  onKeepSwiping: () => void;
}

const MatchModal = ({
  isOpen,
  onClose,
  matchedProfile,
  onSendMessage,
  onKeepSwiping,
}: MatchModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ["#E07A5F", "#F2CC8F", "#81B29A", "#3D405B"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ["#E07A5F", "#F2CC8F", "#81B29A", "#3D405B"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [isOpen]);

  if (!matchedProfile) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm bg-background rounded-3xl overflow-hidden shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>

            {/* Header */}
            <div className="relative gradient-warm py-8 px-6 text-center">
              {/* Hearts Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex justify-center gap-2 mb-4"
              >
                <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
                <Heart className="w-10 h-10 text-primary-foreground fill-primary-foreground" />
                <Heart className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-serif text-3xl font-bold text-primary-foreground"
              >
                It's a Match!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-primary-foreground/80 mt-2"
              >
                You and {matchedProfile.name} liked each other
              </motion.p>
            </div>

            {/* Profile Preview */}
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/50"
              >
                <img
                  src={matchedProfile.image}
                  alt={matchedProfile.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {matchedProfile.name}, {matchedProfile.age}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {matchedProfile.neighborhood} • ${matchedProfile.budget}/mo
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {matchedProfile.compatibility}% compatible
                  </p>
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 mt-6"
              >
                <Button
                  variant="outline"
                  onClick={onKeepSwiping}
                  className="flex-1"
                >
                  Keep Swiping
                </Button>
                <Button variant="hero" onClick={onSendMessage} className="flex-1">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Say Hi!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;
