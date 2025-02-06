import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  LinkIcon,
  UnderlineIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState("");

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
      setLinkUrl("");
    }
  };

  return (
    <div className='flex flex-wrap gap-2 p-2 bg-gray-100 border-b'>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive("bold") ? "bg-gray-300" : "bg-white"
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive("italic") ? "bg-gray-300" : "bg-white"
        }`}
      >
        <Italic size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${
          editor.isActive("underline") ? "bg-gray-300" : "bg-white"
        }`}
      >
        <UnderlineIcon size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        <AlignLeft size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        <AlignCenter size={18} />
      </button>
      <button
        type='button'
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`p-2 rounded ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-300" : "bg-white"
        }`}
      >
        <AlignRight size={18} />
      </button>

      <div className='flex items-center'>
        <Input
          type='text'
          placeholder='Link daxil edin'
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className='p-1 border rounded mr-1'
        />
        <Button
          type='button'
          onClick={addLink}
          className={`${
            editor.isActive("link") ? "bg-blue-400" : "bg-blue-200"
          }`}
        >
          <LinkIcon className='text-blue-500' size={16} />
        </Button>
      </div>
    </div>
  );
};

export default function RichTextEditor({
  initialValue,
  onChange,
}: {
  initialValue: string;
  onChange: (newValue: string) => void;
}) {
  const editor = useEditor({
    content: initialValue,
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return (
    <div className='w-full max-w-4xl mx-auto border rounded shadow-lg'>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className='p-4 min-h-[100px]' />
    </div>
  );
}
