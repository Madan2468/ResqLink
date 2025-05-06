"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Shield, XCircle, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getUserCases, getCurrentUser, logoutUser, checkBackendStatus } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"

interface EmergencyRequest {
  id: string
  type: string
  status: string
  location: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [casesError, setCasesError] = useState<string | null>(null)
  const [backendAvailable, setBackendAvailable] = useState(false) // Default to false
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>([])
  const [user, setUser] = useState<any>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(true) // Default to true

  // Check backend status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isAvailable = await checkBackendStatus()
        setBackendAvailable(isAvailable)

        if (!isAvailable) {
          console.log("Backend is not available, using offline mode")
          setIsOfflineMode(true)
          setError("Backend server is currently unavailable. Using demo mode.")

          // Set demo user data
          setUser({
            _id: "offline-user",
            name: "Demo User",
            email: "user@example.com",
            phone: "555-123-4567",
          })

          // Set demo emergency requests
          setEmergencyRequests([
            {
              id: "sample1",
              type: "medical",
              status: "pending",
              location: "123 Main St, Anytown, USA",
              description: "Medical emergency requiring immediate attention",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "sample2",
              type: "fire",
              status: "in-progress",
              location: "456 Oak Ave, Somewhere, USA",
              description: "Small fire reported in kitchen area",
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            },
            {
              id: "sample3",
              type: "police",
              status: "completed",
              location: "789 Pine St, Elsewhere, USA",
              description: "Suspicious activity reported in neighborhood",
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
            },
          ])

          setLoading(false)
          return
        }

