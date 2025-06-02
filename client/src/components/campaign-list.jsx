"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import {toast} from "sonner"

export function CampaignList({ limit }) {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newcampaign/`)

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`)
        }

        const data = await response.json()

        // Process the data to match our component's expected format
        const processedCampaigns = data.map((campaign) => ({
          id: campaign._id,
          name: campaign.name,
          rules: campaign.rules.map((rule) => ({
            field: rule.key,
            operator: rule.operator,
            value: rule.value,
          })),
          ruleOperator: campaign.ruleOperator,
          createdAt: new Date(campaign.createdAt || Date.now()),
          stats: {
            audienceSize: campaign.audienceSize || 0,
            messagesSent: campaign.messagesSent || 0,
            messagesFailed: campaign.messagesFailed || 0,
          },
        }))

        setCampaigns(limit ? processedCampaigns.slice(0, limit) : processedCampaigns)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        toast({
          title: "Error fetching campaigns",
          description: error instanceof Error ? error.message : "Failed to fetch campaigns",
          variant: "destructive",
        })
        // Set empty array to avoid undefined errors
        setCampaigns([])
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [limit, toast])

  const formatRules = (campaign) => {
    return campaign.rules
      .map((rule) => {
        return `${rule.field} ${rule.operator} ${rule.value}`
      })
      .join(` ${campaign.ruleOperator} `)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {limit ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(limit)
              .fill(0)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <div className="grid grid-cols-3 gap-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Rules</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Failed</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-12" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-12" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
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

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="text-center text-muted-foreground">
            <p>No campaigns found</p>
            <p className="text-sm">Create your first campaign to get started</p>
          </div>
          <Button asChild className="mt-4">
            <Link href="/dashboard/campaigns/new">Create Campaign</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {limit ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <CardTitle>{campaign.name}</CardTitle>
                <CardDescription>Created on {format(new Date(campaign.createdAt), "MMM d, yyyy")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    <Badge variant="outline">{campaign.ruleOperator}</Badge> {formatRules(campaign)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-medium">{campaign.stats.audienceSize}</p>
                      <p className="text-xs text-muted-foreground">Audience</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{campaign.stats.messagesSent}</p>
                      <p className="text-xs text-muted-foreground">Sent</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{campaign.stats.messagesFailed}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/dashboard/campaigns/${campaign.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Rules</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <div className="max-w-[300px] truncate">
                        <Badge variant="outline" className="mr-1">
                          {campaign.ruleOperator}
                        </Badge>
                        {formatRules(campaign)}
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(campaign.createdAt), "MMM d, yyyy")}</TableCell>
                    <TableCell>{campaign.stats.audienceSize}</TableCell>
                    <TableCell>{campaign.stats.messagesSent}</TableCell>
                    <TableCell>{campaign.stats.messagesFailed}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/campaigns/${campaign.id}`}>
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View</span>
                        </Link>
                      </Button>
                    </TableCell>
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
