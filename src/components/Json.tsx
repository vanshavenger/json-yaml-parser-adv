import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EditorTab from '@/components/EditorTab'
import DiffTab from '@/components/DiffTab'
import MergeTab from '@/components/MergeTab'

export default function JsonTools() {
  const [input, setInput] = useState('')

  useEffect(() => {
    const savedInput = localStorage.getItem('jsonToolsInput')
    if (savedInput) {
      setInput(savedInput)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('jsonToolsInput', input)
  }, [input])

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">JSON Tools</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Powerful JSON, YAML, and XML manipulation at your fingertips. Parse, convert, minify,
            and merge with ease. Our intuitive interface supports file uploads, undo/redo, and
            instant validation for seamless data handling.
          </p>
        </div>
        <Tabs defaultValue="editor" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="diff">Diff Tool</TabsTrigger>
            <TabsTrigger value="merge">Merge Tool</TabsTrigger>
          </TabsList>

          <TabsContent value="editor">
            <EditorTab input={input} setInput={setInput} />
          </TabsContent>

          <TabsContent value="diff">
            <DiffTab />
          </TabsContent>

          <TabsContent value="merge">
            <MergeTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