        setIsOfflineMode(false)
      } catch (error) {
        console.error("Error checking backend status:", error)
        setIsOfflineMode(true)
        setError("Error checking backend status. Using demo mode.")
      }
    }

    checkStatus()
  }, [])

  // Only fetch data if we're not in offline mode
  useEffect(() => {
    const fetchData = async () => {
      // If we're in offline mode, data is already set
      if (isOfflineMode) return

      try {
        setLoading(true)
        setError(null)
        setCasesError(null)

        // Check if user is logged in
        const token = localStorage.getItem("token")

        if (!token) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view your dashboard.",
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }

        // Fetch user data
        try {
          const userData = await getCurrentUser()
          setUser(userData)
          console.log("User data:", userData)
        } catch (userError) {
          console.error("Error fetching user data:", userError)

          // If we can't get user data, switch to offline mode
          setIsOfflineMode(true)
          setUser({
            _id: "offline-user",
            name: "Demo User",
            email: "user@example.com",
            phone: "555-123-4567",
          })

          if (
            userError instanceof Error &&
            (userError.message.includes("authentication") || userError.message.includes("token"))
          ) {
            localStorage.removeItem("token")
            toast({
              title: "Session Expired",
              description: "Your session has expired. Please log in again.",
              variant: "destructive",
            })
            router.push("/auth/login")
            return
          } else {
            setError("Could not fetch user data. Using demo mode.")
          }
        }

        // Fetch user cases
        try {
          const casesData = await getUserCases()
          console.log("Cases data:", casesData)

          if (casesData.length === 0) {
            setCasesError(
              "No emergency cases found. You may not have any cases yet, or there might be a connection issue.",
            )
          }

          // Map the cases to our expected format
          const formattedCases = casesData.map((caseItem: any) => ({
            id: caseItem._id,
            type: caseItem.type || "general",
            status: caseItem.status || "pending",
            location: caseItem.location || "Unknown location",
            description: caseItem.description || "No description provided",
            createdAt: caseItem.createdAt || new Date().toISOString(),
            updatedAt: caseItem.updatedAt || new Date().toISOString(),
          }))

          setEmergencyRequests(formattedCases)

          // If we got sample data, indicate we're in offline mode
          if (
            casesData.some(
              (c: any) => c._id?.toString().startsWith("sample") || c._id?.toString().startsWith("offline"),
            )
          ) {
            setIsOfflineMode(true)
            if (!error) {
              setError("Using sample data due to backend connectivity issues.")
            }
          }
        } catch (casesError) {
          console.error("Error fetching cases:", casesError)
          setIsOfflineMode(true)
          setError("Could not fetch cases. Using demo mode.")

          // Set demo emergency requests
          setEmergencyRequests([
            {
              id: "sample1",
              type: "medical",
              status: "pending",
              location: "123 Main St, Anytown, USA",
              description: "Medical emergency requiring immediate attention",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: "sample2",
              type: "fire",
              status: "in-progress",
              location: "456 Oak Ave, Somewhere, USA",
              description: "Small fire reported in kitchen area",
              createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
              updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
            },
            {
              id: "sample3",
              type: "police",
              status: "completed",
              location: "789 Pine St, Elsewhere, USA",
              description: "Suspicious activity reported in neighborhood",
              createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              updatedAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setError(error instanceof Error ? error.message : "Failed to load dashboard data")
        setIsOfflineMode(true)

        toast({
          title: "Error",
          description: "Failed to load dashboard data. Using demo mode.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast, router, isOfflineMode])

  const handleLogout = async () => {
    try {
      if (!isOfflineMode) {
        await logoutUser()
      }
      localStorage.removeItem("token")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
      // Even if logout fails on the server, clear the local token
      localStorage.removeItem("token")
      router.push("/auth/login")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> In Progress
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="mr-1 h-3 w-3" /> Cancelled
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch (error) {
      return "Invalid date"
    }
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <Link href="/" className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-red-600" />
              <span className="text-xl font-bold">ResQLink</span>
            </Link>
            <div className="ml-auto flex items-center gap-4">
              {isOfflineMode && (
                <div className="flex items-center text-red-500 text-sm mr-2">
                  <WifiOff className="h-4 w-4 mr-1" />
                  Demo Mode
                </div>
              )}
              <Button variant="ghost" onClick={handleLogout} className="text-sm font-medium">
                Logout
              </Button>
              <Link href="/" className="flex items-center text-sm font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your Dashboard</h1>
              <p className="text-gray-500">View and manage your emergency requests and account information.</p>
            </div>

            {isOfflineMode && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <WifiOff className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Demo Mode Active</h3>
                    <p className="text-sm text-yellow-700">
                      You're viewing sample data because we can't connect to the backend server. Some features may be
                      limited.
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                      Try Reconnecting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {error && !isOfflineMode && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Error Loading Dashboard</h3>
                    <p className="text-sm text-red-700">{error}</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="requests" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
                <TabsTrigger value="account">Account Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="requests" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent Emergency Requests</h2>
                  <Link href="/emergency">
                    <Button className="bg-red-600 hover:bg-red-700">New Emergency Request</Button>
                  </Link>
                </div>

                {casesError && (
                  <Card className="border-yellow-200 bg-yellow-50 mb-4">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-900">Cases Information</h3>
                        <p className="text-sm text-yellow-700">{casesError}</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.location.reload()}>
                          Refresh
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {emergencyRequests.length === 0 ? (
                      <Card>
                        <CardContent className="flex flex-col items-center justify-center h-64 text-center">
                          <p className="text-muted-foreground mb-4">You have no emergency requests yet.</p>
                          <Link href="/emergency">
                            <Button className="bg-red-600 hover:bg-red-700">Create New Request</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ) : (
                      emergencyRequests.map((request) => (
                        <Card key={request.id}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="capitalize">{request.type} Emergency</CardTitle>
                              {getStatusBadge(request.status)}
                            </div>
                            <CardDescription>Created on {formatDate(request.createdAt)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid gap-2">
                              <div>
                                <span className="font-medium">Location:</span> {request.location}
                              </div>
                              <div>
                                <span className="font-medium">Description:</span> {request.description}
                              </div>
                              {request.status === "in-progress" && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-100 rounded text-sm">
                                  <span className="font-medium text-blue-800">Status Update:</span>
                                  <span className="text-blue-700">
                                    {" "}
                                    Emergency services are on their way. Estimated arrival in 5-10 minutes.
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                          <CardFooter className="border-t pt-4 flex justify-between">
                            <div className="text-sm text-gray-500">Last updated: {formatDate(request.updatedAt)}</div>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/cases/${request.id}`}>View Details</Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
              <TabsContent value="account" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Manage your personal information and emergency contacts.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p>{user?.name || "Not available"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p>{user?.email || "Not available"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p>{user?.phone || "Not provided"}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                          <p className="truncate">{user?._id || "Not available"}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline">Edit Information</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contacts</CardTitle>
                    <CardDescription>People who will be notified in case of an emergency.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border rounded-lg divide-y">
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Jane Doe</h3>
                          <p className="text-sm text-gray-500">Spouse</p>
                          <p className="text-sm">+1 (555) 987-6543</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                      <div className="p-4 flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Robert Smith</h3>
                          <p className="text-sm text-gray-500">Brother</p>
                          <p className="text-sm">+1 (555) 456-7890</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Add Emergency Contact</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <footer className="w-full border-t py-6">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-sm text-gray-500">© 2024 ResQLink. All rights reserved.</p>
              <p className="text-sm text-gray-500">
                Emergency Hotline:{" "}
                <a href="tel:911" className="font-medium hover:underline">
                  911
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
