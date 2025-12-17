import Tesseract from "tesseract.js";

// Convert an image buffer → text
export const extractTextFromImage = async (buffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(buffer, "eng", {
      tessedit_char_blacklist: "|{}[]<>",
    });

    return text || "";
  } catch (err) {
    console.error("OCR error:", err);
    return "";
  }
};
