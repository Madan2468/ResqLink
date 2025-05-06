import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Heart, MapPin, MessageSquare, Phone, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-red-600" />
            <span className="text-xl font-bold">ResQLink</span>
          </Link>
          <nav className="ml-auto flex gap-4 sm:gap-6">
            <Link href="#services" className="text-sm font-medium">
              Services
            </Link>
            <Link href="#about" className="text-sm font-medium">
              About
            </Link>
            <Link href="/emergency" className="text-sm font-medium">
              Emergency
            </Link>
            <Link href="/chat" className="text-sm font-medium">
              Chat
            </Link>
            <Link href="/auth/login" className="text-sm font-medium">
              Login
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Emergency Response at Your Fingertips
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ResQLink connects you with emergency services instantly. Get help when you need it most with our
                  reliable platform.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/emergency">
                    <Button size="lg" className="bg-red-600 hover:bg-red-700">
                      Emergency Help
                    </Button>
                  </Link>
                  <Link href="/chat">
                    <Button size="lg" variant="outline">
                      Chat with Assistant
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=500&width=800"
                  alt="Emergency services"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Our Services</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ResQLink provides a range of emergency services to ensure your safety and well-being.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Phone className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle>Emergency Calls</CardTitle>
                  <CardDescription>Instant connection to emergency services with location tracking.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Our platform ensures that your emergency calls are routed to the nearest available service with your
                    precise location.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/services/calls">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <MapPin className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle>Location Tracking</CardTitle>
                  <CardDescription>Real-time location sharing with emergency responders.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Share your exact location with emergency services to ensure they can find you quickly in critical
                    situations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/services/location">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <Heart className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle>Medical Assistance</CardTitle>
                  <CardDescription>Quick access to medical professionals and advice.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Get connected with medical professionals who can provide guidance and dispatch medical assistance
                    when needed.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/services/medical">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-red-600 mb-2" />
                  <CardTitle>AI Chatbot</CardTitle>
                  <CardDescription>24/7 assistance through our intelligent chatbot.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">
                    Get immediate help and guidance from our AI assistant that can provide emergency instructions and
                    connect you with services.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/chat">
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">About ResQLink</h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ResQLink was founded with a mission to make emergency services more accessible to everyone. Our
                  platform connects users with emergency responders quickly and efficiently.
                </p>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We work with local emergency services, hospitals, and first responders to ensure that help is always
                  available when you need it most.
                </p>
              </div>
              <div className="mx-auto w-full max-w-[500px] aspect-video relative rounded-xl overflow-hidden shadow-xl">
                <img
                  src="/placeholder.svg?height=500&width=800"
                  alt="About ResQLink"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-red-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready for Emergencies</h2>
                <p className="max-w-[900px] text-red-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Download our app today and be prepared for any emergency situation.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-100">
                  Download App
                </Button>
                <Link href="/chat">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-red-700">
                    Try Our Chatbot
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                <span className="text-xl font-bold">ResQLink</span>
              </Link>
              <p className="text-sm text-gray-500">
                Emergency response platform connecting you with help when you need it most.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Services</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services/calls" className="text-gray-500 hover:text-gray-900">
                    Emergency Calls
                  </Link>
                </li>
                <li>
                  <Link href="/services/location" className="text-gray-500 hover:text-gray-900">
                    Location Tracking
                  </Link>
                </li>
                <li>
                  <Link href="/services/medical" className="text-gray-500 hover:text-gray-900">
                    Medical Assistance
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="text-gray-500 hover:text-gray-900">
                    AI Chatbot
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/auth/login" className="text-gray-500 hover:text-gray-900">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="text-gray-500 hover:text-gray-900">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-gray-500 hover:text-gray-900">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-gray-500 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-500 hover:text-gray-900">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
            <p className="text-sm text-gray-500">© 2024 ResQLink. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Twitter</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Facebook</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-gray-900">
                <span className="sr-only">Instagram</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
