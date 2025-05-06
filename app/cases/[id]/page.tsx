import { ProtectedRoute } from "@/components/protected-route"

export default function CaseDetailPage() {
  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        {/* Your page content goes here */}
        <h1>Case Detail Page</h1>
        <p>This is the detail page for a specific case.</p>
      </div>
    </ProtectedRoute>
  )
}
