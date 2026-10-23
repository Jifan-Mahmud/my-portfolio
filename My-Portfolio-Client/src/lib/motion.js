export const fadeIn = (direction = "up", delay = 0) => ({
  hidden: {
    y: direction === "up" ? 24 : direction === "down" ? -24 : 0,
    x: direction === "left" ? 24 : direction === "right" ? -24 : 0,
    opacity: 0,
  },
  show: {
    y: 0,
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      duration: 0.8,
      delay,
      ease: [0.25, 0.25, 0.25, 0.75],
    },
  },
});

export const staggerContainer = (staggerChildren = 0.15, delayChildren = 0) => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const cardHover = {
  rest: { y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  hover: { y: -6, transition: { duration: 0.25, ease: "easeOut" } },
};
