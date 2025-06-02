"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RuleBuilder } from "@/components/rule-builder"
import { VisualRuleBuilder } from "@/components/visual-rule-builder"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"

export default function RuleBuilderPage() {
  const [rules, setRules] = useState([])
  const [ruleOperator, setRuleOperator] = useState("AND")
  const [isLoading, setIsLoading] = useState(false)
  const [previewResult, setPreviewResult] = useState(null)

  const formatRules = () => {
    if (rules.length === 0) return "No rules defined"

    return rules
      .map((rule) => {
        // Handle boolean values specifically for display
        const formattedValue = typeof rule.value === 'boolean' ? (rule.value ? 'true' : 'false') : rule.value;
        return `${rule.field} ${rule.operator} ${formattedValue}`
      })
      .join(` ${ruleOperator} `)
  }

  const testRule = async () => {
    if (rules.length === 0) {
      toast({
        title: "No rules defined",
        description: "Please add at least one rule before testing",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setPreviewResult(null)

    try {
      // Prepare the payload in the required format
      const payload = {
        rules: rules.map((rule) => ({
          field: rule.field,
          operator: rule.operator,
          value: rule.value,
        })),
        ruleOperator,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/campaigns/preview`, { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        // Attempt to read the error message from the response body
        let errorDetail = `API request failed with status ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody && errorBody.message) {
            errorDetail = errorBody.message;
          } else if (errorBody && errorBody.error) {
             errorDetail = errorBody.error;
          }
        } catch (parseError) {
          // Ignore parsing errors, use the default status message
          console.error("Failed to parse error response body:", parseError);
        }
        throw new Error(errorDetail);
      }

      const data = await response.json()
      setPreviewResult(data)
    } catch (error) {
      console.error("Error testing rule:", error)
      toast({
        title: "Error testing rule",
        description: error instanceof Error ? error.message : "Failed to fetch preview data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Rule Builder</h2>
        <p className="text-muted-foreground">Create and test customer segmentation rules</p>
      </div>

      <Tabs defaultValue="standard">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Rule Builder</TabsTrigger>
          <TabsTrigger value="visual">Visual Rule Builder</TabsTrigger>
        </TabsList>
        <TabsContent value="standard">
          <Card>
            <CardHeader>
              <CardTitle>Standard Rule Builder</CardTitle>
              <CardDescription>Create rules using a form-based interface</CardDescription>
            </CardHeader>
            <CardContent>
              <RuleBuilder
                rules={rules}
                setRules={setRules}
                ruleOperator={ruleOperator}
                setRuleOperator={setRuleOperator}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="visual">
          <Card>
            <CardHeader>
              <CardTitle>Visual Rule Builder</CardTitle>
              <CardDescription>Create rules using a drag-and-drop interface</CardDescription>
            </CardHeader>
            <CardContent>
              <VisualRuleBuilder
                rules={rules}
                setRules={setRules}
                ruleOperator={ruleOperator}
                setRuleOperator={setRuleOperator}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {rules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rule Preview</CardTitle>
            <CardDescription>This is how your rule will be interpreted</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md bg-muted p-4">
              <pre className="whitespace-pre-wrap text-sm">{formatRules()}</pre>
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={testRule} disabled={isLoading || rules.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : (
                  "Test Rule"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {previewResult && (
        <Card>
          <CardHeader>
            <CardTitle>Audience Preview</CardTitle>
            <CardDescription>
              Found {previewResult.audienceSize} customer{previewResult.audienceSize !== 1 ? "s" : ""} matching your
              rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Ensure previewResult.customers is an array before mapping */}
                {Array.isArray(previewResult.customers) && previewResult.customers.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}