"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { RuleBuilder } from "@/components/rule-builder"
import { VisualRuleBuilder } from "@/components/visual-rule-builder"
import { CampaignNameSuggestions } from "@/components/campaign-name-suggestions"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function NewCampaignPage() {
  const router = useRouter()
  const [campaignName, setCampaignName] = useState("")
  const [rules, setRules] = useState([])
  const [ruleOperator, setRuleOperator] = useState("AND")
  const [previewResult, setPreviewResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const handleCreateCampaign = async () => {
    if (!campaignName) {
      toast({
        title: "Missing information",
        description: "Please provide a campaign name",
        variant: "destructive",
      })
      return
    }

    if (rules.length === 0) {
      toast({
        title: "Missing rules",
        description: "Please add at least one rule to your campaign",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Format the rules to match the expected API format
      const formattedRules = rules.map((rule) => ({
        key: rule.field,
        operator: rule.operator,
        value: rule.value,
      }))

      // Prepare the payload
      const payload = {
        name: campaignName,
        ruleOperator,
        rules: formattedRules,
      }

      // Make the API call
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newcampaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()

      // toast({
      //   title: "Campaign created",
      //   description: "Your campaign has been created successfully",
      // })
      toast("Campaign created successfully", {
        description: "Your campaign has been created successfully",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo action triggered"),
        },
      })

      router.push("/dashboard/campaigns")
    } catch (error) {
      console.error("Error creating campaign:", error)
      toast("Error creating campaign", {
        description: typeof error?.message === "string" ? error.message : "Failed to create campaign",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAudienceSize = async () => {
    if (rules.length === 0) {
      toast("Missing rules",{
        description: "Please add at least one rule to preview audience size",
      })
      return
    }

    setIsLoading(true)
    setPreviewResult(null)

    try {
      // Prepare payload in the required format
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
        throw new Error(`API request failed with status ${response.status}`)
      }

      const data = await response.json()
      setPreviewResult(data)
      setShowPreview(true)
    } catch (error) {
      console.error("Error fetching preview:", error)
      toast({
        title: "Error fetching preview",
        description: error instanceof Error ? error.message : "Failed to fetch preview data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectName = (name) => {
    setCampaignName(name)
    toast("Campaign name selected", {
      description: `${name} has been set as your campaign name.`,
        action: {
        label: "Undo",
        onClick: () => console.log("Undo action triggered"),
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Create New Campaign</h2>
        <p className="text-muted-foreground">Define your target audience and create a new marketing campaign</p>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label htmlFor="campaign-name">Campaign Name</Label>
          <Input
            id="campaign-name"
            placeholder="Enter campaign name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />

          {/* AI Campaign Name Suggestions */}
          {rules.length > 0 && (
            <CampaignNameSuggestions rules={rules} ruleOperator={ruleOperator} onSelectName={handleSelectName} />
          )}
        </div>

        <Tabs defaultValue="standard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard">Standard Rule Builder</TabsTrigger>
            <TabsTrigger value="visual">Visual Rule Builder</TabsTrigger>
          </TabsList>
          <TabsContent value="standard">
            <Card>
              <CardContent className="pt-6">
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
              <CardContent className="pt-6">
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Button variant="outline" onClick={fetchAudienceSize} disabled={isLoading || rules.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Previewing...
              </>
            ) : (
              "Preview Audience"
            )}
          </Button>

          {previewResult && (
            <div className="text-sm">
              <span className="font-medium">Estimated audience size:</span>{" "}
              <span className="text-primary">{previewResult.audienceSize.toLocaleString()} customers</span>
            </div>
          )}
        </div>

        {showPreview && previewResult && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="mb-4 text-lg font-medium">Audience Preview</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewResult.customers.map((customer) => (
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

        <Button onClick={handleCreateCampaign} disabled={isLoading || !campaignName || rules.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </div>
  )
}
