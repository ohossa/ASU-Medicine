# Run from the repository root. Original local educational illustrations.
from pathlib import Path
from html import escape
root=Path('public/cases')
def text(x,y,t,size=18,color='#9baec4'):return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}">{escape(t)}</text>'
def path(d,c='#42d8c1',w=4,fill='none'):return f'<path d="{d}" stroke="{c}" stroke-width="{w}" fill="{fill}" stroke-linecap="round" stroke-linejoin="round"/>'
def circ(x,y,r,fill,stroke='none'):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="3"/>'
brain='<ellipse cx="400" cy="225" rx="170" ry="145" fill="#17293d" stroke="#6d83a4" stroke-width="3"/>'+path('M400 95 V365','#6d83a4',2)+path('M310 155 Q350 180 315 220 T325 295 M490 155 Q450 180 485 220 T475 295','#314d70',5)
eye=path('M170 250 Q360 60 630 250 Q360 435 170 250','#8ba0ba',4,'#17293d')+circ(400,250,70,'#154b50','#42d8c1')+circ(400,250,30,'#09111f')
data={
'meningitis_lp':('Lumbar puncture reference', ''.join(f'<rect x="330" y="{110+i*52}" width="95" height="35" rx="10" fill="#314d70"/>' for i in range(5))+path('M455 100 V365','#9b84f5',12)+path('M640 280 L450 280','#fbbf24',4)+text(515,265,'Needle approach',16)+text(105,215,'Lumbar vertebrae',16)+text(470,345,'CSF space',16)),
'stroke_mri':('Cerebral vascular territory reference',brain+path('M480 175 L535 225 L490 285 L435 255 Z','#f5af58',3,'#5d4027')+text(242,403,'Axial anatomical schematic · not an MRI',16)),
'ms_mri':('White matter reference',brain+circ(367,205,20,'#42d8c1')+circ(431,240,14,'#9b84f5')+path('M340 215 Q400 145 460 215','#8299b5',4)+text(190,403,'Illustrated locations · not a diagnostic scan',16)),
'parkinson_dat':('Striatal uptake reference',brain+path('M350 175 Q310 200 350 275','#fbbf24',18)+path('M450 175 Q485 200 454 230','#fbbf24',12)+text(270,403,'Schematic only · uptake is illustrative',16)),
'status_eeg':('EEG reference', ''.join(path('M'+ ' L'.join(f'{60+i*12} {170+row*65+([0,4,-6,8,-23,28,-8,3][i%8])}' for i in range(57)), '#42d8c1',2) for row in range(3))+text(70,380,'Illustrative electrical tracing · not a patient EEG',16)),
'glaucoma_gonioscopy':('Anterior chamber reference',eye+path('M235 220 Q270 250 235 280','#fbbf24',6)+path('M205 215 L285 195 M205 285 L285 305','#9b84f5',3)+text(270,403,'Cornea, iris and drainage angle · schematic',16)),
'retinal_detachment':('Retinal layers reference',path('M180 145 Q680 190 590 365','#8299b5',14)+path('M180 170 Q420 210 555 345','#fbbf24',8)+path('M180 170 Q300 200 370 265 Q460 295 555 345','#42d8c1',6)+text(200,400,'Retina separated from its supporting layer',16)),
'amd_oct':('Macular cross-section reference',path('M70 180 Q280 180 400 210 Q520 180 730 180','#8299b5',15)+path('M70 220 Q280 220 400 250 Q520 220 730 220','#9b84f5',12)+path('M70 290 L300 290 Q330 240 360 290 Q405 225 450 290 L730 290','#fbbf24',8)+text(200,403,'Layered retinal illustration · not a patient OCT',16)),
'aom_otoscopy':('Tympanic membrane reference',circ(400,240,145,'#613241','#c47779')+path('M375 155 L410 260 L440 280','#f0c1a7',10)+path('M270 285 Q400 345 525 280','#9e5062',6)+text(220,403,'Stylized otoscopic view · educational illustration',16)),
'ssnhl_audiometry':('Pure-tone audiometry reference',path('M130 110 V350 H680','#8299b5',2)+path('M145 155 L250 160 L350 158 L450 167 L560 175 L660 170','#42d8c1',3)+path('M145 230 L250 250 L350 285 L450 310 L560 300 L660 305','#fbbf24',3)+text(105,100,'dB HL',16)+text(565,385,'Frequency →',16)+text(230,420,'Illustrative thresholds · not patient measurements',15))
}
for name,(title,body) in data.items():
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="480" viewBox="0 0 800 480" role="img"><title>{escape(title)}</title><desc>Original educational schematic, not a patient scan. Not to scale.</desc><rect width="800" height="480" rx="24" fill="#0d1727"/><g font-family="Arial, sans-serif">{text(40,48,title,24,'#e6edf7')}{text(40,77,'ASU CODES · EDUCATIONAL ILLUSTRATION',11,'#42d8c1')}{body}{text(40,455,'NOT A PATIENT IMAGE · NOT TO SCALE',10)}</g></svg>'''
 (root/(name+'.svg')).write_text(svg)
