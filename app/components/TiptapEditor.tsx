"use client";

import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
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
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [linkUrl, setLinkUrl] = React.useState("");

  const openLinkModal = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href || "";
    setLinkUrl(previousUrl);
    setIsLinkModalOpen(true);
  }, [editor]);

  const saveLink = useCallback(() => {
    if (!editor) return;

    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl })
        .run();
    }
    setIsLinkModalOpen(false);
  }, [editor, linkUrl]);

  // Early return is only allowed AFTER all hooks (like useCallback)
  if (!editor) return null;

  const ToolbarButtonClass =
    "p-2.5 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center border border-transparent";
  const ActiveClass = "bg-neutral-200 text-black scale-95";
  const InactiveClass =
    "text-neutral-500 hover:bg-neutral-900 hover:text-white";

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
    <div className="flex flex-wrap items-center gap-1.5 p-3 bg-neutral-950 border border-neutral-800 border-b-0 rounded-t-4xl">
      {/* Paragraph and Headings */}
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

      {/* Link Management */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          openLinkModal();
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

      {/* Basic Formatting */}
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

      {/* Optional Image Support */}
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

      {/* --- CUSTOM LINK MODAL --- */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsLinkModalOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-xs p-6 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] animate-in zoom-in-95 duration-300">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-500">
                  <LinkIcon size={18} />
                </div>
                <h4 className="text-[11px] tracking-[0.3em] text-white font-black">
                  Inject Link
                </h4>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] tracking-widest text-neutral-500 ml-2 font-bold">
                  Target URL Address
                </label>
                <input
                  autoFocus
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-12 px-4 bg-black border border-neutral-800 rounded-2xl text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      saveLink();
                    }
                    if (e.key === "Escape") setIsLinkModalOpen(false);
                  }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={saveLink}
                  className="flex-1 h-11 bg-white text-black text-[11px] font-black tracking-widest rounded-xl hover:bg-cyan-400 active:scale-95 transition-all"
                >
                  Apply Protocol
                </button>
                <button
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 h-11 bg-neutral-800 text-neutral-400 text-[11px] font-black rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TiptapEditor = ({
  initialContent,
  onUpdate,
  showImageOption = false,
}: TiptapEditorProps) => {
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

  // Inject custom ProseMirror styles dynamically
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

  // Sync external content changes with the editor
  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
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
