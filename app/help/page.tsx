"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FormModal } from "@/components/ui/form-modal"
import { useToast } from "@/components/ui/toast-banner"
import { PageLoader } from "@/components/ui/spinner"
import { RequireAuth } from "@/components/require-auth"
import { HelpCircle, Book, Mail, MessageSquare, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"

const faqs = [
  {
    question: "How is the Parity Score calculated?",
    answer:
      "The Parity Score is calculated by comparing your feature implementation status against competitors. Each feature is weighted by its priority score, and the overall score represents the percentage of competitive parity achieved.",
  },
  {
    question: "How often is competitor data updated?",
    answer:
      "Competitor feature data is updated weekly through a combination of automated scanning and manual verification by our research team.",
  },
  {
    question: "Can I add custom features to track?",
    answer:
      "Yes, you can add custom features through the Feature Map page. Click 'Add Feature' and fill in the required details including competitor implementations.",
  },
  {
    question: "How do I export my roadmap?",
    answer:
      "Navigate to the Roadmap page and click the 'Export' button in the top right. You can export as CSV, PDF, or integrate directly with Jira/Linear.",
  },
  {
    question: "What does Priority Score mean?",
    answer:
      "Priority Score (0-100) indicates the importance of a feature based on user demand, competitive pressure, and strategic value. Higher scores indicate features that should be prioritized.",
  },
]

const docLinks = [
  { title: "Getting Started Guide", href: "#", description: "Learn the basics of using SEO Space" },
  { title: "Feature Comparison Guide", href: "#", description: "How to interpret and use feature comparisons" },
  { title: "Roadmap Planning", href: "#", description: "Best practices for prioritizing your roadmap" },
  { title: "API Documentation", href: "#", description: "Integrate SEO Space with your tools" },
]

export default function HelpPage() {
  const [competitor, setCompetitor] = useState<"semrush" | "peec">("semrush")
  const [isLoading, setIsLoading] = useState(false)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const { showToast } = useToast()

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketCategory, setTicketCategory] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")

  const handleCompetitorChange = (newCompetitor: "semrush" | "peec") => {
    setIsLoading(true)
    setTimeout(() => {
      setCompetitor(newCompetitor)
      setIsLoading(false)
      showToast(`Switched to ${newCompetitor === "semrush" ? "SEMrush" : "peec"} comparison`, "info")
    }, 500)
  }

  const handleSubmitTicket = () => {
    if (!ticketSubject || !ticketCategory || !ticketDescription) {
      showToast("Please fill in all fields", "error")
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setShowTicketModal(false)
      setTicketSubject("")
      setTicketCategory("")
      setTicketDescription("")
      showToast("Support ticket submitted successfully. We'll respond within 24 hours.", "success")
    }, 1000)
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Sidebar competitor={competitor} onCompetitorChange={handleCompetitorChange} isLoading={isLoading} />

        <div className="pl-64">
          <TopBar title="Help & Support" />

          <main className="p-6 space-y-6">
            {isLoading ? (
              <PageLoader />
            ) : (
              <>
                {/* FAQ Section */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-muted-foreground" />
                      Frequently Asked Questions
                    </CardTitle>
                    <CardDescription>Find answers to common questions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border border-border rounded-lg">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-sm">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Documentation Links */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Book className="h-5 w-5 text-muted-foreground" />
                      Documentation
                    </CardTitle>
                    <CardDescription>Learn more about SEO Space features</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {docLinks.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.href}
                          className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                              {doc.title}
                              <ExternalLink className="h-3 w-3 text-muted-foreground" />
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Support Contact */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      Contact Support
                    </CardTitle>
                    <CardDescription>Get help from our support team</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium text-sm">Email Support</h4>
                        <p className="text-sm text-muted-foreground mt-1">support@seospace.io</p>
                        <p className="text-xs text-muted-foreground mt-2">Response time: 24 hours</p>
                      </div>
                      <div className="flex-1 p-4 rounded-lg bg-muted/50 border border-border">
                        <h4 className="font-medium text-sm">Live Chat</h4>
                        <p className="text-sm text-muted-foreground mt-1">Available Mon-Fri, 9am-6pm EST</p>
                        <p className="text-xs text-muted-foreground mt-2">Average wait: 5 minutes</p>
                      </div>
                    </div>

                    <Button onClick={() => setShowTicketModal(true)} className="w-full md:w-auto">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Open Support Ticket
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </main>
        </div>

        {/* Support Ticket Modal */}
        <FormModal
          open={showTicketModal}
          onClose={() => setShowTicketModal(false)}
          title="Open Support Ticket"
          onSubmit={handleSubmitTicket}
          submitText="Submit Ticket"
          loading={submitting}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Brief description of your issue"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={ticketCategory} onValueChange={setTicketCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="account">Account Issue</SelectItem>
                  <SelectItem value="billing">Billing Question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Please describe your issue in detail..."
                rows={4}
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
              />
            </div>
          </div>
        </FormModal>
      </div>
    </RequireAuth>
  )
}
