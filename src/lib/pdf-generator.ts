import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { JobRequest } from '@/types/job-request';

export async function generatePDF(request: JobRequest) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // Title
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Job Request Report', margin, yPosition);
  yPosition += 10;

  // Request Number
  pdf.setFontSize(14);
  pdf.text(`Request #${request.request_number}`, margin, yPosition);
  yPosition += 10;

  // Divider line
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 8;

  // Request Details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Request Details', margin, yPosition);
  yPosition += 7;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);

  const details = [
    { label: 'Requesting Person:', value: request.requesting_person },
    { label: 'Request Date:', value: new Date(request.request_date).toLocaleDateString() },
    { label: 'Status:', value: request.status },
    { label: 'Date Completed:', value: request.date_completed ? new Date(request.date_completed).toLocaleDateString() : 'N/A' },
    { label: 'File Path:', value: request.file_path || 'N/A' },
    { label: 'File Name:', value: request.file_name || 'N/A' },
    { label: 'Material Type:', value: request.material_type || 'N/A' },
    { label: 'Quantity:', value: request.quantity?.toString() || 'N/A' },
    { label: 'Assigned To:', value: request.assigned_to || 'N/A' },
  ];

  details.forEach((detail) => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(detail.label, margin, yPosition);
    pdf.setFont('helvetica', 'normal');
    pdf.text(detail.value, margin + 50, yPosition);
    yPosition += 6;
  });

  // Add image if exists
  if (request.image_url) {
    yPosition += 5;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Part Image:', margin, yPosition);
    yPosition += 7;

    try {
      // Load image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = request.image_url!;
      });

      // Calculate image dimensions to fit on page
      const maxWidth = pageWidth - (2 * margin);
      const maxHeight = pageHeight - yPosition - margin;
      
      let imgWidth = img.width;
      let imgHeight = img.height;
      
      // Scale down if needed
      if (imgWidth > maxWidth) {
        const ratio = maxWidth / imgWidth;
        imgWidth = maxWidth;
        imgHeight = imgHeight * ratio;
      }
      
      if (imgHeight > maxHeight) {
        const ratio = maxHeight / imgHeight;
        imgHeight = maxHeight;
        imgWidth = imgWidth * ratio;
      }

      // Convert pixels to mm (assuming 96 DPI)
      const widthMM = (imgWidth * 25.4) / 96;
      const heightMM = (imgHeight * 25.4) / 96;

      // Add image to PDF
      pdf.addImage(img, 'JPEG', margin, yPosition, widthMM, heightMM);
    } catch (error) {
      console.error('Error adding image to PDF:', error);
      pdf.text('(Image could not be loaded)', margin, yPosition);
    }
  }

  // Footer
  const footerY = pageHeight - 10;
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'italic');
  pdf.text(
    `Generated on ${new Date().toLocaleString()}`,
    margin,
    footerY
  );

  // Save PDF
  pdf.save(`Job_Request_${request.request_number}.pdf`);
}