export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date | string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string | null;
  clientPhone?: string | null;
  prestation: string;
  priceHT: number;
  tvaRate: number;
  priceTTC: number;
}

export function generateInvoiceHtml(invoice: InvoiceData, autoPrint = false): string {
  const date = new Date(invoice.invoiceDate);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const tvaAmount = invoice.priceTTC - invoice.priceHT;

  const fmt = (n: number) => n.toFixed(2).replace(".", ",") + " €";

  const lines = invoice.prestation
    .split("\n")
    .filter(Boolean)
    .map((l) => l.trim());

  const prestationRows = lines.length > 1
    ? lines.map((line, i) => `
      <tr>
        <td style="padding:10px 0;font-size:13px;border-bottom:1px solid #f5f5f5;vertical-align:top;">${line}</td>
        ${i === 0 ? `<td rowspan="${lines.length}" style="padding:10px 0;font-size:13px;border-bottom:1px solid #f5f5f5;text-align:right;vertical-align:top;">${fmt(invoice.priceHT)}</td>` : ""}
      </tr>`).join("")
    : `<tr>
        <td style="padding:14px 0;font-size:13px;border-bottom:1px solid #f5f5f5;vertical-align:top;">${invoice.prestation.replace(/\n/g, "<br>")}</td>
        <td style="padding:14px 0;font-size:13px;border-bottom:1px solid #f5f5f5;text-align:right;vertical-align:top;">${fmt(invoice.priceHT)}</td>
      </tr>`;

  const printScript = autoPrint
    ? `<script>window.onload=function(){window.print();}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Facture ${invoice.invoiceNumber}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  body{font-family:Arial,Helvetica,sans-serif;color:#111;background:#fff;padding:48px;}
  @media print{
    body{padding:0;}
    @page{margin:15mm;}
    .no-print{display:none!important;}
  }
</style>
${printScript}
</head>
<body>
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
  <tr>
    <td style="vertical-align:top;">
      <div style="font-size:52px;font-weight:900;text-transform:uppercase;color:#111;letter-spacing:-2px;line-height:1;">FACTURE</div>
      <div style="font-size:13px;color:#777;margin-top:8px;">N° <strong>${invoice.invoiceNumber}</strong></div>
      <div style="font-size:13px;color:#777;margin-top:4px;">Date : ${formattedDate}</div>
    </td>
    <td style="vertical-align:top;text-align:right;">
      <div style="font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:3px;color:#111;">PAGA</div>
      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:3px;color:#888;margin-top:2px;">PRODUCTION</div>
    </td>
  </tr>
</table>

<hr style="border:none;border-top:2px solid #111;margin-bottom:32px;">

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
  <tr>
    <td width="50%" style="vertical-align:top;padding-right:40px;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:12px;font-weight:700;">Émetteur</div>
      <div style="font-size:13px;line-height:1.8;">
        <strong>AP MANAGEMENT</strong><br>
        Anthony PAGGINI<br>
        40 Avenue de Saint-Antoine<br>
        13015 Marseille, France<br>
        SIRET : 837 496 629 00044
      </div>
    </td>
    <td width="50%" style="vertical-align:top;padding-left:40px;border-left:1px solid #eee;">
      <div style="font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#aaa;margin-bottom:12px;font-weight:700;">Destinataire</div>
      <div style="font-size:13px;line-height:1.8;">
        <strong>${invoice.clientName}</strong><br>
        ${invoice.clientEmail}<br>
        ${invoice.clientPhone ? invoice.clientPhone + "<br>" : ""}
        ${invoice.clientAddress ? invoice.clientAddress : ""}
      </div>
    </td>
  </tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
  <thead>
    <tr>
      <th style="text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;padding:10px 0;border-bottom:1px solid #ddd;font-weight:700;">Désignation</th>
      <th style="text-align:right;font-size:9px;text-transform:uppercase;letter-spacing:1.5px;color:#aaa;padding:10px 0;border-bottom:1px solid #ddd;font-weight:700;">Total HT</th>
    </tr>
  </thead>
  <tbody>
    ${prestationRows}
  </tbody>
</table>

<table cellpadding="0" cellspacing="0" style="margin-left:auto;width:280px;margin-bottom:48px;">
  <tr>
    <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">Sous-total HT</td>
    <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${fmt(invoice.priceHT)}</td>
  </tr>
  <tr>
    <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f0;color:#555;">TVA (${invoice.tvaRate}%)</td>
    <td style="font-size:13px;padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${fmt(tvaAmount)}</td>
  </tr>
  <tr>
    <td style="font-size:17px;font-weight:900;padding:14px 0 0;border-top:2px solid #111;">TOTAL TTC</td>
    <td style="font-size:17px;font-weight:900;padding:14px 0 0;border-top:2px solid #111;text-align:right;">${fmt(invoice.priceTTC)}</td>
  </tr>
</table>

<div style="border-top:1px solid #eee;padding-top:20px;margin-top:auto;">
  <p style="font-size:10px;color:#aaa;line-height:1.7;margin-bottom:16px;">
    En cas de retard de paiement, une pénalité calculée sur la base de 3 fois le taux d'intérêt légal sera exigible, ainsi qu'une indemnité forfaitaire pour frais de recouvrement de 40 euros (art. L441-10 du Code de commerce). Taux d'escompte : aucun escompte pour paiement anticipé.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td style="font-size:10px;color:#ccc;">AP MANAGEMENT — Anthony PAGGINI — SIRET 837 496 629 00044</td>
      <td style="font-size:10px;color:#ccc;text-align:right;">40 Avenue de Saint-Antoine, 13015 Marseille</td>
    </tr>
  </table>
</div>
</body>
</html>`;
}
