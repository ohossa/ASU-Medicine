import fitz, re

doc = fitz.open('/Users/omarhossa/Documents/Pulse Questions/Year 3/Semester 1/Urogenital/Pathology/Urogenital Module - MCQ and CASES in Pathology - Dr. Thanaa Helal.pdf')

# Load keys
key_dict = {}
for pno in range(53, 58):
    text = doc[pno].get_text()
    matches = re.findall(r'\((\d+)\)\s+([A-Ea-eTFtf])', text)
    for qnum, ans in matches:
        key_dict[int(qnum)] = ans.upper()

# Sample questions from Chapter 15 (Urinary)
p3_text = doc[2].get_text()
print("Page 3 sample text:")
print(p3_text[:500])

