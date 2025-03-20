import { type ComponentProps, useEffect, useRef } from "react";
import { Textarea } from "@/ui/textarea";

export function AutoGrowTextarea(props: ComponentProps<typeof Textarea>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = ref.current;
    if (textarea) {
      // Reset height to auto to shrink if needed, then adjust to scroll height
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight + 2}px`;
    }
  }, [props.value]); // Re-run the effect whenever value changes

  return <Textarea ref={ref} {...props} />;
}
