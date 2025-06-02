"use client"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCallback } from "react"

// Available fields for rules
const fields = [
  { id: "totalSpend", name: "Total Spend" },
  { id: "lastOrderDate", name: "Last Order Date" },
  { id: "orderCount", name: "Order Count" },
  { id: "category", name: "Category" },
  { id: "loyaltyMember", name: "Loyalty Member" },
  { id: "abandonedCart", name: "Abandoned Cart" },
  { id: "cartValue", name: "Cart Value" },
]

// Available operators based on field type
const operators = {
  number: [
    { id: ">", name: "Greater than" },
    { id: "<", name: "Less than" },
    { id: "=", name: "Equal to" },
    { id: ">=", name: "Greater than or equal to" },
    { id: "<=", name: "Less than or equal to" },
    { id: "!=", name: "Not equal to" },
  ],
  date: [
    { id: ">", name: "After" },
    { id: "<", name: "Before" },
    { id: "=", name: "On" },
  ],
  string: [
    { id: "=", name: "Equal to" },
    { id: "!=", name: "Not equal to" },
    { id: "contains", name: "Contains" },
  ],
  boolean: [{ id: "=", name: "Equal to" }],
}

// Field type mapping
const fieldTypes = {
  totalSpend: "number",
  lastOrderDate: "date",
  orderCount: "number",
  category: "string",
  loyaltyMember: "boolean",
  abandonedCart: "boolean",
  cartValue: "number",
}

const RuleItem = ({ rule, index, moveRule, updateRule, removeRule }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "RULE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "RULE",
    hover: (item) => {
      if (item.index !== index) {
        moveRule(item.index, index)
        item.index = index
      }
    },
  })

  const getOperatorsForField = (fieldId) => {
    const fieldType = fieldTypes[fieldId] || "string"
    return operators[fieldType] || []
  }

  const renderValueInput = (fieldId, value) => {
    const fieldType = fieldTypes[fieldId]
    const stringValue = value?.toString() || ""

    if (fieldType === "boolean") {
      return (
        <Select
          value={stringValue}
          onValueChange={(newValue) => {
            const formattedValue = newValue === "true"
            updateRule(index, "value", formattedValue)
          }}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">True</SelectItem>
            <SelectItem value="false">False</SelectItem>
          </SelectContent>
        </Select>
      )
    }

    if (fieldType === "date") {
      return (
        <Input
          type="date"
          value={stringValue}
          onChange={(e) => updateRule(index, "value", e.target.value)}
          className="w-[150px]"
        />
      )
    }

    return (
      <Input
        type={fieldType === "number" ? "number" : "text"}
        placeholder="Enter value"
        value={stringValue}
        onChange={(e) => {
          const newValue = fieldType === "number" ? Number(e.target.value) : e.target.value
          updateRule(index, "value", newValue)
        }}
        className="w-[150px]"
      />
    )
  }

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`flex items-center gap-2 rounded-md border p-3 ${isDragging ? "opacity-50" : ""}`}
    >
      <div className="cursor-move">
        <GripVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Select
          value={rule.field}
          onValueChange={(value) => {
            // Reset the value when field type changes
            updateRule(index, "field", value)
            updateRule(index, "operator", getOperatorsForField(value)[0]?.id || "")

            const fieldType = fieldTypes[value]
            let defaultValue = ""
            if (fieldType === "boolean") defaultValue = "false"
            if (fieldType === "number") defaultValue = 0

            updateRule(index, "value", defaultValue)
          }}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select field" />
          </SelectTrigger>
          <SelectContent>
            {fields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={rule.operator} onValueChange={(value) => updateRule(index, "operator", value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {getOperatorsForField(rule.field).map((op) => (
              <SelectItem key={op.id} value={op.id}>
                {op.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {renderValueInput(rule.field, rule.value)}
      </div>

      <Button variant="ghost" size="icon" onClick={() => removeRule(index)}>
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Remove rule</span>
      </Button>
    </div>
  )
}

export function VisualRuleBuilder({ rules, setRules, ruleOperator, setRuleOperator }) {
  const moveRule = useCallback((dragIndex, hoverIndex) => {
    const dragRule = rules[dragIndex]
    const newRules = [...rules]
    newRules.splice(dragIndex, 1)
    newRules.splice(hoverIndex, 0, dragRule)
    setRules(newRules)
  }, [rules, setRules])

  const updateRule = useCallback((index, field, value) => {
    const newRules = [...rules]
    newRules[index] = { ...newRules[index], [field]: value }
    setRules(newRules)
  }, [rules, setRules])

  const removeRule = useCallback((index) => {
    const newRules = [...rules]
    newRules.splice(index, 1)
    setRules(newRules)
  }, [rules, setRules])

  const addRule = useCallback(() => {
    setRules([...rules, { field: "totalSpend", operator: ">", value: 1000 }])
  }, [rules, setRules])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="space-y-4">
          <Label>Combine Rules With</Label>
          <RadioGroup
            value={ruleOperator}
            onValueChange={(value) => setRuleOperator(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="AND" id="visual-and" />
              <Label htmlFor="visual-and">AND (All conditions must match)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="OR" id="visual-or" />
              <Label htmlFor="visual-or">OR (Any condition can match)</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Rule Blocks</Label>
            <Button onClick={addRule} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </div>

          {rules.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="text-center text-muted-foreground">
                  <p>No rules added yet</p>
                  <p className="text-sm">Add a rule to start building your campaign</p>
                </div>
                <Button onClick={addRule} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {rules.map((rule, index) => (
                <div key={index} className="relative">
                  <RuleItem
                    rule={rule}
                    index={index}
                    moveRule={moveRule}
                    updateRule={updateRule}
                    removeRule={removeRule}
                  />
                  {index < rules.length - 1 && (
                    <div className="absolute left-6 -bottom-3 flex items-center justify-center">
                      <div className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{ruleOperator}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {rules.length > 0 && (
          <div className="rounded-md border p-4">
            <div className="text-sm font-medium">Preview:</div>
            <div className="mt-2 text-sm">
              {rules.map((rule, index) => (
                <span key={index}>
                  <span>
                    {fields.find((f) => f.id === rule.field)?.name || rule.field} {rule.operator}{" "}
                    {typeof rule.value === "boolean" ? (rule.value ? "True" : "False") : rule.value}
                  </span>
                  {index < rules.length - 1 && (
                    <span className="mx-2 font-medium text-muted-foreground">{ruleOperator}</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  )
}