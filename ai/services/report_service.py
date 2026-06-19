import os
from typing import Dict, Any, List
from ai.core.logging import logger

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    REPORTLAB_AVAILABLE = True
except ImportError:
    REPORTLAB_AVAILABLE = False


class ReportService:
    def __init__(self):
        # Create output directory for PDF downloads
        os.makedirs("downloads", exist_ok=True)

    def generate_pdf_report(self, report_id: str, data: Dict[str, Any]) -> str:
        """
        Generates a beautifully structured PDF document summarizing project metrics,
        safety incidents, or BOQ estimates.
        """
        output_path = f"downloads/report_{report_id}.pdf"
        title = data.get("title", "BuildSpace AI Executive Report")
        summary = data.get("summary", "No summary provided.")
        sections = data.get("sections", [])
        
        # If ReportLab is not available, we write a mock txt and rename to pdf, or log
        if not REPORTLAB_AVAILABLE:
            logger.warning("ReportLab not installed. Writing HTML-formatted report draft.")
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(f"<h1>{title}</h1><p>{summary}</p>")
                for sec in sections:
                    f.write(f"<h2>{sec.get('heading')}</h2><p>{sec.get('body')}</p>")
            return output_path

        try:
            doc = SimpleDocTemplate(output_path, pagesize=letter)
            styles = getSampleStyleSheet()
            
            # Custom styling for premium look
            title_style = ParagraphStyle(
                'DocTitle',
                parent=styles['Heading1'],
                textColor=colors.HexColor('#1E293B'), # Slate 800
                fontSize=24,
                leading=28,
                spaceAfter=15
            )
            
            body_style = ParagraphStyle(
                'DocBody',
                parent=styles['BodyText'],
                textColor=colors.HexColor('#475569'), # Slate 600
                fontSize=10,
                leading=14,
                spaceAfter=10
            )

            heading_style = ParagraphStyle(
                'SectionHeading',
                parent=styles['Heading2'],
                textColor=colors.HexColor('#0F172A'), # Slate 900
                fontSize=14,
                leading=18,
                spaceBefore=12,
                spaceAfter=8
            )

            story = []
            
            # Header
            story.append(Paragraph(title, title_style))
            story.append(Spacer(1, 10))
            story.append(Paragraph(f"<b>Executive Summary:</b> {summary}", body_style))
            story.append(Spacer(1, 15))
            
            # Add dynamic sections
            for section in sections:
                heading = section.get("heading", "")
                body = section.get("body", "")
                table_data = section.get("table", [])
                
                story.append(Paragraph(heading, heading_style))
                
                if body:
                    story.append(Paragraph(body, body_style))
                    
                if table_data:
                    # Draw a nice Slate styled table
                    # Convert raw dicts to list of strings
                    table_rows = []
                    # Check headers
                    if len(table_data) > 0 and isinstance(table_data[0], dict):
                        headers = list(table_data[0].keys())
                        table_rows.append([Paragraph(f"<b>{h.upper()}</b>", body_style) for h in headers])
                        for row in table_data:
                            table_rows.append([Paragraph(str(row.get(h, "")), body_style) for h in headers])
                            
                    if table_rows:
                        t = Table(table_rows, colWidths=[150, 100, 100, 100])
                        t.setStyle(TableStyle([
                            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#F1F5F9')),
                            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                            ('BOTTOMPADDING', (0,0), (-1,0), 8),
                            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
                            ('TOPPADDING', (0,0), (-1,-1), 6),
                            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                        ]))
                        story.append(t)
                        
                story.append(Spacer(1, 10))
                
            doc.build(story)
            logger.info(f"PDF report generated at: {output_path}")
            return output_path
        except Exception as e:
            logger.error(f"Failed to compile PDF report: {e}")
            # Fallback file creation
            with open(output_path, "w") as f:
                f.write(f"Report: {title}\nSummary: {summary}")
            return output_path

report_service = ReportService()
