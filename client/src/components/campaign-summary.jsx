"use client"

import { useState } from "react"
import { Loader2, FileText, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { generateCampaignSummary } from "@/lib/gemini"

export function CampaignSummary({ campaign, logs }) {
  const [summary, setSummary] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showSummary, setShowSummary] = useState(false)

  const handleGenerateSummary = async () => {
    setLoading(true)
    setError(null)

    try {
      const summaryText = await generateCampaignSummary(campaign, logs)
      setSummary(summaryText)
      setShowSummary(true)
    } catch (err) {
      console.error("Error generating campaign summary:", err)
      setError("Failed to generate summary. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCloseSummary = () => {
    setShowSummary(false)
    setSummary("")
    setError(null)
  }

  if (!showSummary) {
    return (
      <Button variant="outline" onClick={handleGenerateSummary} className="flex items-center gap-2 bg-white hover:bg-blue-400">
        <FileText className="h-4 w-4" />
        Generate AI Summary
      </Button>
    )
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg">AI Campaign Summary</CardTitle>
          <CardDescription>A concise summary of this campaign's targeting and performance</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Generating summary...</span>
          </div>
        ) : error ? (
          <div className="text-destructive py-2">{error}</div>
        ) : (
          <div className="prose prose-sm dark:prose-invert">
            <p>{summary}</p>
            <div className="pt-2 flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleGenerateSummary} className="flex items-center gap-2 bg-white hover:bg-blue-400">
                <FileText className="h-4 w-4" />
                Regenerate
              </Button>
              <Button variant="ghost" size="sm" onClick={handleCloseSummary} className="flex items-center gap-2 bg-white hover:bg-red-100 text-red-500">
                <ArrowLeft className="h-4 w-4" />
                Close
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
