# Case Solver Image Generation Prompts

Generate the following medical images for the ASU Medical Portal Case Solver. Each image should be saved to `public/cases/` with the exact filename specified.

## Style Guidelines (Apply to ALL images)

- **Style:** High-resolution medical illustration / realistic clinical photography
- **Color palette:** Professional medical blues, teals, and neutral grays. Avoid cartoonish or overly artistic styles.
- **Format:** PNG (portable, lossless, works everywhere)
- **Size:** 1024×1024 px minimum, 16:9 or 4:3 aspect ratio preferred
- **Quality:** Clean, sharp, anatomically accurate enough for medical education
- **Watermark:** None
- **Background:** Dark teal/blue gradient (matches the app's dark theme) or clinical black background
- **UI overlay:** A subtle glassmorphic card overlay or medical monitor frame around the image gives it an authentic EHR/scan feel

## 🧠 CNS Cases (5 images)

### 1. meningitis_lp.png
**Save as:** `public/cases/meningitis_lp.png`

**Prompt:**
> Professional medical illustration of a lumbar puncture procedure being performed on a patient in lateral decubitus position. Clinical setting with sterile blue drape. Close-up view of a spinal needle inserted between lumbar vertebrae L3-L4, with a few drops of cerebrospinal fluid collecting in a clear tube. Realistic anatomical detail showing the spinal column cross-section, intervertebral discs, and meninges layers. Dark teal medical background. Clean, sharp, educational medical illustration style. No text, no labels, no watermark.

---

### 2. stroke_mri.png
**Save as:** `public/cases/stroke_mri.png`

**Prompt:**
> Realistic axial FLAIR MRI brain scan showing an acute left middle cerebral artery (MCA) territory ischemic infarct. A hyperintense (bright white) region visible in the left hemisphere temporoparietal area. Standard gray MRI tissue contrast with dark cerebrospinal fluid in the ventricles. Displayed on a dark radiology monitor screen with subtle blue glow. Professional medical imaging style. No text overlays, no anatomical labels. Clean, high-resolution scan.

---

### 3. ms_mri.png
**Save as:** `public/cases/ms_mri.png`

**Prompt:**
> Professional axial T2-weighted MRI brain scan showing multiple bright hyperintense periventricular white matter lesions characteristic of multiple sclerosis. Dawson's fingers pattern visible — ovoid lesions extending perpendicular from the lateral ventricles. Classic demyelinating plaque appearance. Dark background with realistic MRI gray-scale tissue contrast. Displayed on a radiology monitor with subtle teal glow. No text, no labels. Medical diagnostic imaging style.

---

### 4. parkinson_dat.png
**Save as:** `public/cases/parkinson_dat.png`

**Prompt:**
> DaTSCAN (Dopamine Transporter Scan) nuclear medicine imaging result showing reduced dopamine transporter uptake. Side-by-side comparison of two brain SPECT scans — left side showing markedly reduced striatal uptake (darker, less bright) and right side showing normal uptake for comparison. Symmetric reduced uptake in both putamina. Dark background with colored radiotracer visualization in orange-yellow gradient. Professional nuclear medicine imaging style. No text overlays.

---

### 5. status_eeg.png
**Save as:** `public/cases/status_eeg.png`

**Prompt:**
> Electroencephalogram (EEG) readout showing generalized epileptiform activity during status epilepticus. Multiple channels of brainwave tracings with sharp spike-and-wave discharges visible across all channels at approximately 2-3 Hz. The waveform shows high-amplitude rhythmic epileptic activity. Realistic clinical EEG monitor display with dark navy background, grid lines, and colored waveforms in green, yellow, and white. Professional neurophysiology monitoring style. No patient names, no text labels on the tracing itself.

---

## 👁 Special Senses Cases (5 images)

### 6. glaucoma_gonioscopy.png
**Save as:** `public/cases/glaucoma_gonioscopy.png`

**Prompt:**
> Gonioscopy slit-lamp examination image of the anterior chamber angle of the eye showing angle-closure glaucoma. Close-up view of the iridocorneal angle with the iris bowed forward obstructing the trabecular meshwork. Shallow anterior chamber. Medical illustration showing the aqueous humor drainage pathway blocked. Professional ophthalmic imaging style with realistic eye anatomy. Dark clinical background with subtle blue lighting. No text, no labels. Clean medical illustration.

---

### 7. retinal_detachment.png
**Save as:** `public/cases/retinal_detachment.png`

**Prompt:**
> Color fundus photography image of the retina showing a superior temporal rhegmatogenous retinal detachment. The detached retina appears elevated, folded, and slightly grayish with a visible horseshoe-shaped tear at the superior margin. Optic disc visible to the left, normal macula area. Subretinal fluid visible underneath the elevated retina. Professional ophthalmic fundus camera image style with dark vignette. Medical diagnostic photography. No text overlays.

---

### 8. amd_oct.png
**Save as:** `public/cases/amd_oct.png`

**Prompt:**
> Optical Coherence Tomography (OCT) cross-sectional scan of the macula showing wet age-related macular degeneration. Cross-section reveals subretinal fluid accumulation (dark fluid-filled space), intraretinal cystoid spaces, and subretinal hyperreflective material suggesting choroidal neovascularization. Foveal contour disrupted. Professional medical imaging with warm false-color scale or grayscale. Dark background, high contrast. No text annotations. Ophthalmic diagnostic imaging style.

---

### 9. aom_otoscopy.png
**Save as:** `public/cases/aom_otoscopy.png`

**Prompt:**
> Clinical otoscopic examination image showing acute otitis media in the right ear. The tympanic membrane appears bulging, erythematous (red), and opaque with loss of the normal light reflex and landmarks. Malleus handle obscured by inflammation. Middle ear effusion visible behind the TM giving a yellowish tint. Professional clinical otoscopy photography with speculum in view. Dark background, realistic clinical lighting. No text, no labels. Medical diagnostic imaging style.

---

### 10. ssnhl_audiometry.png
**Save as:** `public/cases/ssnhl_audiometry.png`

**Prompt:**
> Pure-tone audiogram graph showing sudden sensorineural hearing loss in the left ear. Standard audiogram grid with frequency (Hz) on the X-axis and hearing level (dB) on the Y-axis. Red circles (right ear) showing normal hearing thresholds 0-20 dB across all frequencies. Blue X marks (left ear) showing a sharp downward curve with severe-to-profound hearing loss (60-80 dB) across all frequencies. Bone conduction markers showing sensorineural pattern (air-bone gap absent). Professional clinical audiogram chart style with clean grid lines. No patient data, no text labels.

---

## 🎨 Recommended AI Tools

| Tool | Best For | Settings |
|------|----------|----------|
| **DALL-E 3** | Best anatomical accuracy | "vivid" style, high quality |
| **Midjourney v6** | Best photorealism | `--style raw --s 250` |
| **Adobe Firefly** | Clean medical illustrations | Photo mode, high detail |
| **Ideogram 2.0** | Best text-free output | Realistic mode |

## ⚡ Quick Generate All

If using an AI with batch generation, paste this summary prompt:

> Generate 10 medical diagnostic images in a consistent professional clinical style with dark teal backgrounds:
> 1. Lumbar puncture procedure illustration
> 2. Brain MRI showing left MCA stroke infarct
> 3. Brain MRI showing MS periventricular lesions (Dawson's fingers)
> 4. DaTSCAN showing reduced dopamine uptake (Parkinson's)
> 5. EEG showing generalized spike-and-wave epileptic activity
> 6. Gonioscopy showing angle-closure glaucoma
> 7. Fundus photo showing retinal detachment with horseshoe tear
> 8. OCT scan showing wet AMD with subretinal fluid
> 9. Otoscopy showing bulging red tympanic membrane (acute otitis media)
> 10. Audiogram showing severe left-sided sensorineural hearing loss
>
> All images: 1024×1024, PNG, no text, no labels, no watermarks, professional medical diagnostic photography style.

---

## 📁 File Placement

After generating, save each PNG to:
```
public/cases/meningitis_lp.png
public/cases/stroke_mri.png
public/cases/ms_mri.png
public/cases/parkinson_dat.png
public/cases/status_eeg.png
public/cases/glaucoma_gonioscopy.png
public/cases/retinal_detachment.png
public/cases/amd_oct.png
public/cases/aom_otoscopy.png
public/cases/ssnhl_audiometry.png
```

The app already references these exact filenames in `ClinicalCaseSolver.tsx`. Once the images exist, they will display automatically — no code changes needed.

---

## 🔄 Current Status

| File | Status | Size |
|------|--------|------|
| thyroid_ultrasound.webp | ✅ Exists | 90 KB |
| dka_monitor.webp | ✅ Exists | 91 KB |
| cushings_ct.webp | ✅ Exists | 108 KB |
| meningitis_lp.png | ⬜ Needs generation | — |
| stroke_mri.png | ⬜ Needs generation | — |
| ms_mri.png | ⬜ Needs generation | — |
| parkinson_dat.png | ⬜ Needs generation | — |
| status_eeg.png | ⬜ Needs generation | — |
| glaucoma_gonioscopy.png | ⬜ Needs generation | — |
| retinal_detachment.png | ⬜ Needs generation | — |
| amd_oct.png | ⬜ Needs generation | — |
| aom_otoscopy.png | ⬜ Needs generation | — |
| ssnhl_audiometry.png | ⬜ Needs generation | — |
