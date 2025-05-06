// This file handles proxying requests to the backend to avoid CORS issues
const BACKEND_URL = "https://resqlink-backend-kql6.onrender.com"

export async function POST(req: Request) {
  try {
    // Check if the request is a FormData request
    const contentType = req.headers.get("Content-Type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await req.formData()
      const endpoint = formData.get("endpoint") as string

      if (!endpoint) {
        return Response.json({ error: "Endpoint is required" }, { status: 400 })
      }

      console.log(`Processing FormData request to endpoint: ${endpoint}`)

      // Simple string concatenation for URL
      const url = BACKEND_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`)

      console.log(`Making FormData request to: ${url}`)

      // Create a new FormData object to send to the backend
      const backendFormData = new FormData()

      // Copy all entries except 'endpoint' to the new FormData
      for (const [key, value] of formData.entries()) {
        if (key !== "endpoint") {
          backendFormData.append(key, value)
        }
      }

      const response = await fetch(url, {
        method: "POST",
        body: backendFormData,
        headers: {
          // Don't set Content-Type for FormData, browser will set it with boundary
          Accept: "application/json",
          // Forward authorization header if present
          ...(req.headers.get("Authorization") ? { Authorization: req.headers.get("Authorization")! } : {}),
        },
      })

      // Get the response as text first
      const responseText = await response.text()
      console.log(`Response from ${endpoint} (status ${response.status}):`, responseText.substring(0, 200))

      // Try to parse as JSON
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (error) {
        console.error("Error parsing response as JSON:", error)
        responseData = {
          error: "Server did not return valid JSON",
          text: responseText.substring(0, 500),
        }
      }

      return Response.json(responseData, { status: response.status })
    } else {
      // Handle JSON request
      let body
      try {
        body = await req.json()
      } catch (error) {
        console.error("Error parsing request body:", error)
        return Response.json({ error: "Invalid JSON in request body" }, { status: 400 })
      }

      const { endpoint, method, data } = body

      if (!endpoint) {
        return Response.json({ error: "Endpoint is required" }, { status: 400 })
      }

      console.log(`Processing JSON request to endpoint: ${endpoint}`, { method, data })

      // Simple string concatenation for URL
      const url = BACKEND_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`)

      console.log(`Making request to: ${url}`)

      const response = await fetch(url, {
        method: method || "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Forward authorization header if present
          ...(req.headers.get("Authorization") ? { Authorization: req.headers.get("Authorization")! } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
      })

      // Get the response as text first
      const responseText = await response.text()
      console.log(`Response from ${endpoint} (status ${response.status}):`, responseText.substring(0, 200))

      // Try to parse as JSON
      let responseData
      try {
        responseData = JSON.parse(responseText)
      } catch (error) {
        console.error("Error parsing response as JSON:", error)
        responseData = {
          error: "Server did not return valid JSON",
          text: responseText.substring(0, 500),
        }
      }

      return Response.json(responseData, { status: response.status })
    }
  } catch (error) {
    console.error("Proxy error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend"
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    // Get the URL and extract the endpoint parameter
    const url = new URL(req.url)
    const endpoint = url.searchParams.get("endpoint")

    if (!endpoint) {
      return Response.json({ error: "Endpoint is required" }, { status: 400 })
    }

    console.log(`Processing GET request to endpoint: ${endpoint}`)

    // Simple string concatenation for URL
    const backendUrl = BACKEND_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`)

    console.log(`Making GET request to: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Forward authorization header if present
        ...(req.headers.get("Authorization") ? { Authorization: req.headers.get("Authorization")! } : {}),
      },
    })

    // Get the response as text first
    const responseText = await response.text()
    console.log(`Response from ${endpoint} (status ${response.status}):`, responseText.substring(0, 200))

    // Try to parse as JSON
    let responseData
    try {
      responseData = JSON.parse(responseText)
    } catch (error) {
      console.error("Error parsing response as JSON:", error)
      responseData = {
        error: "Server did not return valid JSON",
        text: responseText.substring(0, 500),
      }
    }

    return Response.json(responseData, { status: response.status })
  } catch (error) {
    console.error("Proxy error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend"
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
