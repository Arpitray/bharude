import React, { useState } from 'react';
import FallingText from './FallingText';

export default function Skills({ editable = false, initialText, initialHighlights }) {
  const [text, setText] = useState(initialText || 'React JavaScript TypeScript Three.js WebGL GSAP Tailwind CSS');
  const [highlightWords, setHighlightWords] = useState(initialHighlights || ['React', 'Three.js', 'Tailwind']);

  return (
    <section id="skills" className="w-full max-w-5xl mx-auto my-0 px-6 min-h-screen pt-20 pb-32">
      <div className="w-full">
        <h2 className="text-4xl font-semibold mb-8 text-center">Skills</h2>

        <div className="bg-transparent rounded-lg p-6 flex items-center justify-center min-h-[500px]">
          {/* Only show the falling text container; controls hidden unless editable is true */}
          <div className="w-full h-full">
            <FallingText
              text={text}
              highlightWords={highlightWords}
              trigger="auto"
              backgroundColor="transparent"
              wireframes={false}
              gravity={0.8}
              mouseConstraintStiffness={0.2}
              fontSize="2rem"
            />

            {editable && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Editable skills text</label>
                  <textarea
                    className="w-full p-2 rounded border border-gray-300 bg-white/5"
                    rows={3}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Highlight words (comma separated)</label>
                  <input
                    className="w-full p-2 rounded border border-gray-300 bg-white/5"
                    value={highlightWords.join(',')}
                    onChange={(e) => setHighlightWords(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
