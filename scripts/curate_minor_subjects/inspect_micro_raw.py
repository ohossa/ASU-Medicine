import fitz, re

# MCQ Micro
doc_mcq = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Microbiology/MCQ Micro .pdf')
full_mcq = '\n'.join(p.get_text() for p in doc_mcq)

# Department MCQs
doc_dept = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Microbiology/Urogenital Module - Microbiology Department MCQs.pdf')
full_dept = '\n'.join(p.get_text() for p in doc_dept)

print(f"MCQ Micro length: {len(full_mcq)}")
print(f"Department Micro length: {len(full_dept)}")
