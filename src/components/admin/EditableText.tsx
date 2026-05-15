import React, { useState, useEffect } from 'react';
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
  AlignLeft, AlignCenter, AlignRight,
  Type, Palette, Minus, Plus, CaseSensitive,
  Sparkles, Play, Paintbrush, ChevronDown, Maximize
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

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: multiline ? undefined : false,
      }),
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: initialValue,
    editable: isAdmin && isEditing,
    onUpdate: ({ editor }) => {
      // Don't save on every keystroke, wait for blur
    },
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

  if (!isAdmin) {
    return <motion.div className={className} style={style} dangerouslySetInnerHTML={{ __html: initialValue }} />;
  }

  const handleBlur = () => {
    setIsEditing(false);
    if (editor) {
      const newValue = editor.getHTML();
      if (newValue !== initialValue) {
        onSave(newValue);
      }
    }
  };

  if (!editor) return null;

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-zinc-400 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div 
      className={`relative group/editable ${isEditing ? 'z-50' : ''} ${className}`}
      style={style}
      onClick={(e) => {
        if (!isEditing) {
          e.stopPropagation();
          setIsEditing(true);
          setTimeout(() => editor.chain().focus().run(), 0);
        }
      }}
    >
      {editor && isEditing && (
        <div className="absolute bottom-full left-0 mb-2 z-50">
           <div className="flex flex-wrap items-center gap-0.5 p-1.5 bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl max-w-[90vw] md:max-w-none whitespace-nowrap">
              <MenuButton 
                onClick={() => {
                   const current = editor.getAttributes('textStyle').fontFamily;
                   const next = current === 'Montserrat' ? 'Inter' : 'Montserrat';
                   editor.chain().focus().setFontFamily(next).run();
                }} 
                isActive={editor.getAttributes('textStyle').fontFamily === 'Montserrat'}
                title="Montserrat Font"
              >
                <div className="text-[10px] font-bold px-0.5">M</div>
              </MenuButton>

              <div className="w-px h-3 bg-white/10 mx-1" />

              <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
                <Bold size={12} />
              </MenuButton>
              <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
                <Italic size={12} />
              </MenuButton>
              <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
                <UnderlineIcon size={12} />
              </MenuButton>
              <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
                <Strikethrough size={12} />
              </MenuButton>
              
              <div className="w-px h-3 bg-white/10 mx-1" />
              
              <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
                <AlignLeft size={12} />
              </MenuButton>
              <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
                <AlignCenter size={12} />
              </MenuButton>
              <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
                <AlignRight size={12} />
              </MenuButton>
              
              <div className="w-px h-3 bg-white/10 mx-1" />
              
              <MenuButton 
                onClick={() => {
                   const current = editor.getAttributes('textStyle').fontSize || '16px';
                   const next = Math.max(8, parseInt(current) - 2);
                   editor.chain().focus().setMark('textStyle', { fontSize: `${next}px` }).run();
                }} 
                title="Decrease Size"
              >
                <Minus size={12} />
              </MenuButton>
              <span className="text-[9px] font-bold text-zinc-500 w-6 text-center">
                {parseInt(editor.getAttributes('textStyle').fontSize || '16px')}
              </span>
              <MenuButton 
                onClick={() => {
                   const current = editor.getAttributes('textStyle').fontSize || '16px';
                   const next = parseInt(current) + 2;
                   editor.chain().focus().setMark('textStyle', { fontSize: `${next}px` }).run();
                }} 
                title="Increase Size"
              >
                <Plus size={12} />
              </MenuButton>

              <div className="w-px h-3 bg-white/10 mx-1" />

              <MenuButton 
                onClick={() => {
                  const current = editor.getAttributes('textStyle').textTransform;
                  const next = current === 'uppercase' ? 'none' : 'uppercase';
                  editor.chain().focus().setMark('textStyle', { textTransform: next }).run();
                }} 
                isActive={editor.getAttributes('textStyle').textTransform === 'uppercase'}
                title="Text Case"
              >
                <CaseSensitive size={12} />
              </MenuButton>

              <MenuButton 
                onClick={() => {
                   const color = editor.getAttributes('textStyle').color === '#3b82f6' ? '#ffffff' : '#3b82f6';
                   editor.chain().focus().setColor(color).run();
                }} 
                isActive={editor.isActive('textStyle', { color: '#3b82f6' })} 
                title="Text Color"
              >
                <Palette size={12} />
              </MenuButton>

              <div className="w-px h-3 bg-white/10 mx-1" />
              
              <MenuButton onClick={() => {}} title="Effects">
                <Sparkles size={12} />
              </MenuButton>
              <MenuButton onClick={() => {}} title="Animate">
                <Play size={12} />
              </MenuButton>
              
              <div className="w-px h-3 bg-white/10 mx-1" />

              <MenuButton onClick={() => editor.chain().focus().unsetAllMarks().run()} title="Format Painter (Clear/Reset)">
                <Paintbrush size={12} />
              </MenuButton>
           </div>
        </div>
      )}

      <div 
        onBlur={handleBlur}
        className={`${isEditing ? 'ring-2 ring-blue-600/30 rounded-lg p-2 bg-blue-600/5' : ''}`}
      >
        <EditorContent editor={editor} />
      </div>
      
      {!isEditing && (
        <div className="absolute -top-6 -right-6 opacity-0 group-hover/editable:opacity-100 transition-opacity bg-blue-600 text-white p-1 rounded shadow-lg">
          <Type size={10} />
        </div>
      )}
    </div>
  );
}
