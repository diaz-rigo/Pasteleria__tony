import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  async createPdf(pedidoInfo: any): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const logoUrl = 'https://static.wixstatic.com/media/64de7c_4d76bd81efd44bb4a32757eadf78d898~mv2_d_1765_2028_s_2.png/v1/fill/w_243,h_270,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/64de7c_4d76bd81efd44bb4a32757eadf78d898~mv2_d_1765_2028_s_2.png';
    const footerImageUrl = 'https://static.wixstatic.com/media/64de7c_29f387abde884a1e8f9df17220933df6~mv2.png/v1/fill/w_834,h_221,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/64de7c_29f387abde884a1e8f9df17220933df6~mv2.png';

    const [logoImageBytes, footerImageBytes] = await Promise.all([
      fetch(logoUrl).then(res => res.arrayBuffer()),
      fetch(footerImageUrl).then(res => res.arrayBuffer())
    ]);

    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const footerImage = await pdfDoc.embedPng(footerImageBytes);

    const logoDims = logoImage.scale(0.2);
    const footerDims = footerImage.scale(0.25);

    const fontTimesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const fontTimesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Dibujar logo
    page.drawImage(logoImage, {
      x: page.getWidth() / 2 - logoDims.width / 2,
      y: page.getHeight() - logoDims.height - 20,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Encabezado con estilo
    page.drawText('Repostería Austins', {
      x: 50,
      y: 750,
      size: 24,
      font: fontTimesRomanBold,
      color: rgb(0.67, 0.44, 0.22), // Color #AB7038
    });

    page.drawText('Confirmación de Pedido', {
      x: 50,
      y: 720,
      size: 18,
      font: fontTimesRomanBold,
      color: rgb(0.44, 0.22, 0.14), // Color #703824
    });

    page.drawText('Este documento sirve como confirmación de su pedido realizado en Repostería Austins. Puede consultar el estado del pedido en la sección "Consultar Estado Pedido" en nuestro sitio web, o presentarlo en nuestro local para obtener información sobre su pedido.', {
      x: 50,
      y: 690,
      size: 12,
      font: fontTimesRoman,
      color: rgb(0.3, 0.3, 0.3),
      maxWidth: 500,
    });

    // Añadir un párrafo sobre la importancia del documento
    page.drawText('IMPORTANTE: Este documento es crucial para el seguimiento de su pedido. Si realizó el pedido a la hora indicada, puede pasar a recoger su pedido en el local. Si prefiere, puede esperar a que nuestro personal asignado se comunique con usted para darle el seguimiento correspondiente.', {
      x: 50,
      y: 90,
      size: 12,
      font: fontTimesRomanBold,
      color: rgb(0.8, 0.2, 0.2),
      maxWidth: 500,
    });

    // Dibujar un cuadro de información con borde y sombra
    page.drawRectangle({
      x: 45,
      y: 180,
      width: 510,
      height: 450,
      borderColor: rgb(0.67, 0.44, 0.22), // Color #AB7038
      borderWidth: 2,
      opacity: 0.2,
    });

    // Información del pedido con sombra y mejor posicionamiento
    const yStart = 620;
    const lineHeight = 25;
    const fields = [
      { label: 'Código de Pedido:', value: pedidoInfo.codigoPedido },
      { label: 'Usuario:', value: pedidoInfo.usuario.name },
      { label: 'Nombre:', value: pedidoInfo.usuario.name },
      { label: 'Email:', value: pedidoInfo.usuario.email },
      { label: 'Teléfono:', value: pedidoInfo.usuario.phone },
      { label: 'Detalle del Pedido:', value: '' },
      { label: 'Cantidad:', value: String(pedidoInfo.detallePedido.cantidad) },
      { label: 'Día:', value: pedidoInfo.detallePedido.dia },
      { label: 'Hora:', value: pedidoInfo.detallePedido.hora },
      { label: 'Modo:', value: pedidoInfo.detallePedido.modo },
      { label: 'Sabor:', value: pedidoInfo.detallePedido.sabor },
      { label: 'Precio Total:', value: String(pedidoInfo.detallePedido.precioTotal) },
      { label: 'Estado del Pedido:', value: pedidoInfo.estadoPedido },
      { label: 'Fecha de Creación:', value: pedidoInfo.createdAt },
    ];

    let y = yStart;
    fields.forEach(field => {
      page.drawText(field.label, {
        x: 60,
        y: y,
        size: 14,
        font: fontTimesRomanBold,
        color: rgb(0, 0, 0),
      });
      page.drawText(field.value, {
        x: 200,
        y: y,
        size: 14,
        font: fontTimesRoman,
        color: rgb(0, 0, 0),
      });
      y -= lineHeight;
    });

    // Agregar una línea decorativa en el pie de página
    page.drawLine({
      start: { x: 50, y: 10 },
      end: { x: 550, y: 10 },
      thickness: 1,
      color: rgb(0.44, 0.22, 0.14), // Color #703824
      opacity: 0.5,
    });

    // Agregar pie de página con imagen sobre la línea
    page.drawImage(footerImage, {
      x: page.getWidth() / 2 - footerDims.width / 2,
      y: 20,
      width: footerDims.width,
      height: footerDims.height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `${pedidoInfo.codigoPedido}.pdf`);
  }
}
