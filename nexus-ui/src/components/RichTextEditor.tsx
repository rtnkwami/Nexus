import React from 'react';

interface RichTextEditorProps {
  description: string;
  onDescriptionChange: (html: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ description, onDescriptionChange }) => {
  const formatText = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold mb-4">Product Description</h2>

      <div className="border-b border-gray-200 pb-4 mb-4">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => formatText('bold')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            onClick={() => formatText('italic')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            onClick={() => formatText('underline')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            title="Underline"
          >
            <u>U</u>
          </button>
          <button
            onClick={() => formatText('fontSize', '3')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            title="Large Text"
          >
            A+
          </button>
          <button
            onClick={() => formatText('fontSize', '2')}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
            title="Small Text"
          >
            A-
          </button>
        </div>
      </div>

      <div
        id="description-editor"
        contentEditable
        className="min-h-[200px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        dangerouslySetInnerHTML={{ __html: description }}
        onBlur={(e) => onDescriptionChange((e.target as HTMLElement).innerHTML)}
      />
    </div>
  );
};

export default RichTextEditor;