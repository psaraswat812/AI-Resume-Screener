import pdfplumber
from docx import Document


# Extract text from PDF
def extract_text_from_pdf(file_path):

    text = ""

    with pdfplumber.open(file_path) as pdf:

        for page in pdf.pages:
            extracted_text = page.extract_text()

            if extracted_text:
                text += extracted_text + "\n"

    return text


# Extract text from DOCX
def extract_text_from_docx(file_path):

    doc = Document(file_path)

    text = ""

    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"

    return text