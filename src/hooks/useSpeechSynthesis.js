"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * A custom hook for text-to-speech functionality
 * @returns {Object} Speech synthesis control methods and state
 */
const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSupported(true);

      // Get available voices
      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);

        // Set default voice (prefer female voices if available)
        if (availableVoices.length > 0) {
          const femaleVoice = availableVoices.find(
            (voice) =>
              voice.name.includes("female") ||
              voice.name.includes("Female") ||
              voice.name.toLowerCase().includes("karen"),
          );

          setSelectedVoice(femaleVoice || availableVoices[0]);
        }
      };

      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }

      updateVoices();

      // Cleanup
      return () => {
        if (speaking) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      setSupported(false);
    }
  }, [speaking]);

  // Speak text
  const speak = useCallback(
    (text, options = {}) => {
      if (!supported) return;

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Set voice
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Set options
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      // Set language based on voice or default
      utterance.lang =
        options.lang || (selectedVoice ? selectedVoice.lang : "en-US");

      // Events
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = (event) => {
        console.error("Speech synthesis error", event);
        setSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    },
    [supported, selectedVoice],
  );

  // Stop speaking
  const cancel = useCallback(() => {
    if (supported) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, [supported]);

  // Change voice
  const changeVoice = useCallback(
    (voice) => {
      if (voice && voices.includes(voice)) {
        setSelectedVoice(voice);
      }
    },
    [voices],
  );

  // Get voice by language
  const getVoiceForLanguage = useCallback(
    (langCode) => {
      if (!voices.length) return null;

      // Try to find voice matching language code
      return (
        voices.find((voice) => voice.lang === langCode) ||
        voices.find((voice) => voice.lang.startsWith(langCode.split("-")[0])) ||
        voices[0]
      );
    },
    [voices],
  );

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices,
    selectedVoice,
    changeVoice,
    getVoiceForLanguage,
  };
};

export default useSpeechSynthesis;
