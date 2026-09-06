// Browser SpeechSynthesis utility for hands-free polar voice briefing

let isSpeakingState = false;

export function speakText(text: string, onEnd?: () => void): boolean {
  if (!('speechSynthesis' in window)) {
    alert('Browser speech synthesis is not supported on this device.');
    return false;
  }

  window.speechSynthesis.cancel(); // cancel any active speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // slightly slower for clear radio/station acoustic
  utterance.pitch = 1.0;

  // Prefer natural English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('David') || v.name.includes('Ravi')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.onstart = () => {
    isSpeakingState = true;
  };

  utterance.onend = () => {
    isSpeakingState = false;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    isSpeakingState = false;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isSpeakingState = false;
  }
}

export function isSpeaking(): boolean {
  return isSpeakingState || ('speechSynthesis' in window && window.speechSynthesis.speaking);
}
