import React from 'react';
import { AIVoicePopup } from './AIVoicePopup';

/**
 * Talentio AI Assistant Background Shell:
 * The voice assistant remains completely invisible on the screen until invoked by the wake-word
 * ("Talentio" / "Hey Talentio" / "ট্যালেন্টিও") or triggered from within the chat messenger.
 * The floating UI buttons and chatbots are removed as requested, moving text interactions
 * directly into the Messenger like Meta AI.
 */
export const TalentioAIAssistant: React.FC = () => {
  return <AIVoicePopup />;
};
