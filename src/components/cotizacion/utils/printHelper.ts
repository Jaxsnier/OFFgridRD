/**
 * Robust printing engine for web apps running in an iframe (e.g. AI Studio preview)
 * or in standalone mode.
 *
 * In iframes, calling directly `window.print()` is frequently blocked by browsers
 * due to sandbox restrictions or causes an empty parent window freeze.
 *
 * This utility:
 * 1. Clones the target DOM element.
 * 2. Inlines all styles/CSS classes.
 * 3. Opens a clean, dedicated popup print window with full print dialogue automatically triggered.
 * 4. Provides a hidden printable overlay fallback if popup is blocked.
 */
export const printElementById = (elementId: string, documentTitle: string = 'Cotizacion_OFFgridRD') => {
    const targetElement = document.getElementById(elementId);
    if (!targetElement) {
        console.error(`Element with id "${elementId}" not found for printing.`);
        window.print();
        return;
    }

    const contentHtml = targetElement.innerHTML;

    // Collect all stylesheet links and style tags from current document
    const headNodes = Array.from(document.head.querySelectorAll('link[rel="stylesheet"], style'))
        .map(node => node.outerHTML)
        .join('\n');

    const printHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${documentTitle}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Tailwind and styles -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    ${headNodes}
    <style>
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        html, body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
        }
        @page {
            size: portrait;
            margin: 8mm 10mm;
        }
        @media print {
            html, body {
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background-color: #ffffff !important;
            }
            .print-page-wrapper {
                width: 100% !important;
                min-height: 258mm !important;
                height: 258mm !important;
                max-height: 260mm !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
                margin: 0 auto !important;
                padding: 0 !important;
                box-sizing: border-box !important;
            }
            .signatures-block {
                margin-top: auto !important;
                padding-top: 16px !important;
            }
            .print\\:hidden, button, .no-print {
                display: none !important;
            }
            tr, td, th {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }
        }
    </style>
</head>
<body>
    <div class="print-page-wrapper max-w-4xl mx-auto bg-white text-slate-900 p-2 sm:p-4">
        ${contentHtml}
    </div>
    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                try {
                    window.focus();
                    window.print();
                } catch(e) {
                    console.error('Print trigger failed in window', e);
                }
            }, 400);
        });
    </script>
</body>
</html>
    `.trim();

    // Strategy 1: Dedicated popup window (cleanest print dialog & PDF output in modern browsers)
    let printWindow: Window | null = null;
    try {
        printWindow = window.open('', '_blank', 'width=950,height=800,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes');
    } catch (e) {
        console.warn('window.open blocked or threw error:', e);
    }

    if (printWindow && !printWindow.closed) {
        try {
            printWindow.document.open();
            printWindow.document.write(printHtml);
            printWindow.document.close();
            return;
        } catch (e) {
            console.warn('Writing to popup window failed, falling back to hidden iframe:', e);
        }
    }

    // Strategy 2: Sandboxed Hidden Iframe fallback
    const iframe = document.createElement('iframe');
    iframe.id = 'temp-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '10px';
    iframe.style.height = '10px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = 'none';

    document.body.appendChild(iframe);

    try {
        const frameDoc = iframe.contentWindow?.document || iframe.contentDocument;
        if (frameDoc) {
            frameDoc.open();
            frameDoc.write(printHtml);
            frameDoc.close();

            const triggerIframePrint = () => {
                setTimeout(() => {
                    try {
                        iframe.contentWindow?.focus();
                        iframe.contentWindow?.print();
                    } catch (err) {
                        console.warn('Iframe print error, calling parent window.print()', err);
                        window.print();
                    } finally {
                        setTimeout(() => {
                            if (document.body.contains(iframe)) {
                                document.body.removeChild(iframe);
                            }
                        }, 2500);
                    }
                }, 350);
            };

            if (iframe.contentWindow) {
                iframe.contentWindow.onload = triggerIframePrint;
            } else {
                triggerIframePrint();
            }
            return;
        }
    } catch (err) {
        console.warn('Iframe write failed, falling back to window.print():', err);
    }

    // Strategy 3: Direct window.print()
    window.print();
};
