"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Users, Send, AlertTriangle } from "lucide-react"
import { CampaignList } from "@/components/campaign-list"
import { joinUrl } from "@/lib/join"
export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    campaignChange: 0,
    audienceReached: 0,
    audienceChange: "N/A",
    messagesSent: 0,
    sentChange: 0,
    failedDeliveries: 0,
    failedChange: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const url = joinUrl(process.env.NEXT_PUBLIC_BACKEND_URL, '/api/dashboard');
        const res = await fetch(url);
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign Dashboard</h2>
          <p className="text-muted-foreground">Here's an overview of your marketing campaigns</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <PlusCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            <p className="text-xs text-muted-foreground">
              {stats.campaignChange >= 0 ? `+${stats.campaignChange}` : stats.campaignChange} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audience Reached</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.audienceReached.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats.audienceChange}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.messagesSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.sentChange >= 0 ? `+${stats.sentChange}` : stats.sentChange} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Deliveries</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failedDeliveries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.failedChange >= 0 ? `+${stats.failedChange}` : stats.failedChange} from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-medium">Recent Campaigns</h3>
        <CampaignList limit={5} />
      </div>
    </div>
  )
}
