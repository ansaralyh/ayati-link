"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Html5Qrcode } from "html5-qrcode"

interface QrScannerProps {
  onResult: (result: string) => void
  onClose: () => void
}

export default function QrScanner({ onResult, onClose }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let html5QrCode: Html5Qrcode

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode("qr-reader")
        setIsScanning(true)

        const qrCodeSuccessCallback = (decodedText: string) => {
          onResult(decodedText)
          stopScanner()
        }

        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          qrCodeSuccessCallback,
          (errorMessage) => {
            // Just ignore errors during scanning
          },
        )
      } catch (err) {
        setError("Impossible d'accéder à la caméra. Veuillez vérifier les permissions.")
        setIsScanning(false)
      }
    }

    const stopScanner = async () => {
      if (html5QrCode && isScanning) {
        try {
          await html5QrCode.stop()
        } catch (err) {
          console.error("Error stopping scanner:", err)
        }
        setIsScanning(false)
      }
    }

    startScanner()

    return () => {
      stopScanner()
    }
  }, [onResult, isScanning])

  return (
    <div className="flex flex-col items-center">
      <div id="qr-reader" className="w-full max-w-sm h-64 mb-4"></div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <Button onClick={onClose} variant="outline">
        Fermer
      </Button>
    </div>
  )
}

