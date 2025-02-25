"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * A custom hook for using speech recognition in the browser
 * @returns {Object} Speech recognition control methods and state
 */
const useSpeechRecognition = () => {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState(null);

  // Check browser support for the Web Speech API
  useEffect(() => {
    const checkBrowserSupport = () => {
      const SpeechRecognitionAPI =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition ||
        window.mozSpeechRecognition ||
        window.msSpeechRecognition;

      if (SpeechRecognitionAPI) {
        setBrowserSupport(true);
        const recognition = new SpeechRecognitionAPI();

        // Configure recognition
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US"; // You can make this configurable

        setRecognitionInstance(recognition);
      } else {
        console.warn("Speech recognition not supported in this browser");
        setBrowserSupport(false);
      }
    };

    // Only run on client-side
    if (typeof window !== "undefined") {
      checkBrowserSupport();
    }

    // Cleanup
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, []);

  // Set up event listeners for the recognition instance
  useEffect(() => {
    if (!recognitionInstance) return;

    // Handle result event
    recognitionInstance.onresult = (event) => {
      let currentTranscript = "";

      // Combine all results
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }

      setTranscript(currentTranscript);
    };

    // Handle other events
    recognitionInstance.onstart = () => {
      setListening(true);
    };

    recognitionInstance.onend = () => {
      setListening(false);
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setListening(false);
    };
  }, [recognitionInstance]);

  // Start listening
  const startListening = useCallback(() => {
    if (recognitionInstance && !listening) {
      try {
        // Reset transcript when starting new recording
        setTranscript("");
        recognitionInstance.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  }, [recognitionInstance, listening]);

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionInstance && listening) {
      try {
        recognitionInstance.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
  }, [recognitionInstance, listening]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript("");
  }, []);

  // Change language
  const changeLanguage = useCallback(
    (languageCode) => {
      if (recognitionInstance) {
        recognitionInstance.lang = languageCode;
      }
    },
    [recognitionInstance],
  );

  return {
    transcript,
    listening,
    browserSupport,
    startListening,
    stopListening,
    resetTranscript,
    changeLanguage,
  };
};

export default useSpeechRecognition;
