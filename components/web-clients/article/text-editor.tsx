"use client"; // This component uses client-side hooks, so it must be a client component

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// The MenuBar component now uses Tailwind classes for all styling
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // An array to hold our menu buttons for easier mapping
  const menuItems = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      disabled: !editor.can().chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      label: "Bold",
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      disabled: !editor.can().chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      label: "Italic",
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive("heading", { level: 2 }),
      label: "H2",
    },
    {
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: editor.isActive("paragraph"),
      label: "Paragraph",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 border border-gray-300 rounded-t-lg border-b-0">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.preventDefault();
            item.action();
          }}
          disabled={item.disabled}
          className={`
            px-3 py-1 text-sm font-semibold rounded 
            transition-colors duration-200
            ${
              item.isActive
                ? "bg-[#003BE2] text-white" // Active state styles
                : "bg-transparent text-gray-800 hover:bg-gray-200" // Inactive state styles
            }
            ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

// The main editor component, now renamed to TextEditor
export const TextEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (richText: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editorProps: {
      attributes: {
        // These are the classes that style the actual text input area
        class:
          "prose lg:prose-lg max-w-none p-4 min-h-[250px] w-full border border-gray-300 rounded-b-lg focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
