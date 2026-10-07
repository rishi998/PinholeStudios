export const WHATSAPP_NUMBER = "918506905757"; // +91 85069 05757

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
