"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormModal } from "@/components/ui/form-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast-banner"
import { PageLoader } from "@/components/ui/spinner"
import { FileText, Download, Plus, Eye, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { RequireAuth } from "@/components/require-auth"
import { useCompetitor } from "@/components/competitor-provider"

const mockReports = [
  { id: "1", name: "Q4 Parity Analysis", type: "Parity Report", date: "2024-12-01", status: "completed" },
  { id: "2", name: "SEMrush Gap Analysis", type: "Gap Report", date: "2024-11-28", status: "completed" },
  { id: "3", name: "Feature Roadmap Summary", type: "Roadmap Report", date: "2024-11-25", status: "completed" },
  { id: "4", name: "Weekly Progress Report", type: "Progress Report", date: "2024-11-20", status: "completed" },
  { id: "5", name: "Competitor Feature Audit", type: "Audit Report", date: "2024-11-15", status: "completed" },
]

export default function ReportsPage() {
  const { competitor, isSwitching, setCompetitor } = useCompetitor()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [reportType, setReportType] = useState("")
  const [generating, setGenerating] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleGenerateReport = () => {
    if (!reportType) return
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      setShowGenerateModal(false)
      setReportType("")
      showToast("Report generated successfully", "success")
    }, 1000)
  }

  const handleExportCSV = (reportName: string) => {
    showToast(`Exporting ${reportName} to CSV...`, "info")
    setTimeout(() => {
      showToast("CSV exported successfully", "success")
    }, 1000)
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-white">
        <Sidebar
          competitor={competitor}
          onCompetitorChange={setCompetitor}
          isLoading={isSwitching}
          disableCompetitorToggle
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        <div className="lg:pl-64">
          <TopBar
            title="Reports"
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />

          <main className="p-4 sm:p-6">
            {isSwitching ? (
              <PageLoader />
            ) : (
              <Card className="border border-border">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        Generated Reports
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-0.5">View and export your parity analysis reports</p>
                    </div>
                    <Button onClick={() => setShowGenerateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Generate New Report
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="font-medium text-xs uppercase tracking-wider">Report Name</TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wider">Type</TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wider">Date</TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wider">Status</TableHead>
                          <TableHead className="font-medium text-xs uppercase tracking-wider text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockReports.map((report, index) => (
                          <TableRow key={report.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                            <TableCell className="font-medium text-sm">{report.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="text-xs">
                                {report.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                {report.date}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="text-xs border-status-ahead/50 text-status-ahead bg-status-ahead/10"
                              >
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => router.push(`/reports/${report.id}`)}>
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleExportCSV(report.name)}>
                                  <Download className="h-4 w-4 mr-1" />
                                  CSV
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>

        {/* Generate Report Modal */}
        <FormModal
          open={showGenerateModal}
          onClose={() => setShowGenerateModal(false)}
          title="Generate New Report"
          onSubmit={handleGenerateReport}
          submitText="Generate Report"
          loading={generating}
        >
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Select the type of report you want to generate.</p>
            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parity">Parity Analysis Report</SelectItem>
                  <SelectItem value="gap">Gap Analysis Report</SelectItem>
                  <SelectItem value="roadmap">Roadmap Summary Report</SelectItem>
                  <SelectItem value="progress">Progress Report</SelectItem>
                  <SelectItem value="audit">Competitor Audit Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </FormModal>
      </div>
    </RequireAuth>
  )
}
