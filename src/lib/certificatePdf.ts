import { jsPDF } from 'jspdf';
import { CertificateData } from '../types';

/**
 * Automated High-Resolution PDF Certificate Generator
 * Generates an official, verifiable A4 Landscape Certificate with elegant typography,
 * borders, university seal, verification QR metadata, and authorized signatures.
 */
export async function generateCertificatePdf(cert: CertificateData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background Wash
  doc.setFillColor(253, 251, 247);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Outer Deep Emerald Border
  doc.setDrawColor(15, 60, 45);
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Inner Ornate Gold Border
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(0.6);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner Accent Marks
  const cornerSize = 8;
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(1.2);
  // Top-left
  doc.line(16, 16, 16 + cornerSize, 16);
  doc.line(16, 16, 16, 16 + cornerSize);
  // Top-right
  doc.line(pageWidth - 16, 16, pageWidth - 16 - cornerSize, 16);
  doc.line(pageWidth - 16, 16, pageWidth - 16, 16 + cornerSize);
  // Bottom-left
  doc.line(16, pageHeight - 16, 16 + cornerSize, pageHeight - 16);
  doc.line(16, pageHeight - 16, 16, pageHeight - 16 - cornerSize);
  // Bottom-right
  doc.line(pageWidth - 16, pageHeight - 16, pageWidth - 16 - cornerSize, pageHeight - 16);
  doc.line(pageWidth - 16, pageHeight - 16, pageWidth - 16, pageHeight - 16 - cornerSize);

  // Institution Header
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 60, 45);
  doc.setFontSize(13);
  doc.text('UDON THANI RAJABHAT UNIVERSITY', pageWidth / 2, 32, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('LIFELONG LEARNING & COMPETENCY DEVELOPMENT INITIATIVE', pageWidth / 2, 38, { align: 'center' });

  // Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 130, 40);
  doc.setFontSize(24);
  doc.text('CERTIFICATE OF ACHIEVEMENT', pageWidth / 2, 54, { align: 'center' });

  // Subtitle / Recipient intro
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.text('This is to certify that', pageWidth / 2, 68, { align: 'center' });

  // Recipient Name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(26);
  doc.text(cert.studentName, pageWidth / 2, 84, { align: 'center' });

  // Decorative Rule below Name
  doc.setDrawColor(200, 160, 60);
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 60, 89, pageWidth / 2 + 60, 89);

  // Completion statement
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(11);
  doc.text('has successfully completed the comprehensive curriculum and passed all assessments for', pageWidth / 2, 100, { align: 'center' });

  // Course Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 60, 45);
  doc.setFontSize(16);
  doc.text(`"${cert.courseTitle}"`, pageWidth / 2, 112, { align: 'center' });

  // Metrics (Score & Date)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(10);
  doc.text(`Achieved Mastery Score: ${cert.gradeScore}%  |  Issued on: ${cert.issueDate}`, pageWidth / 2, 122, { align: 'center' });

  // Signature Block Left
  const sigLeftX = 65;
  const sigRightX = pageWidth - 65;
  const sigY = 160;

  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.line(sigLeftX - 35, sigY, sigLeftX + 35, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text(cert.instructorName, sigLeftX, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Lead Instructor & Curriculum Director', sigLeftX, sigY + 9, { align: 'center' });

  // Signature Block Right
  doc.line(sigRightX - 35, sigY, sigRightX + 35, sigY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10);
  doc.text('Prof. Dr. Aphisit Vachiramethakul', sigRightX, sigY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('President & Dean of Academic Affairs', sigRightX, sigY + 9, { align: 'center' });

  // Golden Seal Center
  doc.setFillColor(245, 205, 95);
  doc.setDrawColor(200, 160, 60);
  doc.circle(pageWidth / 2, 158, 14, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 60, 45);
  doc.setFontSize(7);
  doc.text('OFFICIAL', pageWidth / 2, 156, { align: 'center' });
  doc.text('UDRU SEAL', pageWidth / 2, 160, { align: 'center' });
  doc.text('VERIFIED', pageWidth / 2, 164, { align: 'center' });

  // Footer Metadata & Verification Code
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.text(`Certificate ID: ${cert.certificateId}   |   Verification: https://social-engineers.org/verify/${cert.certificateId}`, pageWidth / 2, 192, { align: 'center' });

  // Clean filename
  const safeName = (cert.studentName || 'Student').replace(/[^a-zA-Z0-9_\u0E00-\u0E7F]/g, '_');
  doc.save(`Certificate_${safeName}_${cert.certificateId}.pdf`);
}
