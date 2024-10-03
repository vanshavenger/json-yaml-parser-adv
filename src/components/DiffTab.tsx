import { useState } from 'react'
import { toast } from 'react-toastify'
import yaml from 'js-yaml'
import { diffJson } from 'diff'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { GitCompare } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'

export default function DiffTab() {
  const [diffInput1, setDiffInput1] = useState('')
  const [diffInput2, setDiffInput2] = useState('')
  const [diffOutput, setDiffOutput] = useState('')

  const performDiff = () => {
    try {
      let obj1, obj2

      try {
        obj1 = JSON.parse(diffInput1)
      } catch {
        obj1 = yaml.load(diffInput1)
      }

      try {
        obj2 = JSON.parse(diffInput2)
      } catch {
        obj2 = yaml.load(diffInput2)
      }

      const diff = diffJson(obj1, obj2)
      const diffOutput = diff
        .map(part => {
          const color = part.added
            ? 'text-green-500'
            : part.removed
              ? 'text-red-500'
              : 'text-muted-foreground'
          return `<span class="${color}">${part.value}</span>`
        })
        .join('')
      setDiffOutput(diffOutput)
      toast.success('Diff completed successfully!')
    } catch (err) {
      toast.error('Error performing diff: ' + (err as Error).message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diff Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="diff-input-1" className="mb-2 block">
              Input 1 (JSON or YAML)
            </Label>
            <CodeEditor
              value={diffInput1}
              onChange={value => setDiffInput1(value || '')}
              language="plaintext"
              aria-label="Diff Input 1"
            />
          </div>
          <div>
            <Label htmlFor="diff-input-2" className="mb-2 block">
              Input 2 (JSON or YAML)
            </Label>
            <CodeEditor
              value={diffInput2}
              onChange={value => setDiffInput2(value || '')}
              language="plaintext"
              aria-label="Diff Input 2"
            />
          </div>
        </div>
        <Button onClick={performDiff} className="mb-4" aria-label="Perform Diff">
          <GitCompare className="mr-2 h-4 w-4" /> Perform Diff
        </Button>
        <Separator className="my-4" />
        <div className="bg-muted p-4 rounded-md max-h-[300px] overflow-auto">
          <div
            dangerouslySetInnerHTML={{ __html: diffOutput }}
            aria-live="polite"
            aria-label="Diff Output"
          />
        </div>
      </CardContent>
    </Card>
  )
}
