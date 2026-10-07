'use client';

// Opens the floating ChatBot from anywhere by dispatching a window event.
export default function ChatButton({ className = '', children }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
      className={className}
    >
      {children}
    </button>
  );
}
