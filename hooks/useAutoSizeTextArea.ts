import { useEffect } from "react";

const useAutosizeTextArea = (
  textAreaRef: HTMLTextAreaElement | null,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef) {
      textAreaRef.style.height = "0px";
      const scrollHeight = textAreaRef.scrollHeight;
      if (scrollHeight <= 300) {
        textAreaRef.style.height = scrollHeight + "px";
      }
      else {
        textAreaRef.style.height = "300px";
      }
    }
  }, [textAreaRef, value]);
};

export default useAutosizeTextArea;