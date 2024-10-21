"use client";

import React, { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Download, Zap } from "lucide-react"
import Image from 'next/image'

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate the image")
      return
    }
    setIsLoading(true)
    try {
      const response = await fetch("/api/generate_image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate image')
      }
      setGeneratedImage(await response.text())
    } catch (error) {
      console.error("Error generating image:", error)
      setError("An error occurred while generating the image. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }, [prompt])

  const handleDownload = useCallback(() => {
    if (generatedImage) {
      const link = document.createElement('a')
      link.href = generatedImage
      link.download = 'ai-generated-image.png'
      link.click()
    }
  }, [generatedImage])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">AI Image Generator</h1>
        <p className="text-sm text-gray-500 flex items-center justify-center mb-8">
          <Zap className="h-4 w-4 text-orange-500 mr-2 fill-current" />
          Transform text into stunning images in seconds
        </p>
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter your prompt
                </label>
                <Input
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city with flying cars"
                  required
                  className={`w-full ${error ? 'border-red-500' : ''}`}
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              <Button type="submit" disabled={isLoading} className="w-full rounded-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {(isLoading || generatedImage) && (
          <Card className="mt-8">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="h-16 w-16 animate-spin mb-4 text-orange-500" />
                  <p className="text-lg text-gray-700">Creating your masterpiece...</p>
                </div>
              ) : generatedImage && (
                <>
                  <div className="aspect-square w-full relative overflow-hidden rounded-lg bg-gray-200">
                    <Image 
                      src={generatedImage} 
                      alt="Generated" 
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-lg"
                    />
                  </div>
                  <Button onClick={handleDownload} className="mt-4 w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Add this footer section at the end of the component */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by{' '}
            <a 
              href="https://developers.cloudflare.com/workers-ai/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Cloudflare Workers AI
            </a>
            {' '}using{' '}
            <a 
              href="https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-orange-500 hover:underline"
            >
              Flux 1 Schnell
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
