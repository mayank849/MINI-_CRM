"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

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

export function RuleBuilder({ rules, setRules, ruleOperator, setRuleOperator }) {
  const [newRule, setNewRule] = useState({
    field: "",
    operator: "",
    value: "",
  })

  const getOperatorsForField = (fieldId) => {
    const fieldType = fieldTypes[fieldId] || "string"
    return operators[fieldType] || []
  }

  const formatValueForFieldType = (fieldId, value) => {
    const fieldType = fieldTypes[fieldId]
    if (fieldType === "number") {
      return Number(value)
    }
    if (fieldType === "boolean") {
      return value === "true"
    }
    return value
  }

  const addRule = () => {
    if (newRule.field && newRule.operator && newRule.value) {
      const formattedValue = formatValueForFieldType(newRule.field, newRule.value)
      setRules([
        ...rules,
        {
          ...newRule,
          value: formattedValue,
        },
      ])
      setNewRule({ field: "", operator: "", value: "" })
    }
  }

  const removeRule = (index) => {
    const updatedRules = [...rules]
    updatedRules.splice(index, 1)
    setRules(updatedRules)
  }

  const renderValueInput = (fieldId) => {
    const fieldType = fieldTypes[fieldId]
    if (fieldType === "boolean") {
      return (
        <Select value={newRule.value} onValueChange={(value) => setNewRule({ ...newRule, value })}>
          <SelectTrigger>
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
        <Input type="date" value={newRule.value} onChange={(e) => setNewRule({ ...newRule, value: e.target.value })} />
      )
    }
    return (
      <Input
        type={fieldType === "number" ? "number" : "text"}
        placeholder="Enter value"
        value={newRule.value}
        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Combine Rules With</Label>
        <RadioGroup
          value={ruleOperator}
          onValueChange={(value) => setRuleOperator(value)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="AND" id="and" />
            <Label htmlFor="and">AND (All conditions must match)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="OR" id="or" />
            <Label htmlFor="or">OR (Any condition can match)</Label>
          </div>
        </RadioGroup>
      </div>

      {rules.length > 0 && (
        <div className="space-y-4">
          <Label>Current Rules</Label>
          <div className="space-y-2">
            {rules.map((rule, index) => (
              <div key={index} className="flex items-center gap-2 rounded-md border p-3">
                <div className="flex-1 text-sm">
                  {fields.find((f) => f.id === rule.field)?.name || rule.field} {rule.operator}{" "}
                  {typeof rule.value === "boolean" ? (rule.value ? "True" : "False") : rule.value}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeRule(index)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove rule</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label>Add New Rule</Label>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="field" className="sr-only">
              Field
            </Label>
            <Select
              value={newRule.field}
              onValueChange={(value) => setNewRule({ ...newRule, field: value, operator: "" })}
            >
              <SelectTrigger id="field">
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
          </div>

          <div>
            <Label htmlFor="operator" className="sr-only">
              Operator
            </Label>
            <Select
              value={newRule.operator}
              onValueChange={(value) => setNewRule({ ...newRule, operator: value })}
              disabled={!newRule.field}
            >
              <SelectTrigger id="operator">
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {newRule.field &&
                  getOperatorsForField(newRule.field).map((op) => (
                    <SelectItem key={op.id} value={op.id}>
                      {op.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value" className="sr-only">
              Value
            </Label>
            {newRule.field && newRule.operator ? (
              renderValueInput(newRule.field)
            ) : (
              <Input disabled placeholder="Enter value" />
            )}
          </div>
        </div>

        <Button
          onClick={addRule}
          disabled={!newRule.field || !newRule.operator || !newRule.value}
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Rule
        </Button>
      </div>
    </div>
  )
}
