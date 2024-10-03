import React, { useState } from 'react'
import { toast } from 'react-toastify'
import confetti from 'canvas-confetti'
import yaml from 'js-yaml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Code,
  FileJson,
  FileCode,
  Check,
  Copy,
  Download,
  Upload,
  RotateCcw,
  RotateCw,
  FileX,
  Key,
} from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'

type EditorLanguage = 'json' | 'yaml' | 'xml'

type EditorTabProps = {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
}

export default function EditorTab({ input, setInput }: EditorTabProps) {
  const [output, setOutput] = useState('')
  const [inputLanguage, setInputLanguage] = useState<EditorLanguage>('json')
  const [outputLanguage, setOutputLanguage] = useState<EditorLanguage>('json')
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const handleInputChange = (value: string | undefined) => {
    if (value !== undefined && value !== input) {
      setUndoStack([...undoStack, input])
      setRedoStack([])
      setInput(sanitizeInput(value))
    }
  }

  const sanitizeInput = (value: string): string => {
    return value
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+="[^"]*"/g, '')
      .replace(/javascript:/gi, '')
  }

  const parseJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed, null, 2))
      setOutputLanguage('json')
      toast.success('JSON parsed successfully!')
    } catch (err) {
      toast.error('Invalid JSON: ' + (err as Error).message)
    }
  }

  const convertYamlToJson = () => {
    try {
      const jsonObj = yaml.load(input)
      setOutput(JSON.stringify(jsonObj, null, 2))
      setOutputLanguage('json')
      toast.success('YAML converted to JSON successfully!')
    } catch (err) {
      toast.error('Error converting YAML to JSON: ' + (err as Error).message)
    }
  }

  const convertJsonToYaml = () => {
    try {
      const jsonObj = JSON.parse(input)
      const yamlStr = yaml.dump(jsonObj)
      setOutput(yamlStr)
      setOutputLanguage('yaml')
      toast.success('JSON converted to YAML successfully!')
    } catch (err) {
      toast.error('Error converting JSON to YAML: ' + (err as Error).message)
    }
  }

  const convertXmlToJson = () => {
    try {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
      })
      const result = parser.parse(input)
      setOutput(JSON.stringify(result, null, 2))
      setOutputLanguage('json')
      toast.success('XML converted to JSON successfully!')
    } catch (err) {
      toast.error('Error converting XML to JSON: ' + (err as Error).message)
    }
  }

  const convertJsonToXml = () => {
    try {
      const jsonObj = JSON.parse(input)
      const builder = new XMLBuilder({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
        textNodeName: '#text',
      })
      const xmlStr = builder.build(jsonObj)
      setOutput(xmlStr)
      setOutputLanguage('xml')
      toast.success('JSON converted to XML successfully!')
    } catch (err) {
      toast.error('Error converting JSON to XML: ' + (err as Error).message)
    }
  }

  const encodeBase64 = () => {
    try {
      const encoded = btoa(input)
      setOutput(encoded)
      setOutputLanguage('json')
      toast.success('JSON encoded to Base64 successfully!')
    } catch (err) {
      toast.error('Error encoding to Base64: ' + (err as Error).message)
    }
  }

  const decodeBase64 = () => {
    try {
      const decoded = atob(input)
      setOutput(decoded)
      setOutputLanguage('json')
      toast.success('Base64 decoded to JSON successfully!')
    } catch (err) {
      toast.error('Error decoding from Base64: ' + (err as Error).message)
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      setOutput(JSON.stringify(parsed))
      setOutputLanguage('json')
      toast.success('JSON minified successfully!')
    } catch (err) {
      toast.error('Error minifying JSON: ' + (err as Error).message)
    }
  }

  const validateJson = () => {
    try {
      JSON.parse(input)
      toast.success('JSON is valid!')
    } catch (err) {
      toast.error('Invalid JSON: ' + (err as Error).message)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success('Copied to clipboard!')
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
      },
      () => {
        toast.error('Failed to copy to clipboard')
      }
    )
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `output.${outputLanguage}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded successfully!')
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        const content = e.target?.result as string
        setInput(sanitizeInput(content))
        setInputLanguage(
          file.name.endsWith('.yaml') || file.name.endsWith('.yml')
            ? 'yaml'
            : file.name.endsWith('.xml')
              ? 'xml'
              : 'json'
        )
        toast.success('File uploaded successfully!')
      }
      reader.readAsText(file)
    }
  }

  const undo = () => {
    if (undoStack.length > 0) {
      const prevState = undoStack[undoStack.length - 1]
      setRedoStack([...redoStack, input])
      setInput(prevState)
      setUndoStack(undoStack.slice(0, -1))
    }
  }

  const redo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1]
      setUndoStack([...undoStack, input])
      setInput(nextState)
      setRedoStack(redoStack.slice(0, -1))
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Input</span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={undo}
                disabled={undoStack.length === 0}
                aria-label="Undo"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={redo}
                disabled={redoStack.length === 0}
                aria-label="Redo"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <Label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-4 w-4" />
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".json,.yaml,.yml,.xml"
                  aria-label="Upload file"
                />
              </Label>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            value={inputLanguage}
            onValueChange={value => setInputLanguage(value as EditorLanguage)}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="json">JSON</TabsTrigger>
              <TabsTrigger value="yaml">YAML</TabsTrigger>
              <TabsTrigger value="xml">XML</TabsTrigger>
            </TabsList>
          </Tabs>
          <CodeEditor
            value={input}
            onChange={handleInputChange}
            language={inputLanguage}
            aria-label={`${inputLanguage.toUpperCase()} Input Editor`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Output</span>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(output)}
                className="mr-2"
                aria-label="Copy to clipboard"
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadOutput}
                aria-label="Download output"
              >
                <Download className="mr-2 h-4 w-4" /> Download
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CodeEditor
            value={output}
            onChange={() => {}}
            language={outputLanguage}
            readOnly={true}
            aria-label={`${outputLanguage.toUpperCase()} Output Editor`}
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-2 flex flex-wrap justify-center gap-4 mt-6">
        <Button onClick={parseJson} disabled={inputLanguage !== 'json'} aria-label="Parse JSON">
          <Code className="mr-2 h-4 w-4" /> Parse
        </Button>
        <Button
          onClick={convertYamlToJson}
          disabled={inputLanguage !== 'yaml'}
          aria-label="Convert YAML to JSON"
        >
          <FileJson className="mr-2 h-4 w-4" /> YAML to JSON
        </Button>
        <Button
          onClick={convertJsonToYaml}
          disabled={inputLanguage !== 'json'}
          aria-label="Convert JSON to YAML"
        >
          <FileCode className="mr-2 h-4 w-4" /> JSON to YAML
        </Button>
        <Button
          onClick={convertXmlToJson}
          disabled={inputLanguage !== 'xml'}
          aria-label="Convert XML to JSON"
        >
          <FileX className="mr-2 h-4 w-4" /> XML to JSON
        </Button>
        <Button
          onClick={convertJsonToXml}
          disabled={inputLanguage !== 'json'}
          aria-label="Convert JSON to XML"
        >
          <FileX className="mr-2 h-4 w-4" /> JSON to XML
        </Button>
        <Button
          onClick={encodeBase64}
          disabled={inputLanguage !== 'json'}
          aria-label="Encode to Base64"
        >
          <Key className="mr-2 h-4 w-4" /> Encode Base64
        </Button>
        <Button
          onClick={decodeBase64}
          disabled={inputLanguage !== 'json'}
          aria-label="Decode from Base64"
        >
          <Key className="mr-2 h-4 w-4" /> Decode Base64
        </Button>
        <Button onClick={minifyJson} disabled={inputLanguage !== 'json'} aria-label="Minify JSON">
          <FileJson className="mr-2 h-4 w-4" /> Minify
        </Button>
        <Button
          onClick={validateJson}
          disabled={inputLanguage !== 'json'}
          aria-label="Validate JSON"
        >
          <Check className="mr-2 h-4 w-4" /> Validate
        </Button>
      </div>
    </div>
  )
}
