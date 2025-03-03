"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  QrCode,
  Volume2,
  VolumeX,
} from "lucide-react";
import Image from "next/image";
import QrScanner from "./components/qr-scanner";
import QrGenerator from "./components/qr-generator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { verses } from "./data/verses";

// Add the audioRef and muted state
export default function Home() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const { theme, setTheme } = useTheme();
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentVerse = verses[currentVerseIndex];

  // Update the useEffect to handle audio playback
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      // Play audio when isPlaying is true
      if (audioRef.current) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }

      interval = setInterval(() => {
        setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
      }, 10000); // Change verse every 10 seconds
    } else {
      // Pause audio when isPlaying is false
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Add effect to handle verse changes
  useEffect(() => {
    // When verse changes, update audio source and play if isPlaying
    if (audioRef.current) {
      audioRef.current.src = `/audio/${currentVerse.audioFile}`;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
    }
  }, [currentVerse.audioFile, isPlaying]);

  // Update the mute effect
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const handleNext = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % verses.length);
  };

  const handlePrevious = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + verses.length) % verses.length);
  };

  const handleQrSuccess = (result: string) => {
    // If the QR code contains a URL to this app, we could handle it here
    // For now, just close the scanner jkiowef 
    console.log("Hello")
    setShowScanner(false);
    // You could also navigate to a specific verse if the QR contains that info
    if (result.includes("verse=")) {
      const verseNumber = Number.parseInt(result.split("verse=")[1]);
      if (
        !isNaN(verseNumber) &&
        verseNumber >= 0 &&
        verseNumber < verses.length
      ) {
        setCurrentVerseIndex(verseNumber);
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <main
      className={`min-h-screen flex flex-col relative ${
        theme === "dark" ? "text-white" : "text-black"
      }`}
    >
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/ima.jpg"
          alt="Mosque Background"
          fill
          className="object-cover"
          priority
        />
        <div
          className={`absolute inset-0 ${
            theme === "dark" ? "bg-black/70" : "bg-white/30"
          }`}
        />
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} preload="auto" loop={false} muted={isMuted} />

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-end items-center">
      <div className="flex items-center gap-2">
          <Switch checked={theme === "dark"} onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")} />
          {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </div>
      </header>

      {/* Main Content */}
      <div className=" flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-8">
        <div className="flex absolute -top-14 items-center justify-center">
          <Image
            src="/logo.png"
            alt="Ayati Link"
            width={190}
            height={90}
            className="object-contain"
          />
        </div>
        <div className="max-w-4xl w-full p-6 mt-16 ">
          <h3 className="text-19px font-times text-center mb-2">
            L'interdiction
          </h3>
          <h2 className="text-center text-3xl font-times font-bold mb-2">
            {currentVerse.surah}
          </h2>
          <h3 className="text-center text-xl font-bold mb-6">
            Verset {currentVerse.verseNumber}
          </h3>

          <p className="text-right font-arabic text-3xl leading-loose mb-6 rtl">
            {currentVerse.arabic}
          </p>

          <p className="text-3xl font-times mb-8">{currentVerse.french}</p>

          <div className="text-center">
            <Button variant="ghost" className="text-sm">
              - Continuer la lecture -
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {/* Controls */}
        <div className="relative z-10 p-4 flex justify-center items-center gap-4 mb-4">
          {/* <Button className="h-10 w-10 rounded-full" variant="outline" size="icon" onClick={handlePrevious}>
          <SkipBack className="h-4 w-4" />
        </Button> */}

          <Button
            className="h-10 w-10 border-2 rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>

          <Button
            className="h-10 w-10 border-2 rounded-full"
            variant="outline"
            size="icon"
            onClick={handleNext}
          >
            <SkipForward className="h-4 w-4" />
          </Button>

          <Button
            className="h-10 w-10 border-2 rounded-full"
            variant="outline"
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>

          <Button
            className="h-10 w-10 border-2 rounded-full"
            variant="outline"
            size="icon"
            onClick={() => setShowQrCode(!showQrCode)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
        <p className="max-w-[150px] font-extrabold text-medium">
          A project by AYATI LINK © {new Date().getFullYear()}
        </p>

        {/* Footer */}
        <footer className="relative z-10 p-4 text-center text-sm">
          <div className="flex justify-center gap-4 mb-2">
            <button className="bg-white  rounded-3xl p-3 shadow-2xl font-medium text-sm">
              AJOUTER À CHROME
            </button>
            <button className="bg-white rounded-3xl p-3 shadow-2xl font-medium text-sm">
              S&apos;ABONNER
            </button>
          </div>
          <div className="flex justify-center items-center gap-6">
            <p className="max-w-[150px] font-extrabold text-medium">
              A project by AYATI LINK © {new Date().getFullYear()}
            </p>
            <Image src="/link.png" alt="lint" width={60} height={40} />
          </div>
        </footer>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-4">
            <h2 className="text-xl font-bold mb-4">Scanner un QR Code</h2>
            <QrScanner
              onResult={handleQrSuccess}
              onClose={() => setShowScanner(false)}
            />
          </div>
        </div>
      )}

      {/* QR Code Generator Modal */}
      {showQrCode && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-4">
            <h2 className="text-xl font-bold mb-4">Scannez ce QR Code</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Scannez ce QR code pour ouvrir cette application sur votre
              appareil
            </p>
            <QrGenerator
              url={
                typeof window !== "undefined"
                  ? window.location.href
                  : "https://ayati-link.vercel.app"
              }
              onClose={() => setShowQrCode(false)}
            />
          </div>
        </div>
      )}
    </main>
  );
}
