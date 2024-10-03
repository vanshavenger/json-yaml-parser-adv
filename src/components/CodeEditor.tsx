import { Editor } from '@monaco-editor/react'

type CodeEditorProps = {
  value: string
  onChange: (value: string | undefined) => void
  language: string
  readOnly?: boolean
  'aria-label': string
}

export default function CodeEditor({
  value,
  onChange,
  language,
  readOnly = false,
  'aria-label': ariaLabel,
}: CodeEditorProps) {
  return (
    <div className="h-[200px] overflow-hidden">
      <Editor
        height="100%"
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: readOnly,
        }}
        aria-label={ariaLabel}
      />
    </div>
  )
}
