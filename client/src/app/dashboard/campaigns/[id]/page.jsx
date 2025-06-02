"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Send, AlertTriangle, CheckCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { CampaignSummary } from "@/components/campaign-summary"

export default function CampaignDetailsPage() {
  const params = useParams(); 
  const router = useRouter()
  const [campaign, setCampaign] = useState(null)
  const [communicationLogs, setCommunicationLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      try {
        const id = params.id
        // Fetch campaign details
        const campaignResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/newcampaign/${params.id}`)

        if (!campaignResponse.ok) {
          throw new Error(`Campaign API request failed with status ${campaignResponse.status}`)
        }

        const campaignData = await campaignResponse.json()

        // Process campaign data from the nested structure
        const processedCampaign = {
          id: campaignData.campaign._id,
          name: campaignData.campaign.name,
          rules: campaignData.campaign.rules.map((rule) => ({
            field: rule.key,
            operator: rule.operator,
            value: rule.value,
          })),
          ruleOperator: campaignData.campaign.ruleOperator,
          createdAt: new Date(campaignData.campaign.createdAt || Date.now()),
          stats: {
            audienceSize: campaignData.campaign.audienceSize || 0,
            messagesSent: campaignData.stats.sent || 0,
            messagesFailed: campaignData.stats.failed || 0,
          },
        }

        setCampaign(processedCampaign)

        // Use the delivery status from the campaign details response
        setCommunicationLogs(
          campaignData.deliveryStatus.map((log) => ({
            _id: log.email, // Using email as a fallback ID
            customerName: log.name,
            email: log.email,
            status: log.status,
            timestamp: log.timestamp,
            message: "Campaign message", // Default message since it's not in the response
          })),
        )
      } catch (error) {
        console.error("Error fetching campaign details:", error)
        toast({
          title: "Error fetching campaign details",
          description: error instanceof Error ? error.message : "Failed to fetch campaign details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCampaignDetails()
  }, [params?.id, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="-ml-3 mb-1" disabled>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Campaign not found</div>
          <p className="text-muted-foreground">The campaign you're looking for doesn't exist or has been deleted.</p>
          <Button className="mt-4" onClick={() => router.push("/dashboard/campaigns")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
        </div>
      </div>
    )
  }

  const formatRules = () => {
    return campaign.rules
      .map((rule) => {
        return `${rule.field} ${rule.operator} ${rule.value}`
      })
      .join(` ${campaign.ruleOperator} `)
  }

  const deliveryRate =
    campaign.stats.audienceSize > 0 ? Math.round((campaign.stats.messagesSent / campaign.stats.audienceSize) * 100) : 0

  const failureRate =
    campaign.stats.audienceSize > 0
      ? Math.round((campaign.stats.messagesFailed / campaign.stats.audienceSize) * 100)
      : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="-ml-3 mb-1" onClick={() => router.push("/dashboard/campaigns")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{campaign.name}</h2>
          <p className="text-muted-foreground">Created on {format(new Date(campaign.createdAt), "MMMM d, yyyy")}</p>
        </div>

        {/* AI Campaign Summary Button */}
        <div>
          <CampaignSummary campaign={campaign} logs={communicationLogs} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audience Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.stats.audienceSize}</div>
            <p className="text-xs text-muted-foreground">Total customers targeted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.stats.messagesSent}</div>
            <div className="mt-2">
              <Progress value={deliveryRate} className="h-2" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{deliveryRate}% delivery rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaign.stats.messagesFailed}</div>
            <div className="mt-2">
              <Progress value={failureRate} className="h-2" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{failureRate}% failure rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Rules</CardTitle>
          <CardDescription>Segmentation rules used to target customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted p-4">
            <Badge variant="outline" className="mb-2">
              {campaign.ruleOperator}
            </Badge>
            <div className="space-y-2">
              {campaign.rules.map((rule, index) => (
                <div key={index} className="rounded-md bg-background p-3">
                  <span className="font-medium">{rule.field}</span> <span>{rule.operator}</span>{" "}
                  <span>{rule.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Status</CardTitle>
          <CardDescription>Individual customer message delivery status</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All ({communicationLogs.length})</TabsTrigger>
              <TabsTrigger value="delivered">
                Delivered ({communicationLogs.filter((log) => log.status === "SENT").length})
              </TabsTrigger>
              <TabsTrigger value="failed">
                Failed ({communicationLogs.filter((log) => log.status === "FAILED").length})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communicationLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No communication logs found
                      </TableCell>
                    </TableRow>
                  ) : (
                    communicationLogs.map((log) => (
                      <TableRow key={log._id}>
                        <TableCell className="font-medium">{log.customerName || "Unknown"}</TableCell>
                        <TableCell>{log.email}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{log.message}</TableCell>
                        <TableCell>
                          {log.status === "SENT" ? (
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Delivered</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                              <span>Failed</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="delivered" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communicationLogs.filter((log) => log.status === "SENT").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No delivered messages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    communicationLogs
                      .filter((log) => log.status === "SENT")
                      .map((log) => (
                        <TableRow key={log._id}>
                          <TableCell className="font-medium">{log.customerName || "Unknown"}</TableCell>
                          <TableCell>{log.email}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{log.message}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                              <span>Delivered</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="failed" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communicationLogs.filter((log) => log.status === "FAILED").length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No failed messages found
                      </TableCell>
                    </TableRow>
                  ) : (
                    communicationLogs
                      .filter((log) => log.status === "FAILED")
                      .map((log) => (
                        <TableRow key={log._id}>
                          <TableCell className="font-medium">{log.customerName || "Unknown"}</TableCell>
                          <TableCell>{log.email}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{log.message}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                              <span>Failed</span>
                            </div>
                          </TableCell>
                          <TableCell>{format(new Date(log.timestamp), "MMM d, yyyy HH:mm")}</TableCell>
                        </TableRow>
                      ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
