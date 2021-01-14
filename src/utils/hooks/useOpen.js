import { useState } from "react";

const useOpen = (isDefaultOpen = false) => {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToggle = () => setIsOpen(!isOpen);

  return { isOpen, onOpen, onClose, onToggle };
};

export default useOpen;
