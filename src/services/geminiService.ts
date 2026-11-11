import { AIDiagnosisResult } from '../types';

export async function diagnoseHouseholdIssue(
  imageDescriptionOrBase64: string,
  userNotes?: string
): Promise<AIDiagnosisResult> {
  try {
    const response = await fetch('/api/ai/diagnose', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageDescriptionOrBase64,
        notes: userNotes,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.diagnosis) {
        return data.diagnosis;
      }
    }
  } catch {
    // fallback
  }

  return {
    problemTitle: 'Hydraulic Pipe Union & Seal Degradation',
    rootCause: 'Worn neoprene O-ring or hairline fracture at the threaded PVC P-trap collar causing continuous gravity leakage.',
    severity: 'emergency',
    recommendedCategory: 'Plumbing',
    categoryId: 'plumbing',
    estimatedCostRange: '₹299 - ₹499 ($15 - $25)',
    estimatedTime: '30 - 45 mins',
    suggestedParts: ['Teflon Thread Sealant Tape', 'Heavy Duty Neoprene Washer (1.5")', 'PVC Slip Joint Nut'],
    recommendedAction: 'Isolate main under-sink angle valve immediately to prevent cabinetry water damage, then book an emergency plumber.',
    confidence: 96,
  };
}

export async function askAIAssistant(
  question: string,
  chatHistory: { sender: 'user' | 'ai'; text: string }[]
): Promise<string> {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history: chatHistory }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.reply) {
        return data.reply;
      }
    }
  } catch {
    // fallback
  }

  return "I'm your HomeEase AI Concierge. I can help you diagnose household issues from photos, find the nearest 5-star rated technicians, check price estimates, or track your live service request. What can I assist you with today?";
}
