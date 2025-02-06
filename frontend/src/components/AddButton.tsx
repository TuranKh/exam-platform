import { BadgePlus } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Button } from "./ui/button";

export default function AddButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <Button
      {...props}
      className={`${props.className} absolute top-4 right-4 bg-primary p-2 rounded-md`}
    >
      Əlavə et
      <BadgePlus color='white' />
    </Button>
  );
}
