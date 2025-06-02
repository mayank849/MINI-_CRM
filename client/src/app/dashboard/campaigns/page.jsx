import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { CampaignList } from "@/components/campaign-list"

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Campaign History</h2>
          <p className="text-muted-foreground">View and manage all your marketing campaigns</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/campaigns/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      <CampaignList />
    </div>
  )
}
