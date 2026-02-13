"use client";

import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link"; // Yeni paket
import {
  ImageIcon,
  Bold,
  Italic,
  List,
  Heading2,
  Heading3,
  Type,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";

interface TiptapEditorProps {
  initialContent: string;
  onUpdate: (contentHtml: string) => void;
  showImageOption?: boolean;
}

const TiptapToolbar = ({
  editor,
  showImageOption,
}: {
  editor: Editor | null;
  showImageOption?: boolean;
}) => {
  if (!editor) return null;

  const ToolbarButtonClass =
    "p-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center border border-transparent";
  const ActiveClass = "bg-neutral-200 text-black scale-95";
  const InactiveClass =
    "text-neutral-500 hover:bg-neutral-900 hover:text-white";

  // Link Ekleme Fonksiyonu
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL_ENDPOINT_ADDR:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files?.length) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
          const content = readerEvent.target?.result as string;
          editor.chain().focus().setImage({ src: content }).run();
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-3 bg-neutral-950 border border-neutral-800 border-b-0 rounded-t-[2rem]">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().setParagraph().run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("paragraph") ? ActiveClass : InactiveClass}`}
      >
        <Type size={16} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 2 }).run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("heading", { level: 2 }) ? ActiveClass : InactiveClass}`}
      >
        <Heading2 size={16} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleHeading({ level: 3 }).run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("heading", { level: 3 }) ? ActiveClass : InactiveClass}`}
      >
        <Heading3 size={16} />
      </button>

      <div className="w-px h-5 bg-neutral-800 mx-1" />

      {/* Link Butonları */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setLink();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("link") ? ActiveClass : InactiveClass}`}
      >
        <LinkIcon size={16} />
      </button>

      {editor.isActive("link") && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            editor.chain().focus().unsetLink().run();
          }}
          className={`${ToolbarButtonClass} text-red-500 hover:bg-red-500/10`}
        >
          <Unlink size={16} />
        </button>
      )}

      <div className="w-px h-5 bg-neutral-800 mx-1" />

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBold().run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("bold") ? ActiveClass : InactiveClass}`}
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleItalic().run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("italic") ? ActiveClass : InactiveClass}`}
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          editor.chain().focus().toggleBulletList().run();
        }}
        className={`${ToolbarButtonClass} ${editor.isActive("bulletList") ? ActiveClass : InactiveClass}`}
      >
        <List size={16} />
      </button>
      {showImageOption && (
        <>
          <div className="w-px h-5 bg-neutral-800 mx-1" />
          <button
            type="button"
            onClick={addImage}
            className={`${ToolbarButtonClass} ${InactiveClass} hover:text-cyan-500`}
          >
            <ImageIcon size={16} />
          </button>
        </>
      )}
    </div>
  );
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({
  initialContent,
  onUpdate,
  showImageOption = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        allowBase64: true,
        HTMLAttributes: {
          class:
            "rounded-[2rem] border border-neutral-800 my-8 w-full max-h-[600px] object-cover",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class:
            "text-cyan-500 underline underline-offset-4 cursor-pointer hover:text-cyan-400 transition-all",
        },
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none p-8 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none bg-neutral-900/20 border border-neutral-800 rounded-b-[2rem] text-neutral-300 leading-[1.8] selection:bg-cyan-500/20",
      },
    },
    injectCSS: true,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      const style = document.createElement("style");
      style.innerHTML = `
        .ProseMirror h2 { font-size: 32px !important; font-weight: 900 !important; color: white !important; margin-top: 1.5em !important; margin-bottom: 0.5em !important; }
        .ProseMirror h3 { font-size: 24px !important; font-weight: 700 !important; color: #e5e5e5 !important; margin-top: 1.2em !important; margin-bottom: 0.4em !important; }
        .ProseMirror p { font-size: 16px !important; line-height: 1.8 !important; margin-bottom: 1em !important; }
        .ProseMirror a { color: #06b6d4 !important; text-decoration: underline !important; text-underline-offset: 4px !important; transition: color 0.2s; }
        .ProseMirror a:hover { color: #22d3ee !important; }
      `;
      document.head.appendChild(style);
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [editor]);

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent, false);
    }
  }, [initialContent, editor]);

  return (
    <div className="w-full">
      <TiptapToolbar editor={editor} showImageOption={showImageOption} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
