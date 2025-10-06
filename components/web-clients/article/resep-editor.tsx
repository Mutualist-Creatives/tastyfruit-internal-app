"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// A simple toolbar for the editor
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  // Helper function for button styling
  const getButtonClass = (name: string, attributes?: object) => {
    return editor.isActive(name, attributes)
      ? "bg-blue-500 text-white p-2 rounded"
      : "bg-gray-200 p-2 rounded";
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-t-lg bg-gray-50">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass("heading", { level: 2 })}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={getButtonClass("bold")}
      >
        Bold
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass("bulletList")}
      >
        Bullet List
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass("orderedList")}
      >
        Ordered List
      </button>
    </div>
  );
};

// The main editor component
export const ResepEditor = ({
  content,
  onUpdate,
}: {
  content: string;
  onUpdate: (html: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        // Apply Tailwind's prose class for nice typography styling inside the editor
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none p-4",
      },
    },
  });

  return (
    <div className="border rounded-lg">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};
