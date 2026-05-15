import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Undo, Redo,
  Type, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Baseline, Palette, Strikethrough, CaseSensitive,
  MoreHorizontal, Grid, Sparkles, Play, Move, 
  Paintbrush, Plus, Minus, Maximize, ChevronDown
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  const [paintAttributes, setPaintAttributes] = useState<any>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      Color,
      Highlight.configure({ multicolor: true }),
      Subscript,
      Superscript,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[250px] p-8 text-white text-lg',
      },
    },
  });

  const fonts = [
    { name: 'Default', value: 'Inter' },
    { name: 'Montserrat', value: 'Montserrat' },
    { name: 'Technical', value: 'Space Grotesk' },
    { name: 'Editorial', value: 'Playfair Display' },
    { name: 'Mono', value: 'JetBrains Mono' },
  ];

  const sizes = [
    { name: '8px', value: '8px' },
    { name: '10px', value: '10px' },
    { name: '12px', value: '12px' },
    { name: '14px', value: '14px' },
    { name: '16px', value: '16px' },
    { name: '18px', value: '18px' },
    { name: '20px', value: '20px' },
    { name: '24px', value: '24px' },
    { name: '32px', value: '32px' },
    { name: '48px', value: '48px' },
    { name: '64px', value: '64px' },
  ];

  // Sync content if value changes externally
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const MenuButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title,
    disabled = false
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent'
      }`}
    >
      {children}
    </button>
  );

  const applyFormatPainter = () => {
    if (!paintAttributes) {
      // Pick up attributes
      const attrs = editor.getAttributes('textStyle');
      const marks = editor.state.selection.$from.marks();
      setPaintAttributes({ attrs, marks });
    } else {
      // Apply attributes
      editor.chain().focus().setMark('textStyle', paintAttributes.attrs).run();
      paintAttributes.marks.forEach((mark: any) => {
        editor.chain().focus().setMark(mark.type.name, mark.attrs).run();
      });
      setPaintAttributes(null);
    }
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mx-4 italic">
          {label}
        </label>
      )}
      <div className="border border-white/10 rounded-[2rem] overflow-hidden bg-black focus-within:border-blue-500/30 transition-all duration-500 shadow-2xl">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md">
          {/* Font Family */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 rounded-lg border border-white/5">
            <Type size={12} className="text-zinc-500" />
            <select 
              className="bg-transparent text-white text-[10px] font-bold uppercase tracking-widest focus:outline-none cursor-pointer"
              onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
              value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
            >
              {fonts.map(font => (
                <option key={font.value} value={font.value} className="bg-zinc-900">{font.name}</option>
              ))}
            </select>
          </div>

          {/* Font Size Plus/Minus */}
          <div className="flex items-center gap-1 ml-2">
            <MenuButton
              onClick={() => {
                const current = editor.getAttributes('textStyle').fontSize || '16px';
                const currentSize = parseInt(current);
                editor.chain().focus().setMark('textStyle', { fontSize: `${currentSize - 2}px` }).run();
              }}
              title="Minus Size"
            >
              <Minus size={14} />
            </MenuButton>
            <span className="text-[10px] font-bold text-zinc-400 w-8 text-center">
              {parseInt(editor.getAttributes('textStyle').fontSize || '16px')}px
            </span>
            <MenuButton
              onClick={() => {
                const current = editor.getAttributes('textStyle').fontSize || '16px';
                const currentSize = parseInt(current);
                editor.chain().focus().setMark('textStyle', { fontSize: `${currentSize + 2}px` }).run();
              }}
              title="Plus Size"
            >
              <Plus size={14} />
            </MenuButton>
          </div>

          <div className="w-px h-4 bg-white/10 mx-2" />

          {/* Color */}
          <div className="relative group">
            <MenuButton
              onClick={() => {}}
              title="Text Color"
            >
              <div className="flex flex-col items-center gap-0.5">
                <Palette size={14} />
                <div 
                  className="w-full h-0.5 bg-white rounded-full" 
                  style={{ backgroundColor: editor.getAttributes('textStyle').color }} 
                />
              </div>
            </MenuButton>
            <div className="absolute top-full left-0 mt-2 p-2 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-50 hidden group-hover:block grid grid-cols-5 gap-1">
               {['#ffffff', '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b', '#27272a', '#000000'].map(color => (
                 <button
                   key={color}
                   className="w-4 h-4 rounded-full border border-white/10"
                   style={{ backgroundColor: color }}
                   onClick={() => editor.chain().focus().setColor(color).run()}
                 />
               ))}
            </div>
          </div>

          <div className="w-px h-4 bg-white/10 mx-2" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough size={14} />
          </MenuButton>

          <div className="w-px h-4 bg-white/10 mx-2" />

          {/* Text Case */}
          <MenuButton
            onClick={() => {
              const current = editor.getAttributes('textStyle').textTransform;
              const next = current === 'uppercase' ? 'none' : 'uppercase';
              editor.chain().focus().setMark('textStyle', { textTransform: next }).run();
            }}
            isActive={editor.getAttributes('textStyle').textTransform === 'uppercase'}
            title="Text Case (Upper/Normal)"
          >
            <CaseSensitive size={14} />
          </MenuButton>

          {/* Alignment */}
          <div className="flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              isActive={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              isActive={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              isActive={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              isActive={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <AlignJustify size={14} />
            </MenuButton>
          </div>

          <div className="w-px h-4 bg-white/10 mx-2" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={14} />
          </MenuButton>
          
          {/* Spacing (Letter Spacing) */}
          <MenuButton
            onClick={() => {
              const current = editor.getAttributes('textStyle').letterSpacing;
              const next = current === '0.1em' ? '0' : '0.1em';
              editor.chain().focus().setMark('textStyle', { letterSpacing: next }).run();
            }}
            isActive={editor.getAttributes('textStyle').letterSpacing === '0.1em'}
            title="Letter Spacing"
          >
             <MoreHorizontal size={14} />
          </MenuButton>

          {/* Grid (Table) */}
          <MenuButton
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Grid (Table)"
          >
            <Grid size={14} />
          </MenuButton>

          <div className="w-px h-4 bg-white/10 mx-2" />

          {/* Effects/Animate/Position placeholders */}
          <MenuButton onClick={() => {}} title="Effects">
            <Sparkles size={14} />
          </MenuButton>
          <MenuButton onClick={() => {}} title="Animate">
            <Play size={14} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleSubscript().run()} isActive={editor.isActive('subscript')} title="Subscript Position">
            <ChevronDown size={14} />
          </MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleSuperscript().run()} isActive={editor.isActive('superscript')} title="Superscript Position">
            <Maximize size={10} className="rotate-45" />
          </MenuButton>

          <div className="w-px h-4 bg-white/10 mx-2" />

          {/* Format Painter */}
          <MenuButton
            onClick={applyFormatPainter}
            isActive={!!paintAttributes}
            title="Format Painter"
          >
            <Paintbrush size={14} />
          </MenuButton>

          <div className="ml-auto flex items-center gap-1">
            <MenuButton
              onClick={() => editor.chain().focus().undo().run()}
              title="Undo"
            >
              <Undo size={14} />
            </MenuButton>
            <MenuButton
              onClick={() => editor.chain().focus().redo().run()}
              title="Redo"
            >
              <Redo size={14} />
            </MenuButton>
          </div>
        </div>

        {/* Editor Area */}
        <div className="relative">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
