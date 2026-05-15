import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, Palette, Minus, Plus, CaseSensitive,
  Sparkles, Play, Paintbrush, ChevronDown, Maximize,
  List, ListOrdered, Check, X
} from 'lucide-react';

interface EditableTextProps {
  initialValue: string;
  onSave: (value: string) => void;
  isAdmin?: boolean;
  className?: string;
  multiline?: boolean;
  style?: any;
}

export function EditableText({ 
  initialValue, 
  onSave, 
  isAdmin, 
  className = '', 
  multiline = false,
  style
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: multiline ? { levels: [1, 2, 3, 4] } : false,
      }),
      Underline,
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialValue,
    editable: isAdmin && isEditing,
    editorProps: {
      attributes: {
        class: `outline-none transition-all duration-300 min-h-[1em] min-w-[1ch] ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor && !isEditing) {
      editor.commands.setContent(initialValue);
    }
  }, [initialValue, editor, isEditing]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditing);
    }
  }, [isEditing, editor]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node) && isEditing) {
        handleSave();
      }
    };
    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, editor, initialValue]);

  if (!isAdmin) {
    return <motion.div className={className} style={style} dangerouslySetInnerHTML={{ __html: initialValue }} />;
  }

  const handleSave = () => {
    if (editor) {
      const newValue = editor.getHTML();
      if (newValue !== initialValue) {
        onSave(newValue);
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    editor?.commands.setContent(initialValue);
    setIsEditing(false);
  };

  if (!editor) return null;

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    danger = false
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : danger
            ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
            : 'text-zinc-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div 
      ref={containerRef}
      className={`relative group/editable ${isEditing ? 'z-[100]' : ''} ${className}`}
      style={style}
      onClick={(e) => {
        if (!isEditing) {
          e.stopPropagation();
          setIsEditing(true);
          setTimeout(() => editor.chain().focus().run(), 10);
        }
      }}
    >
      <AnimatePresence>
        {editor && isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-4 z-[101] flex flex-wrap items-center gap-1 p-2 bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[300px] max-w-[90vw] md:max-w-2xl"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <MenuButton 
                onClick={() => {
                  const current = editor.getAttributes('textStyle').fontFamily;
                  editor.chain().focus().setFontFamily(current === 'Montserrat' ? 'Inter' : 'Montserrat').run();
                }} 
                isActive={editor.getAttributes('textStyle').fontFamily === 'Montserrat'}
                title="Montserrat Font"
              >
                <div className="text-[10px] font-black px-1">M</div>
              </MenuButton>
              <div className="w-px h-3 bg-white/10" />
              <MenuButton 
                onClick={() => {
                  const s = parseInt(editor.getAttributes('textStyle').fontSize || '16px');
                  editor.chain().focus().setMark('textStyle', { fontSize: `${Math.max(8, s - 2)}px` }).run();
                }} 
                title="Decrease Size"
              >
                <Minus size={12} />
              </MenuButton>
              <span className="text-[9px] font-bold text-zinc-500 w-5 text-center">{parseInt(editor.getAttributes('textStyle').fontSize || '16px')}</span>
              <MenuButton 
                onClick={() => {
                  const s = parseInt(editor.getAttributes('textStyle').fontSize || '16px');
                  editor.chain().focus().setMark('textStyle', { fontSize: `${s + 2}px` }).run();
                }} 
                title="Increase Size"
              >
                <Plus size={12} />
              </MenuButton>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
              <Bold size={12} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
              <Italic size={12} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
              <UnderlineIcon size={12} />
            </MenuButton>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
              <AlignLeft size={12} />
            </MenuButton>
            <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
              <AlignCenter size={12} />
            </MenuButton>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <MenuButton 
              onClick={() => {
                const current = editor.getAttributes('textStyle').textTransform;
                editor.chain().focus().setMark('textStyle', { textTransform: current === 'uppercase' ? 'none' : 'uppercase' }).run();
              }} 
              isActive={editor.getAttributes('textStyle').textTransform === 'uppercase'}
              title="Uppercase"
            >
              <CaseSensitive size={12} />
            </MenuButton>

            <MenuButton 
              onClick={() => {
                const colors = ['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                const current = editor.getAttributes('textStyle').color || '#ffffff';
                const next = colors[(colors.indexOf(current) + 1) % colors.length];
                editor.chain().focus().setColor(next).run();
              }} 
              title="Text Color"
            >
              <div className="flex flex-col items-center gap-[1px]">
                <Palette size={12} />
                <div className="w-full h-0.5 rounded-full" style={{ backgroundColor: editor.getAttributes('textStyle').color || '#ffffff' }} />
              </div>
            </MenuButton>

            <div className="w-px h-4 bg-white/10 mx-1" />

            <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Clear Formatting">
              <Paintbrush size={12} />
            </MenuButton>

            <div className="ml-auto flex items-center gap-1 pl-2 border-l border-white/10">
              <MenuButton onClick={handleSave} title="Save" isActive>
                <Check size={12} />
              </MenuButton>
              <MenuButton onClick={handleCancel} title="Cancel" danger>
                <X size={12} />
              </MenuButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div 
        className={`${isEditing ? 'ring-2 ring-blue-600/50 rounded-lg p-2 bg-blue-600/5 duration-300' : ''}`}
      >
        <EditorContent editor={editor} />
      </div>
      
      {!isEditing && (
        <div className="absolute -top-3 -right-3 opacity-0 group-hover/editable:opacity-100 transition-all bg-blue-600 text-white p-1 rounded-full shadow-xl translate-y-1 group-hover/editable:translate-y-0 cursor-pointer">
          <Type size={10} />
        </div>
      )}
    </div>
  );
}
