import fitz, re

# ALAA
doc_alaa = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pharmacology/ALAA uro mcq.pdf')
text_alaa = '\n'.join(p.get_text() for p in doc_alaa)

# Part 3 and 4
doc_p34 = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pharmacology/essay questions and MCQs urogenital part 3 and 4.pdf')
text_p34 = '\n'.join(p.get_text() for p in doc_p34[2:]) # MCQs start on page 3

print("ALAA length:", len(text_alaa))
print("Part 3&4 length:", len(text_p34))
