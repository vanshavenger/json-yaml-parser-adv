import { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Merge } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'

type JsonValue = string | number | boolean | null | JsonObject | JsonArray
type JsonObject = { [key: string]: JsonValue }
type JsonArray = JsonValue[]

export default function MergeTab() {
  const [mergeInputs, setMergeInputs] = useState<[string, string, string]>(['', '', ''])

  const mergeDeep = (target: JsonObject, source: JsonObject): JsonObject => {
    const output = { ...target }
    Object.keys(source).forEach(key => {
      if (source[key] instanceof Object && key in target) {
        output[key] = mergeDeep(output[key] as JsonObject, source[key] as JsonObject)
      } else {
        output[key] = source[key]
      }
    })
    return output
  }

  const mergeJson = () => {
    try {
      const obj1 = JSON.parse(mergeInputs[0]) as JsonObject
      const obj2 = JSON.parse(mergeInputs[1]) as JsonObject

      const mergedObj = mergeDeep(JSON.parse(JSON.stringify(obj1)), obj2)
      const mergedJson = JSON.stringify(mergedObj, null, 2)
      setMergeInputs([mergeInputs[0], mergeInputs[1], mergedJson])
      toast.success('JSON objects merged successfully!')
    } catch (err) {
      toast.error(
        'Error merging JSON objects: ' + (err instanceof Error ? err.message : String(err))
      )
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Merge JSON Objects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {mergeInputs.map((input, index) => (
            <div key={index}>
              <Label htmlFor={`merge-input-${index + 1}`} className="mb-2 block">
                {index === 2 ? 'Merged Output' : `JSON Object ${index + 1}`}
              </Label>
              <CodeEditor
                value={input}
                onChange={value => {
                  if (index !== 2) {
                    const newInputs = [...mergeInputs] as [string, string, string]
                    newInputs[index] = value || ''
                    setMergeInputs(newInputs)
                  }
                }}
                language="json"
                readOnly={index === 2}
                aria-label={index === 2 ? 'Merged Output' : `Merge Input ${index + 1}`}
              />
            </div>
          ))}
        </div>
        <Button onClick={mergeJson} className="mb-4" aria-label="Merge JSON Objects">
          <Merge className="mr-2 h-4 w-4" /> Merge JSON Objects
        </Button>
      </CardContent>
    </Card>
  )
}
