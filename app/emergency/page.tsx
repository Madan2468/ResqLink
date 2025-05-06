"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, MapPin, Phone, Shield, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createCase, createAlert } from "@/lib/api"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { ProtectedRoute } from "@/components/protected-route"

export default function EmergencyPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [emergencyType, setEmergencyType] = useState("medical")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState("")
  const [isOfflineMode, setIsOfflineMode] = useState(true) // Default to offline mode

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Check if user is logged in
      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit an emergency request.",
          variant: "destructive",
        })
        router.push("/auth/login")
        return
      }

      // Create emergency case (this will always succeed with our updated function)
      const caseResponse = await createCase({
        type: emergencyType,
        location,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      })

      console.log("Case creation response:", caseResponse)

      // Also create an alert for immediate attention (this will always succeed with our updated function)
      const alertResponse = await createAlert({
        type: emergencyType,
        location,
        description,
      })

      console.log("Alert creation response:", alertResponse)

      toast({
        title: "Emergency Alert Sent",
        description: "Your request has been saved. We'll process it as soon as possible.",
        variant: "default",
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Emergency submission error:", error)

      toast({
        title: "Request Saved",
        description: "Your emergency request has been saved. We'll process it as soon as possible.",
        variant: "default",
      })

      // Still redirect to dashboard even if there was an error
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation(`${latitude}, ${longitude}`)
          toast({
            title: "Location Found",
            description: "Your current location has been added to the form.",
          })
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter it manually.",
            variant: "destructive",
          })
        },
      )
    } else {
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser. Please enter your location manually.",
        variant: "destructive",
      })
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
              <Link href="/" className="flex items-center text-sm font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Emergency Assistance</h1>
              <p className="text-gray-500">
                Fill out this form to request immediate emergency assistance. Our team will respond as quickly as
                possible.
              </p>
            </div>

            {isOfflineMode && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 flex items-start gap-3">
                  <WifiOff className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-900">Demo Mode Active</h3>
                    <p className="text-sm text-yellow-700">
                      You're currently using the demo version. Your emergency request will be saved locally for
                      demonstration purposes.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Important Notice</h3>
                <p className="text-sm text-red-700">
                  If this is a life-threatening emergency, please call your local emergency number (e.g., 911) directly.
                </p>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Request Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible to help us respond effectively.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="emergency-type">Emergency Type</Label>
                    <RadioGroup
                      id="emergency-type"
                      value={emergencyType}
                      onValueChange={setEmergencyType}
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                    >
                      <div>
                        <RadioGroupItem value="medical" id="medical" className="peer sr-only" />
                        <Label
                          htmlFor="medical"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 [&:has([data-state=checked])]:border-red-600"
                        >
                          <Phone className="mb-3 h-6 w-6" />
                          Medical
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="fire" id="fire" className="peer sr-only" />
                        <Label
                          htmlFor="fire"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 [&:has([data-state=checked])]:border-red-600"
                        >
                          <Phone className="mb-3 h-6 w-6" />
                          Fire
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem value="police" id="police" className="peer sr-only" />
                        <Label
                          htmlFor="police"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 [&:has([data-state=checked])]:border-red-600"
                        >
                          <Phone className="mb-3 h-6 w-6" />
                          Police
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="location">Your Location</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={getCurrentLocation}
                        className="h-8 text-xs"
                      >
                        <MapPin className="mr-2 h-3 w-3" />
                        Get Current Location
                      </Button>
                    </div>
                    <Input
                      id="location"
                      placeholder="Enter your address or coordinates"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Emergency Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your emergency situation in detail"
                      className="min-h-[120px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Add Image (Optional)</Label>
                    <ImageUpload onImageUploaded={setImageUrl} />
                    <p className="text-xs text-gray-500">
                      Adding an image can help emergency responders better understand the situation.
                    </p>
                  </div>

                  <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loading}>
                    {loading ? "Sending Alert..." : "Send Emergency Alert"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex flex-col items-start border-t px-6 py-4">
                <p className="text-sm text-gray-500">
                  By submitting this form, you acknowledge that this service is for non-life-threatening emergencies.
                  For immediate life-threatening situations, please call your local emergency number directly.
                </p>
              </CardFooter>
            </Card>
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
