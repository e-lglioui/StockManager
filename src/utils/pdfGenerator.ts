import type { Product } from "../types/api"
import * as Print from "expo-print"
import * as FileSystem from "expo-file-system"

export const generatePDF = async (product: Product): Promise<string> => {
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: 'Helvetica', sans-serif; }
          h1 { color: #333; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>${product.name} - Product Report</h1>
        <table>
          <tr><th>ID</th><td>${product.id}</td></tr>
          <tr><th>Name</th><td>${product.name}</td></tr>
          <tr><th>Type</th><td>${product.type}</td></tr>
          <tr><th>Price</th><td>$${product.price}</td></tr>
          <tr><th>Supplier</th><td>${product.supplier}</td></tr>
          <tr><th>Barcode</th><td>${product.barcode}</td></tr>
        </table>
        <h2>Stock Information</h2>
        <table>
          <tr><th>Warehouse</th><th>City</th><th>Quantity</th></tr>
          ${product.stocks
            .map(
              (stock) => `
            <tr>
              <td>${stock.name}</td>
              <td>${stock.localisation.city}</td>
              <td>${stock.quantity}</td>
            </tr>
          `,
            )
            .join("")}
        </table>
      </body>
    </html>
  `

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent })
    const pdfContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
    return pdfContent
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error("Failed to generate PDF")
  }
}

