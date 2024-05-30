'use client'

import React , { useState , ChangeEvent} from 'react';
import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextStyle from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { useTheme } from "next-themes";

import Text from '@tiptap/extension-text'
import Underline from '@tiptap/extension-underline'
import Code from '@tiptap/extension-code'



const Tiptap = () => {
  const { resolvedTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const editor  = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Typography,
      Underline,
      Highlight.configure({ multicolor: true }),
      Text.configure({ key: 'customText' }), // Ensure 'text' extension has a unique key like 'customText'
      TaskList.configure({
        HTMLAttributes: {
          class: "not-prose pl-2",
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: "flex items-start my-4",
        },
        nested: true,
      }),
    ],
    content: '<p>welcome to your World! 🌎️</p>',
    
  });

  if (!editor) return null;

  // to display colors
  const colors = [
    { selectedColor: '#b197fc', name: 'purple' },
    { selectedColor: '#ffc078', name: 'orange' },
    { selectedColor: '#8ce99a', name: 'green' },
    { selectedColor: '#74c0fc', name: 'blue' },
    { selectedColor: '#ffa8a8', name: 'rose' },
    { selectedColor: '#ff0000', name: 'red' }, // Update the color value to a valid hexadecimal color code
  ];

  return (
    <div className=' space-x-8 '>

      <div className='m-4 space-x-4 flex '>
        <span>color</span>
       <input
        type="color"
        onInput={handleInputChange}
        value={inputValue}
        className={"border-background rounded-md "}
        />
        <div className="text-forground">
          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
          >
            unsetColor
          </button>
        </div>
      </div>

      <div>

        {editor && (
          <BubbleMenu 
           className="bubble-menu "
            editor={editor}>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`tooltip-button border-none text-white text-sm font-medium px-1 ${editor.isActive('bold') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
                <span className="font-bold">
                B
              </span>
              <span className="tooltip-text text-sm">Bold - Ctrl+B</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`tooltip-button border-none bg-none text-white text-sm font-medium px-1 ${editor.isActive('italic') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <span className={"font-noraml italic"}>
                I 
              </span>
              <span className="tooltip-text">Italic - Ctrl+I</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`tooltip-button border-none bg-none text-white text-sm font-medium px-1 ${editor.isActive('underline') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <span className=" font-normal underline">
                U
              </span>
              <span className="tooltip-text text-sm">Undderline - Ctrl+U</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`tooltip-button border-none bg-none text-white text-sm font-medium px-1 ${editor.isActive('strike') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <span className="font-normal line-through">
                Str
              </span>
              <span className="tooltip-text">Strike through - Ctrl+shift+S</span>
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`tooltip-button border-none bg-none text-white text-sm font-medium px-1
               ${editor.isActive('strike') ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
            >
              <span className="font-normal">
                'code'
              </span>
              <span className="tooltip-text">Mark as code - Ctrl+E</span>
            </button>

            <div className="tooltip-button border-none bg-none text-white text-sm font-medium px-1">

              <span >Color</span>

              <div className="tooltip-text ">
                Choose color
                <div className="color-list mt-1">

                  {colors.map(({ selectedColor, name }) => (
                    <button
                      key={selectedColor}
                      onClick={() => editor.chain().focus().setColor( selectedColor ).run()}
                      className={`tooltip-button w-6 h-6 rounded-full border-none bg-none text-white text-sm font-medium 
                       ${editor.isActive('textStyle opacity-100',{ color: selectedColor}) ? 'border-2 border-white is-active opacity-60 hover:opacity-100 ' : ''}`}
                      data-testid={selectedColor}
                      style={{ backgroundColor: selectedColor }}
                      title={name}
                    >

                      <div className='ml-7 flex'>
                        {name}
                      </div>

                    </button>
                  ))}

                    <button
                    onClick={() => editor.chain().focus().unsetColor().run()}
                    data-testid="unsetColor"
                    className={`h-8 w-12 rounded-sm justify-center content-center`}
                  >
                    Defualt
                  </button>

                </div>

              </div>

            </div>

            <div className="tooltip-button border-none bg-none text-muted-forground text-sm font-medium">

              <span>Highlight</span>

              <div className="tooltip-text ">
               Background - Ctrl+Shift+H 

                <div className="color-list mt-1">

                  {colors.map(({ selectedColor, name }) => (
                    <button
                      key={selectedColor}
                      onClick={() => editor.chain().focus().toggleHighlight({ color: selectedColor }).run()}
                      className={`tooltip-button w-6 h-6 rounded-full border-none bg-none text-white text-sm font-medium
                      ${editor.isActive('highlight', { color: selectedColor}) ? 'border-2 border-white' : ''}`}
                      style={{ backgroundColor: selectedColor }}
                      title={name}
                    >
                      <div className='ml-7 flex'>
                        {name}
                      </div>
                    </button>
                  ))}

                    <button
                    onClick={() => editor.chain().focus().unsetHighlight().run()}
                    disabled={!editor.isActive('highlight')}
                    className={`h-8 w-12 rounded-sm justify-center content-center`}
                  >
                    none
                  </button>

                </div>

              </div>
              
            </div>
          </BubbleMenu>
        )}

        <EditorContent 
          editor={editor}
          className="tiptap"
        />

      </div>
    </div>
  );
}

export default Tiptap;
