/**
 * Helper to dynamically load PDF.js from CDN and render page 1 of a PDF to a high-res image data URL.
 */

let pdfjsPromise = null;

export async function loadPdfJs() {
  if (typeof window === "undefined") return null;
  if (window.pdfjsLib) return window.pdfjsLib;

  if (pdfjsPromise) return pdfjsPromise;

  pdfjsPromise = new Promise((resolve, reject) => {
    // Check if script tag already exists in document
    const existing = document.getElementById("pdfjs-cdn-script");
    if (existing) {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
      } else {
        existing.addEventListener("load", () => resolve(window.pdfjsLib));
        existing.addEventListener("error", reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "pdfjs-cdn-script";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    script.async = true;

    script.onload = () => {
      try {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
          resolve(window.pdfjsLib);
        } else {
          reject(new Error("pdfjsLib not found on window"));
        }
      } catch (err) {
        reject(err);
      }
    };

    script.onerror = (err) => {
      pdfjsPromise = null;
      reject(err);
    };

    document.head.appendChild(script);
  });

  return pdfjsPromise;
}

/**
 * Converts a base64 data URL to a Uint8Array
 */
function dataUrlToUint8Array(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Renders the first page of a PDF into a high-res JPEG data URL.
 * Accepts a File, ArrayBuffer, base64 data URL, or standard URL.
 */
export async function renderPdfFirstPageToImage(pdfSource, targetWidth = 1400) {
  try {
    const pdfjsLib = await loadPdfJs();
    if (!pdfjsLib) return null;

    let loadingTask;

    if (typeof window !== "undefined" && window.File && pdfSource instanceof window.File) {
      const arrayBuffer = await pdfSource.arrayBuffer();
      loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    } else if (typeof pdfSource === "string" && pdfSource.startsWith("data:")) {
      const bytes = dataUrlToUint8Array(pdfSource);
      loadingTask = pdfjsLib.getDocument({ data: bytes });
    } else if (pdfSource instanceof ArrayBuffer || pdfSource instanceof Uint8Array) {
      loadingTask = pdfjsLib.getDocument({ data: pdfSource });
    } else if (typeof pdfSource === "string") {
      loadingTask = pdfjsLib.getDocument({ url: pdfSource });
    } else {
      return null;
    }

    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);

    const unscaledViewport = page.getViewport({ scale: 1 });
    const scale = Math.max(1, targetWidth / unscaledViewport.width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext("2d", { alpha: false });

    // Fill with white background before rendering PDF
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL("image/jpeg", 0.92);
  } catch (err) {
    console.error("PDF rendering error:", err);
    return null;
  }
}
