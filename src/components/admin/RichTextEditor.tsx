import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  List, ListOrdered, Quote, Undo, Redo,
  Type, AlignLeft, AlignCenter, AlignRight,
  Baseline
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export function RichTextEditor({ value, onChange, placeholder, label }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      FontFamily,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
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
    { name: 'Technical', value: 'Space Grotesk' },
    { name: 'Editorial', value: 'Playfair Display' },
    { name: 'Mono', value: 'JetBrains Mono' },
  ];

  const sizes = [
    { name: 'Micro', value: '12px' },
    { name: 'Small', value: '14px' },
    { name: 'Normal', value: '16px' },
    { name: 'Large', value: '20px' },
    { name: 'Huge', value: '32px' },
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
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-zinc-500 hover:bg-white/5 hover:text-white'
      }`}
    >
      {children}
    </button>
  );

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
          {/* Font Family Dropdown */}
          <select 
            className="bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
            value={editor.getAttributes('textStyle').fontFamily || 'Inter'}
          >
            {fonts.map(font => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>

          {/* Size Dropdown */}
          <select 
            className="bg-zinc-800 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border border-white/5 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'p') editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: parseInt(val) as any }).run();
            }}
            value={editor.isActive('heading', { level: 2 }) ? '2' : editor.isActive('heading', { level: 3 }) ? '3' : editor.isActive('heading', { level: 4 }) ? '4' : 'p'}
          >
            <option value="p">Normal Size</option>
            <option value="2">Title Size</option>
            <option value="3">Large Size</option>
            <option value="4">Small Size</option>
          </select>

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
          
          <div className="w-px h-4 bg-white/10 mx-2" />

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

          <div className="w-px h-4 bg-white/10 mx-2" />

          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Ordered List"
          >
            <ListOrdered size={14} />
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
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
