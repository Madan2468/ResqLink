// This file handles proxying requests to the backend to avoid CORS issues
const BACKEND_URL = "https://resqlink-backend-kql6.onrender.com"

// Helper function to safely parse JSON
function safeJsonParse(text: string) {
  try {
    // Check if the response starts with HTML tags, which would indicate an HTML error page
    if (text.trim().startsWith("<")) {
      return {
        error: "Received HTML instead of JSON",
        htmlResponse: text.substring(0, 200) + "...", // Include a snippet of the HTML for debugging
      }
    }
    return JSON.parse(text)
  } catch (error) {
    console.error("Error parsing JSON:", error)
    return {
      error: "Failed to parse response as JSON",
      rawText: text.substring(0, 200) + "...", // Include a snippet of the text for debugging
    }
  }
}

export async function POST(req: Request) {
  try {
    // Check if the request is a FormData request
    const contentType = req.headers.get("Content-Type") || ""

    if (contentType.includes("multipart/form-data")) {
      // Handle file upload
      let formData: FormData
      try {
        formData = await req.formData()
      } catch (error) {
        console.error("Error parsing FormData:", error)
        return Response.json({ error: "Invalid form data" }, { status: 400 })
      }

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

      try {
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

        // Safely parse as JSON
        const responseData = safeJsonParse(responseText)

        return Response.json(responseData, { status: response.status })
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)
        return Response.json(
          {
            error: "Failed to connect to backend",
            details: fetchError instanceof Error ? fetchError.message : String(fetchError),
          },
          { status: 502 },
        )
      }
    } else {
      // Handle JSON request or other content types
      let body: any

      // Try to parse as JSON, but don't fail if it's not JSON
      try {
        body = await req.json()
      } catch (error) {
        console.error("Error parsing request body:", error)

        // If it's not JSON, try to get the text content
        try {
          const text = await req.text()
          console.log("Request body as text:", text.substring(0, 200))

          // Try to extract endpoint from URL if it's a GET-style request
          const url = new URL(req.url)
          const endpoint = url.searchParams.get("endpoint")

          if (endpoint) {
            // Handle as if it were a GET request
            return await handleGetRequest(endpoint, req.headers)
          }

          return Response.json(
            {
              error: "Invalid request format",
              message: "Request body is not valid JSON and no endpoint parameter was found",
            },
            { status: 400 },
          )
        } catch (textError) {
          console.error("Error getting request text:", textError)
          return Response.json({ error: "Could not parse request body" }, { status: 400 })
        }
      }

      const { endpoint, method, data } = body || {}

      if (!endpoint) {
        return Response.json({ error: "Endpoint is required" }, { status: 400 })
      }

      console.log(`Processing JSON request to endpoint: ${endpoint}`, { method, data })

      // Simple string concatenation for URL
      const url = BACKEND_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`)

      console.log(`Making request to: ${url}`)

      try {
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

        // Safely parse as JSON
        const responseData = safeJsonParse(responseText)

        return Response.json(responseData, { status: response.status })
      } catch (fetchError) {
        console.error("Fetch error:", fetchError)
        return Response.json(
          {
            error: "Failed to connect to backend",
            details: fetchError instanceof Error ? fetchError.message : String(fetchError),
          },
          { status: 502 },
        )
      }
    }
  } catch (error) {
    console.error("Proxy error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend"
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}

// Helper function to handle GET requests
async function handleGetRequest(endpoint: string, headers: Headers) {
  try {
    console.log(`Processing GET request to endpoint: ${endpoint}`)

    // Simple string concatenation for URL
    const backendUrl = BACKEND_URL + (endpoint.startsWith("/") ? endpoint : `/${endpoint}`)

    console.log(`Making GET request to: ${backendUrl}`)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Forward authorization header if present
        ...(headers.get("Authorization") ? { Authorization: headers.get("Authorization")! } : {}),
      },
    })

    // Get the response as text first
    const responseText = await response.text()
    console.log(`Response from ${endpoint} (status ${response.status}):`, responseText.substring(0, 200))

    // Safely parse as JSON
    const responseData = safeJsonParse(responseText)

    return Response.json(responseData, { status: response.status })
  } catch (error) {
    console.error("GET request error:", error)
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

    return await handleGetRequest(endpoint, req.headers)
  } catch (error) {
    console.error("Proxy error:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to connect to backend"
    return Response.json({ error: errorMessage }, { status: 500 })
  }
}
