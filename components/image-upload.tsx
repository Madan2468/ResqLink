"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X } from "lucide-react"
import { uploadImage } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void
}

export function ImageUpload({ onImageUploaded }: ImageUploadProps) {
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload the file
    setIsUploading(true)
    try {
      const response = await uploadImage(file)
      onImageUploaded(response.url)

      toast({
        title: "Image Uploaded",
        description: "Your image has been successfully uploaded.",
      })
    } catch (error) {
      console.error("Image upload error:", error)
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUploaded("")
  }

  return (
    <div className="space-y-2">
      {preview ? (
        <Card className="relative overflow-hidden">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-40 object-cover" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </Card>
      ) : (
        <label htmlFor="image-upload">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">Click to upload an image</p>
            <p className="text-xs text-gray-400 mt-1">(Optional)</p>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {isUploading && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
          <span className="ml-2 text-sm text-gray-500">Uploading...</span>
        </div>
      )}
    </div>
  )
}
