import { BadgePlus } from "lucide-react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export default function AddButton(
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
) {
  return (
    <button
      {...props}
      className={`${props.className} absolute top-4 right-4 bg-primary p-2 rounded-md`}
    >
      <BadgePlus color='white' />
    </button>
  );
}
