export interface HospitalLabPackage {
  packageName: string;
  facilityName: string;
  testCategoryId: string;
  parametersCount: number;
  highlightBadge: string;
  tagline: string;
  packageDescription: string;
  includedParameters: {
    groupName: string;
    items: string[];
  }[];
  imagingSpecifications?: {
    scannerTechnology: string;
    contrastIncluded: string;
    sliceOrFieldStrength: string;
    reportingRadiologist: string;
  };
  clinicalConsultationIncluded?: string;
  sampleRequirements: string;
  fastingAndPrepInstructions: string;
  reportDeliveryHours: string;
  accreditationStandard: string;
  specialLabPerks: string[];
}

// Exact hospital and lab specific packages - differing by facility!
export const HOSPITAL_SPECIFIC_PACKAGES: Record<string, Record<string, HospitalLabPackage>> = {
  // 1. Apollo Super Specialty Hospital Lab Wing
  'apollo-jubilee-lab': {
    full_body_checkup: {
      packageName: 'Apollo ProHealth Elite Comprehensive Master Health Check',
      facilityName: 'Apollo Super Specialty Hospital',
      testCategoryId: 'full_body_checkup',
      parametersCount: 86,
      highlightBadge: 'Apollo ProHealth™ AI-Powered Risk Index',
      tagline: 'Premier tertiary care health checkup with advanced cardiac biomarkers & physician review',
      packageDescription: 'Formulated exclusively by Apollo Senior Pathologists and Preventive Cardiologists. Covers 86 discrete clinical parameters including high-sensitivity cardiac risk markers, metabolic profiles, and full organ screenings.',
      includedParameters: [
        {
          groupName: 'Complete Hemogram & Blood Picture (24 Parameters)',
          items: ['Hemoglobin, PCV, RBC Count', 'WBC Total & 5-part Differential Count', 'Absolute Neutrophil/Lymphocyte/Eosinophil Counts', 'Platelet Count, MPV, RDW-CV, Peripheral Smear Review'],
        },
        {
          groupName: 'Comprehensive Metabolic & Lipid Profile (12 Parameters)',
          items: ['Total Cholesterol, HDL, Direct LDL, VLDL', 'Serum Triglycerides, Non-HDL Cholesterol', 'Total Cholesterol / HDL Ratio, LDL / HDL Risk Ratio', 'Apolipoprotein A1 & B Screening'],
        },
        {
          groupName: 'Advanced Liver Function & Enzyme Panel (14 Parameters)',
          items: ['Total, Direct & Indirect Bilirubin', 'SGPT (ALT), SGOT (AST), Alkaline Phosphatase (ALP)', 'Total Proteins, Albumin, Globulin, A/G Ratio', 'Gamma-Glutamyl Transferase (GGT)'],
        },
        {
          groupName: 'Renal & Electrolyte Safety Profile (12 Parameters)',
          items: ['Serum Creatinine with automated eGFR Calculation', 'Blood Urea Nitrogen (BUN), BUN/Creatinine Ratio', 'Serum Uric Acid, Sodium, Potassium, Chloride, Bicarbonate'],
        },
        {
          groupName: 'Endocrine, Thyroid & Vitamin Levels (10 Parameters)',
          items: ['Ultrasensitive 3rd Gen TSH, Free T3, Free T4', 'Fasting Plasma Glucose & Glycated Hemoglobin (HbA1c)', 'Serum Vitamin D3 (25-Hydroxy) & Vitamin B12 assay'],
        },
        {
          groupName: 'Urine & Micro-Pathology (14 Parameters)',
          items: ['Urine Protein/Creatinine Ratio, Microalbuminuria screening', 'Urine Routine, Automated Microscopy for casts, crystals & RBCs'],
        },
      ],
      clinicalConsultationIncluded: 'Includes complimentary 1-on-1 Consultation with Apollo Senior Consultant Physician & Clinical Nutritionist',
      sampleRequirements: '10 mL Venous Blood (EDTA, Fluoride & Gel Separator tubes) + Clean-catch midstream morning urine',
      fastingAndPrepInstructions: '10 to 12 hours overnight fasting mandatory. Plain water permitted. Avoid vigorous exercise on the preceding evening.',
      reportDeliveryHours: 'Digital PDF dispatched within 4 - 6 hours; hard copy with physician summary booklet available same day.',
      accreditationStandard: 'NABL, CAP (College of American Pathologists) & JCI Accredited',
      specialLabPerks: ['Priority Fast-Track Phlebotomy Lounge', 'Digital PACS storage for 5 years', 'Free repeat draw if sample hemolyzed'],
    },
    cardiac_risk_panel: {
      packageName: 'Apollo Cardio-Shield Advanced Risk Evaluation Suite',
      facilityName: 'Apollo Super Specialty Hospital',
      testCategoryId: 'cardiac_risk_panel',
      parametersCount: 22,
      highlightBadge: 'Cardiologist-Reviewed Protocol',
      tagline: 'Specialized myocardial injury, vascular thrombosis & atherogenic risk stratification',
      packageDescription: 'Proprietary Apollo cardiology panel evaluating micro-vascular inflammation, cardiac troponin release, homocysteine atherogenesis, and high-frequency 12-lead digital ECG.',
      includedParameters: [
        {
          groupName: 'Cardiac Inflammation & Biomarkers (6 Parameters)',
          items: ['High-Sensitivity C-Reactive Protein (hs-CRP) quantitative immunoturbidimetry', 'Cardiac Troponin-T High-Sensitivity (hs-cTnT)', 'Serum Homocysteine (Coronary vascular risk indicator)', 'Lipoprotein(a) [Lp(a)] risk assay'],
        },
        {
          groupName: 'Comprehensive Atherogenic Lipid Panel (10 Parameters)',
          items: ['Total Cholesterol, HDL-C, Direct LDL-C, VLDL', 'Serum Triglycerides & Non-HDL fraction', 'Atherogenic Index of Plasma (AIP) & risk ratios'],
        },
        {
          groupName: 'Diagnostic Electrophysiology (6 Parameters)',
          items: ['12-Lead Digital Resting Electrocardiogram (ECG)', 'QRS Axis, PR Interval & QT Corrected (QTc) analysis', 'Computerized rhythm strip with Senior Cardiologist verification'],
        },
      ],
      clinicalConsultationIncluded: 'Formal ECG report countersigned by Apollo Senior Cardiologist; optional priority OPD consult referral.',
      sampleRequirements: '6 mL Venous Blood + 12-Lead non-invasive chest lead acquisition',
      fastingAndPrepInstructions: 'Fasting 10 hours required for lipid profile. Avoid caffeine, nicotine, and strenuous physical exertion 2 hours before the ECG.',
      reportDeliveryHours: 'Immediate resting ECG result; complete blood biomarker panel within 3 hours.',
      accreditationStandard: 'NABL & CAP Accredited Cardiovascular Diagnostics',
      specialLabPerks: ['Direct upload to Apollo 24|7 Health Records', 'Emergency alert trigger to on-duty cardiology registrar if Troponin-T elevated'],
    },
    advanced_imaging_scans: {
      packageName: 'Apollo Precision 3.0T MRI & 128-Slice Dual-Source CT Suite',
      facilityName: 'Apollo Super Specialty Hospital',
      testCategoryId: 'advanced_imaging_scans',
      parametersCount: 16,
      highlightBadge: 'Siemens MAGNETOM 3.0T & SOMATOM 128-Slice',
      tagline: 'Ultra high-definition anatomical imaging with non-ionic contrast and sub-millimeter slices',
      packageDescription: 'Apollo Jubilee Hills advanced diagnostic imaging protocol featuring wide-bore silent 3.0T MRI and low-dose 128-slice CT with 3D volumetric reconstructions.',
      includedParameters: [
        {
          groupName: 'Imaging Protocol & Sequences',
          items: ['Multi-planar T1, T2, FLAIR, DWI and High-Resolution Gradient Echo sequences', 'Sub-millimeter volumetric slice acquisition (0.5 mm slice resolution)', 'Diffusion-Weighted Imaging with Apparent Diffusion Coefficient (ADC) mapping'],
        },
        {
          groupName: 'Contrast & Safety Inclusions',
          items: ['Macrocyclic Non-Ionic IV Contrast Media included (Gadobutrol/Gadoterate meglumine)', 'Pre-contrast spot Serum Creatinine screening to verify renal clearance', 'Automated pressure-controlled injector with weight-adjusted micro-dosing'],
        },
        {
          groupName: 'Post-Processing & Digital PACS',
          items: ['3D Multi-Planar Reconstruction (MPR) and Maximum Intensity Projection (MIP)', 'Full high-res DICOM package accessible via Cloud PACS link with mobile DICOM viewer'],
        },
      ],
      imagingSpecifications: {
        scannerTechnology: 'Siemens MAGNETOM Vida 3.0-Tesla High-Field Silent MRI & Siemens SOMATOM Definition AS+ 128-Slice CT',
        contrastIncluded: 'Pre-screened Macrocyclic Non-Ionic Contrast Media (zero charge addon)',
        sliceOrFieldStrength: '3.0 Tesla Field Strength / 128 Slices at 0.33s rotation',
        reportingRadiologist: 'Double-read and signed by Senior Consultant Neuro/Body Radiologist (FRCR London certified)',
      },
      clinicalConsultationIncluded: 'In-person consultation with Consultant Radiologist to review anatomical scans and 3D renderings.',
      sampleRequirements: 'None (Physical in-scanner examination). Spot fingerstick creatinine verified prior to contrast administration.',
      fastingAndPrepInstructions: 'Fasting 4 hours if IV contrast is prescribed. Ensure complete removal of metal, jewelry, hearing aids, and dental prostheses.',
      reportDeliveryHours: 'Digital DICOM link ready in 30 minutes; verified Radiologist diagnostic narrative report in 2 - 3 hours.',
      accreditationStandard: 'AERB (Atomic Energy Regulatory Board) & NABL Certified Imaging Wing',
      specialLabPerks: ['Wide 70cm Bore with ambient sound reduction for claustrophobic patients', 'Emergency resuscitation bay directly attached to scan suite'],
    },
    diabetes_care_package: {
      packageName: 'Apollo Sugar Complete Glycemic & End-Organ Protection Profile',
      facilityName: 'Apollo Super Specialty Hospital',
      testCategoryId: 'diabetes_care_package',
      parametersCount: 28,
      highlightBadge: 'HPLC Gold Standard & HOMA-IR Index',
      tagline: 'Gold-standard glycation tracking, pancreatic beta-cell reserve and microvascular renal screen',
      packageDescription: 'Apollo Diabetes Care Centre specialized protocol measuring 90-day glucose binding, fasting insulin resistance, and early nephropathy markers.',
      includedParameters: [
        {
          groupName: 'Glycemic Biomarkers (6 Parameters)',
          items: ['HbA1c by NGSP-certified High-Performance Liquid Chromatography (HPLC)', 'Estimated Average Glucose (eAG) calculation', 'Fasting Plasma Glucose (Hexokinase method)', 'Post-Prandial Blood Sugar (2 hours post-standardized meal)'],
        },
        {
          groupName: 'Pancreatic Reserve & Insulin Sensitivity (4 Parameters)',
          items: ['Fasting Serum Insulin by Chemiluminescent Microparticle Immunoassay', 'HOMA-IR (Homeostatic Model Assessment of Insulin Resistance)', 'HOMA-Beta cell secretory capacity'],
        },
        {
          groupName: 'Microvascular & Renal Protection (10 Parameters)',
          items: ['Spot Urine Microalbumin-to-Creatinine Ratio (UACR)', 'Serum Creatinine & Chronic Kidney Disease eGFR stage', 'Serum Electrolytes (Sodium, Potassium)'],
        },
        {
          groupName: 'Cardiovascular Diabetic Comorbidity (8 Parameters)',
          items: ['Lipid Profile (Cholesterol, Triglycerides, HDL, LDL, VLDL)', 'Non-HDL Atherogenic Risk Index'],
        },
      ],
      clinicalConsultationIncluded: 'Includes Diabetes Educator session on carb counting, target ranges, and continuous glucose monitoring review.',
      sampleRequirements: 'Venous Blood (Draw 1: Fasting; Draw 2: exactly 120 mins post-breakfast) + Spot Morning Urine',
      fastingAndPrepInstructions: '8 - 10 hours overnight fasting for the first draw. Take morning diabetic medications as advised by your physician.',
      reportDeliveryHours: 'Same day digital report in 3 hours with color-coded glycemic trend charts.',
      accreditationStandard: 'NABL & CAP Certified Endocrine Lab',
      specialLabPerks: ['Complimentary healthy diabetic breakfast voucher at hospital cafeteria during 2-hour wait', 'Automated reminder for 90-day repeat HbA1c'],
    },
    fever_infection_panel: {
      packageName: 'Apollo Rapid Response Acute Febrile & Sepsis Isolation Panel',
      facilityName: 'Apollo Super Specialty Hospital',
      testCategoryId: 'fever_infection_panel',
      parametersCount: 26,
      highlightBadge: 'Stat Emergency Lab Turnaround',
      tagline: 'Rapid differential diagnosis of Dengue, Malaria, Typhoid, viral fevers and acute inflammation',
      packageDescription: 'Processed in Apollo Emergency Satellite Lab with stat priority to prevent delayed intervention in viral hemorrhagic fevers and severe bacteremia.',
      includedParameters: [
        {
          groupName: 'Hematology & Thrombocyte Dynamics (12 Parameters)',
          items: ['Complete Blood Count (CBC) with automated 6-part differential', 'Serial Platelet Count & Plateletcrit', 'Packed Cell Volume (PCV / Hematocrit) for plasma leakage screening', 'Peripheral Smear examination for toxic granules & atypical lymphocytes'],
        },
        {
          groupName: 'Vector-Borne & Infectious Serology (8 Parameters)',
          items: ['Dengue NS1 Antigen (Day 1 - 5 Early Marker)', 'Dengue IgG & IgM Specific Antibodies', 'Malaria Antigen Card Test (Dual Plasmodium falciparum & vivax)', 'Widal Slide & Quantitative Tube Agglutination for Salmonella enterica'],
        },
        {
          groupName: 'Acute Phase Inflammatory Markers (6 Parameters)',
          items: ['Quantitative C-Reactive Protein (CRP) by immunoturbidimetry', 'Erythrocyte Sedimentation Rate (ESR - Automated Westergren method)', 'Serum Ferritin (Acute phase reactant)'],
        },
      ],
      clinicalConsultationIncluded: 'Emergency lab alert directly communicated to attending physician if platelet count falls below 100,000 / µL.',
      sampleRequirements: '5 mL Venous Blood (EDTA Purple Top + Serum Separator Yellow Top)',
      fastingAndPrepInstructions: 'No fasting required. Testing can be performed immediately during fever spikes or at any time of day.',
      reportDeliveryHours: 'STAT Turnaround: Preliminary Dengue/Malaria results in 60 minutes; complete certified panel in 90 - 120 minutes.',
      accreditationStandard: 'NABL & CAP Certified Microbiology & Serology',
      specialLabPerks: ['Free serial platelet count monitoring voucher within 48 hours for dengue suspect patients', 'Direct WhatsApp delivery of critical results'],
    },
  },

  // 2. Vijaya Diagnostic Centre - Flagship Super Hub (Banjara Hills)
  'vijaya-banjara': {
    full_body_checkup: {
      packageName: 'Vijaya Master Health Profile Gold with Organ Function Tests',
      facilityName: 'Vijaya Diagnostic Centre',
      testCategoryId: 'full_body_checkup',
      parametersCount: 74,
      highlightBadge: 'Vijaya 40+ Years Diagnostic Trust',
      tagline: 'Flagship standalone diagnostic center package with automated high-throughput chemiluminescence',
      packageDescription: 'Designed by Vijaya senior biochemists for comprehensive preventative evaluation. Features 74 tests with precision barcoded sample tracking and digital delivery.',
      includedParameters: [
        {
          groupName: 'Complete Blood Picture & Hemogram (20 Parameters)',
          items: ['Hemoglobin, Total Leukocyte Count, Differential Count (P, L, E, M, B)', 'Platelet Count, Packed Cell Volume, Mean Corpuscular Indices (MCV, MCH, MCHC)', 'Erythrocyte Sedimentation Rate (ESR)'],
        },
        {
          groupName: 'Lipid & Cardiac Risk Profile (9 Parameters)',
          items: ['Serum Cholesterol, HDL Cholesterol, LDL Cholesterol, VLDL', 'Triglycerides, Total Cholesterol / HDL Ratio, LDL / HDL Ratio'],
        },
        {
          groupName: 'Liver Function Evaluation (11 Parameters)',
          items: ['Serum Bilirubin (Total, Direct, Indirect), SGPT/ALT, SGOT/AST', 'Alkaline Phosphatase (ALP), Total Protein, Albumin, Globulin, A/G Ratio'],
        },
        {
          groupName: 'Renal & Kidney Profile (9 Parameters)',
          items: ['Serum Creatinine, Blood Urea, Serum Uric Acid', 'Electrolytes: Sodium, Potassium, Chloride'],
        },
        {
          groupName: 'Endocrine & Metabolic Profile (7 Parameters)',
          items: ['Thyroid Stimulating Hormone (TSH - Ultrasensitive)', 'Fasting Blood Glucose, HbA1c (Glycated Hemoglobin)'],
        },
        {
          groupName: 'Complete Urine Examination (18 Parameters)',
          items: ['Physical, chemical & microscopic examination for pus cells, RBCs, epithelial cells, albumin, bile salts and sugar'],
        },
      ],
      clinicalConsultationIncluded: 'Includes free diagnostic report review tele-consultation with Vijaya Senior Pathologist.',
      sampleRequirements: 'Venous blood sample + sterile urine container provided on arrival',
      fastingAndPrepInstructions: '10 hours overnight fasting recommended. Avoid fatty meals the previous night.',
      reportDeliveryHours: 'Delivered digitally via Vijaya App and SMS link in 4 hours.',
      accreditationStandard: 'NABL & ISO 15189 Certified Standalone Diagnostic Hub',
      specialLabPerks: ['Free Home Sample Pickup option available across city', 'Automated Barcoded Vacuum Tubes (Zero human handling error)'],
    },
    cardiac_risk_panel: {
      packageName: 'Vijaya Cardio-Checkup Comprehensive Panel & 12-Lead ECG',
      facilityName: 'Vijaya Diagnostic Centre',
      testCategoryId: 'cardiac_risk_panel',
      parametersCount: 18,
      highlightBadge: 'Standardized NABL Cardiac Profile',
      tagline: 'Focused screening for dyslipidemia, arterial inflammation and cardiac rhythm anomalies',
      packageDescription: 'Vijaya standardized cardiovascular risk package combining high-sensitivity C-reactive protein, high-precision lipid profile, and digital 12-lead ECG.',
      includedParameters: [
        {
          groupName: 'Serum Cardiac Biomarkers (5 Parameters)',
          items: ['Quantitative hs-CRP (High-Sensitivity C-Reactive Protein)', 'Serum Homocysteine (Cardiovascular thrombotic risk marker)', 'Cardiac Troponin-I screening'],
        },
        {
          groupName: 'Lipid Fractionation (9 Parameters)',
          items: ['Total Cholesterol, High Density Lipoprotein (HDL)', 'Low Density Lipoprotein (LDL), Very Low Density Lipoprotein (VLDL)', 'Triglycerides, Total / HDL Ratio, LDL / HDL Ratio'],
        },
        {
          groupName: 'Diagnostic Electrocardiography (4 Parameters)',
          items: ['12-Lead Digital Resting ECG', 'Rhythm, axis and rate interpretation', 'Certified report signed by consultant radiologist/physician'],
        },
      ],
      clinicalConsultationIncluded: 'Detailed report with abnormal parameter flagging and lifestyle cardiovascular risk score.',
      sampleRequirements: '5 mL Blood sample + Resting 12-lead electrode placement',
      fastingAndPrepInstructions: '10 hours fasting for lipids. Avoid exertion immediately before test.',
      reportDeliveryHours: 'ECG handed over immediately; blood report delivered within 3 hours.',
      accreditationStandard: 'NABL Certified Diagnostic Center',
      specialLabPerks: ['Digital access via Vijaya health portal for 10 years', 'Affordable transparent pricing with no hidden charges'],
    },
    advanced_imaging_scans: {
      packageName: 'Vijaya High-Field 1.5T Wide-Bore MRI & 64-Slice CT Scan',
      facilityName: 'Vijaya Diagnostic Centre',
      testCategoryId: 'advanced_imaging_scans',
      parametersCount: 12,
      highlightBadge: 'GE Signa Explorer 1.5T High-Res System',
      tagline: 'Accurate anatomical cross-sectional scanning with high comfort wide bore',
      packageDescription: 'Equipped with GE Signa Explorer 1.5-Tesla MRI and Optima 64-Slice CT, delivering crisp neuro, musculoskeletal and body imaging with low noise technology.',
      includedParameters: [
        {
          groupName: 'Scan Sequences & Imaging Protocol',
          items: ['High-contrast T1, T2, FLAIR, STIR and Gradient echo acquisition', 'High SNR (Signal-to-Noise Ratio) dedicated body coils', 'Axial, Sagittal and Coronal reconstructions'],
        },
        {
          groupName: 'Contrast Option',
          items: ['Non-ionic low-osmolar contrast media administered under physician supervision', 'Safety screening questionnaire and emergency backup on premise'],
        },
      ],
      imagingSpecifications: {
        scannerTechnology: 'GE Signa Explorer 1.5T High-Resolution MRI & GE Optima 64-Slice CT',
        contrastIncluded: 'Available on prescription (Standard non-ionic IV contrast)',
        sliceOrFieldStrength: '1.5-Tesla Field Strength / 64 Slices',
        reportingRadiologist: 'Read by Senior Consultant Radiologist with sub-specialty experience',
      },
      clinicalConsultationIncluded: 'Diagnostic radiology report signed by senior imaging specialist with key findings highlighted.',
      sampleRequirements: 'None (Scanner examination). Fasting required only if contrast is advised.',
      fastingAndPrepInstructions: 'Fasting 4 hours if contrast scan. Please bring previous scans/films for comparative study.',
      reportDeliveryHours: 'Online DICOM download link provided within 1 hour; detailed written report in 3 - 4 hours.',
      accreditationStandard: 'NABL & AERB Certified Diagnostic Facility',
      specialLabPerks: ['Wide 70cm patient tunnel for enhanced comfort', 'High-speed cloud image download link shareable with your doctor'],
    },
    diabetes_care_package: {
      packageName: 'Vijaya Diabetes Health Check & Metabolic Panel',
      facilityName: 'Vijaya Diagnostic Centre',
      testCategoryId: 'diabetes_care_package',
      parametersCount: 20,
      highlightBadge: 'Automated Bio-Rad HPLC Technology',
      tagline: 'Targeted diabetic monitoring panel covering HbA1c, organ safety and lipid comorbidities',
      packageDescription: 'Standardized diabetic monitoring package utilizing Bio-Rad D-10 HPLC analyzer for gold-standard HbA1c precision, paired with fasting/post-prandial glycemic mapping.',
      includedParameters: [
        {
          groupName: 'Glycemic Control (5 Parameters)',
          items: ['HbA1c (Glycosylated Hemoglobin) by certified HPLC', 'Average Estimated Blood Glucose', 'Fasting Blood Sugar (FBS)', 'Post Prandial Blood Sugar (PPBS - 2 hours)'],
        },
        {
          groupName: 'Renal Function & Albuminuria (8 Parameters)',
          items: ['Serum Creatinine, Blood Urea Nitrogen', 'Spot Urine Microalbumin, Urine Creatinine, Urine Microalbumin/Creatinine Ratio (UACR)'],
        },
        {
          groupName: 'Lipid Profile (7 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Total/HDL Ratio'],
        },
      ],
      clinicalConsultationIncluded: 'Includes colored graphical diabetic report showing target reference ranges and prior test trends.',
      sampleRequirements: 'Venous blood (2 draws: Fasting & 2 hours post-meal) + Spot urine sample',
      fastingAndPrepInstructions: 'Fasting 8 - 10 hours for first sample. Have your regular breakfast and return exactly 2 hours later for second draw.',
      reportDeliveryHours: 'Complete digital report in 3 hours via WhatsApp / SMS.',
      accreditationStandard: 'NABL Accredited Clinical Biochemistry Laboratory',
      specialLabPerks: ['Express sample collection counters for elderly and diabetic patients', 'Automated reminder alert for next quarterly HbA1c'],
    },
    fever_infection_panel: {
      packageName: 'Vijaya Acute Fever Diagnostic Profile (Dengue, Malaria, Typhoid)',
      facilityName: 'Vijaya Diagnostic Centre',
      testCategoryId: 'fever_infection_panel',
      parametersCount: 22,
      highlightBadge: 'Same-Day Fast Track Serology',
      tagline: 'Comprehensive acute febrile panel isolating vector-borne and common tropical infections',
      packageDescription: 'Formulated to quickly isolate the cause of sudden or persistent high fevers, chills, body ache and thrombocytopenia.',
      includedParameters: [
        {
          groupName: 'Complete Hemogram & Platelet Kinetics (12 Parameters)',
          items: ['CBC with 5-part Differential, Platelet Count, Hematocrit/PCV', 'Total WBC count, Absolute Neutrophil Count, Peripheral Smear examination'],
        },
        {
          groupName: 'Specific Infectious Serology (8 Parameters)',
          items: ['Dengue NS1 Antigen (Immunochromatographic assay)', 'Dengue IgG & IgM Antibodies', 'Malaria Antigen Card Test (Dual Pf & Pv species detection)', 'Typhoid Widal Tube Titre agglutination test'],
        },
        {
          groupName: 'Systemic Inflammation (2 Parameters)',
          items: ['Serum C-Reactive Protein (Quantitative CRP)', 'Erythrocyte Sedimentation Rate (ESR)'],
        },
      ],
      clinicalConsultationIncluded: 'Critical value phone call alert if platelet count drops below 80,000 / µL.',
      sampleRequirements: 'Venous Blood Sample in EDTA & clot activator vacutainers',
      fastingAndPrepInstructions: 'No fasting required. Walk-in test available 24/7 at flagship branch.',
      reportDeliveryHours: 'Rapid report in 2 hours digitally via Vijaya online portal.',
      accreditationStandard: 'NABL Certified Hematology & Clinical Pathology',
      specialLabPerks: ['Specialized fever OPD desk for priority blood draw', 'SMS dispatch as soon as platelet count is verified'],
    },
  },

  // 3. Lucid Medical Diagnostics (Madhapur)
  'lucid-madhapur': {
    full_body_checkup: {
      packageName: 'Lucid Advanced Platinum Wellness Diagnostic Package',
      facilityName: 'Lucid Medical Diagnostics',
      testCategoryId: 'full_body_checkup',
      parametersCount: 82,
      highlightBadge: 'Abbott ARCHITECT & Beckman Coulter Automation',
      tagline: 'High-precision preventive screening with advanced tumor markers & vitamin screening',
      packageDescription: 'Lucid flagship health checkup designed for IT professionals and corporate executives. Includes 82 clinical markers with automated chemiluminescence analysis.',
      includedParameters: [
        {
          groupName: 'Hematology & Hemogram (22 Parameters)',
          items: ['Complete Blood Count, Platelet Indices, ESR, Peripheral Blood Morphology'],
        },
        {
          groupName: 'Cardiac, Lipid & Homocysteine (10 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, hs-CRP & Homocysteine'],
        },
        {
          groupName: 'Liver, Pancreas & Renal Safety (18 Parameters)',
          items: ['SGPT, SGOT, Total & Direct Bilirubin, ALP, GGT, Serum Creatinine, Uric Acid, BUN, eGFR, Sodium, Potassium'],
        },
        {
          groupName: 'Endocrine, Vitamins & Minerals (14 Parameters)',
          items: ['Vitamin D3, Vitamin B12, T3, T4, TSH, Fasting Blood Sugar, HbA1c, Calcium, Phosphorus'],
        },
        {
          groupName: 'Urine & Microscopic Chemistry (18 Parameters)',
          items: ['Automated urine chemistry and flow cytometry for microscopic elements'],
        },
      ],
      clinicalConsultationIncluded: 'Complimentary consultation with Lucid Senior Clinical Pathologist & lifestyle coaching voucher.',
      sampleRequirements: 'Venous Blood Sample + Sterile Morning Urine Sample',
      fastingAndPrepInstructions: '10 - 12 hours fasting. Avoid alcohol and heavy fats 24 hours prior.',
      reportDeliveryHours: 'Full digital report in 4 hours on WhatsApp and Lucid Cloud Dashboard.',
      accreditationStandard: 'NABL & CAP Accredited Advanced Diagnostic Center',
      specialLabPerks: ['Executive Lounge with Wi-Fi & work pods during testing', 'Free sample redraw guarantee'],
    },
    cardiac_risk_panel: {
      packageName: 'Lucid Precision Cardio-Vascular Biomarker Screen',
      facilityName: 'Lucid Medical Diagnostics',
      testCategoryId: 'cardiac_risk_panel',
      parametersCount: 20,
      highlightBadge: 'Beckman Coulter Ultra-Sensitive Immunoassays',
      tagline: 'Next-gen cardiovascular assessment measuring high-sensitivity troponin and vascular stress',
      packageDescription: 'Lucid specialized cardiac evaluation incorporating high-sensitivity Troponin-I, hs-CRP, Homocysteine, and automated 12-lead digital ECG.',
      includedParameters: [
        {
          groupName: 'Myocardial & Inflammatory Markers (6 Parameters)',
          items: ['High-Sensitivity Cardiac Troponin-I (hs-cTnI)', 'High-Sensitivity C-Reactive Protein (hs-CRP)', 'Serum Homocysteine quantitative chemiluminescence', 'Lipid Atherogenic Risk Ratio'],
        },
        {
          groupName: 'Full Lipid Profile (9 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Risk ratios'],
        },
        {
          groupName: 'Electrocardiogram (5 Parameters)',
          items: ['12-Lead Digital ECG with computerized rhythm analysis and physician sign-off'],
        },
      ],
      clinicalConsultationIncluded: 'Detailed report with cardiologist-verified coronary risk index classification.',
      sampleRequirements: 'Venous Blood + 12-lead resting chest electrodes',
      fastingAndPrepInstructions: '10 hours overnight fasting. Avoid energy drinks or coffee 3 hours before test.',
      reportDeliveryHours: 'ECG on the spot; blood results within 2 - 3 hours.',
      accreditationStandard: 'NABL Accredited Cardiology Laboratory',
      specialLabPerks: ['Priority reporting for symptomatic patients', 'Digital ECG PDF with raw rhythm trace'],
    },
    advanced_imaging_scans: {
      packageName: 'Lucid 3.0T Silent MRI & Dual-Energy Low-Dose CT Suite',
      facilityName: 'Lucid Medical Diagnostics',
      testCategoryId: 'advanced_imaging_scans',
      parametersCount: 14,
      highlightBadge: 'Philips Ingenia 3.0T Digital Broadband MRI',
      tagline: 'Direct-to-digital broadband RF technology with 40% reduction in acoustic scanner noise',
      packageDescription: 'Equipped with Philips Ingenia 3.0T dStream MRI and 128-Slice Low-Dose Dual Energy CT for crystal clear neuro, spine, abdominal and musculoskeletal visualization.',
      includedParameters: [
        {
          groupName: 'Multi-Sequence Broadband Imaging',
          items: ['Direct digital dStream RF coil technology with high SNR', 'Diffusion tensor imaging, 3D volumetric FLAIR and T2 Space sequences', 'Low-dose iterative reconstruction for CT minimizing radiation dose up to 60%'],
        },
        {
          groupName: 'Safety & Contrast Protocol',
          items: ['Non-ionic macrocyclic contrast agents with automated micro-infusion', 'Pre-scan Renal Function clearance check on-site'],
        },
      ],
      imagingSpecifications: {
        scannerTechnology: 'Philips Ingenia 3.0T dStream Digital MRI & GE Revolution 128-Slice CT',
        contrastIncluded: 'Pre-screened Non-Ionic Contrast (Included when prescribed)',
        sliceOrFieldStrength: '3.0-Tesla dStream Digital / 128-Slice Dual Energy CT',
        reportingRadiologist: 'Read and certified by Senior Musculoskeletal / Neuro Radiologists',
      },
      clinicalConsultationIncluded: 'Consultation with Consultant Radiologist to review anatomical findings and images.',
      sampleRequirements: 'None (Physical imaging procedure). Spot Creatinine verified prior to IV contrast.',
      fastingAndPrepInstructions: '4 hours fasting for contrast studies. Wear metal-free comfortable clothing or use provided clinical gowns.',
      reportDeliveryHours: 'Cloud PACS link in 30 minutes; verified Radiologist written diagnosis in 2 hours.',
      accreditationStandard: 'NABL & AERB Certified Modern Diagnostic Center',
      specialLabPerks: ['Ambient in-bore cinema visuals and headphones to eliminate claustrophobia', 'Free cloud storage of scan images for lifetime access'],
    },
    diabetes_care_package: {
      packageName: 'Lucid Glyco-Check Advanced Diabetes Risk & Renal Panel',
      facilityName: 'Lucid Medical Diagnostics',
      testCategoryId: 'diabetes_care_package',
      parametersCount: 24,
      highlightBadge: 'High-Precision HPLC & Spot UACR Assay',
      tagline: 'In-depth glycemic control and vascular complication screening for pre-diabetic and diabetic patients',
      packageDescription: 'Lucid diabetic management panel tracking 3-month glycemic binding, immediate insulin response, and early urinary microvascular leakage.',
      includedParameters: [
        {
          groupName: 'Glycemic Biomarkers (6 Parameters)',
          items: ['HbA1c by NGSP-certified HPLC', 'Average Estimated Blood Sugar (eAG)', 'Fasting Plasma Glucose', 'Post-Prandial Blood Sugar (2 hours)'],
        },
        {
          groupName: 'Insulin Resistance & Beta Cell Function (4 Parameters)',
          items: ['Fasting Serum Insulin by Chemiluminescence', 'Calculated HOMA-IR Index'],
        },
        {
          groupName: 'Kidney Safety & Microalbuminuria (8 Parameters)',
          items: ['Spot Urine Microalbumin, Urine Creatinine, UACR Ratio, Serum Creatinine, eGFR'],
        },
        {
          groupName: 'Cardiovascular Risk Profile (6 Parameters)',
          items: ['Full Lipid Profile (Cholesterol, HDL, LDL, VLDL, Triglycerides)'],
        },
      ],
      clinicalConsultationIncluded: 'Includes customized dietary glycemic index chart and report breakdown.',
      sampleRequirements: 'Venous blood (Fasting + 2hr PP) + Spot morning urine',
      fastingAndPrepInstructions: '8 - 10 hours fasting for first sample. Have standard meal and return 2 hours later.',
      reportDeliveryHours: 'Digital report dispatched in 3 hours via WhatsApp.',
      accreditationStandard: 'NABL Certified Clinical Biochemistry',
      specialLabPerks: ['Express diabetic phlebotomy counter with no queue wait', 'Digital glycemic trend tracking on Lucid Patient Portal'],
    },
    fever_infection_panel: {
      packageName: 'Lucid Express Acute Febrile Illness Serology & Hematology',
      facilityName: 'Lucid Medical Diagnostics',
      testCategoryId: 'fever_infection_panel',
      parametersCount: 24,
      highlightBadge: 'Express 90-Minute Lab Result',
      tagline: 'High-throughput rapid isolation of Dengue, Malaria, Typhoid, viral fevers and inflammatory response',
      packageDescription: 'Rapid response fever panel utilizing automated cell counters and certified serology cards for acute infection diagnosis.',
      includedParameters: [
        {
          groupName: 'Complete Hemogram & Platelet Profiling (12 Parameters)',
          items: ['CBC with Differential, Platelet Count, Hematocrit/PCV, Peripheral Smear for Hemoparasites'],
        },
        {
          groupName: 'Tropical Infection Serology (8 Parameters)',
          items: ['Dengue NS1 Antigen, Dengue IgG/IgM Antibodies, Malaria Antigen (Pv/Pf), Typhoid Widal Titres'],
        },
        {
          groupName: 'Inflammatory Biomarkers (4 Parameters)',
          items: ['Quantitative C-Reactive Protein (CRP), ESR automated analysis'],
        },
      ],
      clinicalConsultationIncluded: 'Priority automated SMS and call alert if critical thrombocytopenia is identified.',
      sampleRequirements: 'Venous Blood Sample',
      fastingAndPrepInstructions: 'No fasting required. Walk-in anytime.',
      reportDeliveryHours: 'Digital report delivered within 90 - 120 minutes.',
      accreditationStandard: 'NABL Certified Hematology Laboratory',
      specialLabPerks: ['Dedicated fever express counter', 'Direct real-time lab technician support via WhatsApp'],
    },
  },

  // 4. Nizam's Institute of Medical Sciences (NIMS) Central Lab
  'nims-central-lab': {
    full_body_checkup: {
      packageName: 'NIMS Institutional Comprehensive Health Screening Package',
      facilityName: 'Nizam’s Institute of Medical Sciences (NIMS)',
      testCategoryId: 'full_body_checkup',
      parametersCount: 65,
      highlightBadge: 'Autonomous Government Medical University Lab',
      tagline: 'Subsidized academic medical centre package providing core organ screenings and clinical verification',
      packageDescription: 'Conducted at the Central Clinical Laboratory of NIMS, an autonomous university institute. 100% subsidized under Govt. Arogyasri / CGHS with academic pathologist oversight.',
      includedParameters: [
        {
          groupName: 'Hematology & Blood Picture (18 Parameters)',
          items: ['Complete Hemogram, Differential Leukocyte Count, Platelet Count, ESR'],
        },
        {
          groupName: 'Metabolic, Liver & Renal Panel (22 Parameters)',
          items: ['Bilirubin (Total & Direct), SGPT, SGOT, ALP, Total Proteins, Albumin, Serum Creatinine, Blood Urea, Uric Acid, Sodium, Potassium'],
        },
        {
          groupName: 'Lipid Profile & Glucose (11 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Fasting Blood Sugar, HbA1c'],
        },
        {
          groupName: 'Urine & Routine Analysis (14 Parameters)',
          items: ['Complete Urine Examination (Microscopic & Biochemical screening)'],
        },
      ],
      clinicalConsultationIncluded: 'Reports verified by NIMS Faculty Pathologists; valid across all government medical boards and referral hospitals.',
      sampleRequirements: 'Venous Blood + Urine Specimen',
      fastingAndPrepInstructions: 'Overnight fasting 10 hours required. Report to Central Lab Sample Collection Counter Room 10.',
      reportDeliveryHours: 'Delivered digitally via Telangana HMIS portal in 6 hours; hard copy at counter.',
      accreditationStandard: 'NABL Accredited & Government Medical College Central Lab',
      specialLabPerks: ['100% Free for Arogyasri / EHS card holders', 'Institutional academic precision with double-check by postgraduate pathology residents'],
    },
    cardiac_risk_panel: {
      packageName: 'NIMS Institute Cardiac Evaluation & ECG Profile',
      facilityName: 'Nizam’s Institute of Medical Sciences (NIMS)',
      testCategoryId: 'cardiac_risk_panel',
      parametersCount: 16,
      highlightBadge: 'NIMS Department of Cardiology Protocol',
      tagline: 'Academic cardiology panel tracking myocardial injury, lipid fractions and electrophysiology',
      packageDescription: 'Affordable academic medical hospital panel featuring Troponin-T, quantitative hs-CRP, complete lipid fractions, and 12-lead resting ECG.',
      includedParameters: [
        {
          groupName: 'Cardiac Markers (4 Parameters)',
          items: ['High-Sensitivity Troponin-T (hs-cTnT)', 'Quantitative hs-CRP', 'Serum Homocysteine screening'],
        },
        {
          groupName: 'Lipid Fractions (8 Parameters)',
          items: ['Cholesterol, HDL, LDL, VLDL, Triglycerides, Risk ratios'],
        },
        {
          groupName: 'Electrocardiography (4 Parameters)',
          items: ['12-Lead ECG verified by NIMS Cardiology Resident on duty'],
        },
      ],
      clinicalConsultationIncluded: 'Verified by NIMS Department of Cardiology faculty; immediate referral to acute cardiac care if Troponin is flagged.',
      sampleRequirements: 'Venous Blood + 12-lead ECG recording',
      fastingAndPrepInstructions: 'Fasting 10 hours required for lipid profile.',
      reportDeliveryHours: 'ECG immediate; blood report in 4 hours.',
      accreditationStandard: 'NABL Certified Hospital Laboratory',
      specialLabPerks: ['Direct integration with NIMS Cardiology OPD', 'Arogyasri & Government employee scheme eligible'],
    },
    advanced_imaging_scans: {
      packageName: 'NIMS Department of Radiology 3.0T MRI & 128-Slice CT Scan',
      facilityName: 'Nizam’s Institute of Medical Sciences (NIMS)',
      testCategoryId: 'advanced_imaging_scans',
      parametersCount: 14,
      highlightBadge: 'Tertiary Teaching Hospital Imaging Wing',
      tagline: 'High-field academic radiological evaluations with faculty radiologist interpretation',
      packageDescription: 'Equipped with 3.0-Tesla Siemens MRI and 128-Slice CT scan. Provides gold-standard anatomical diagnosis with academic rigor and multi-specialty tumor board review.',
      includedParameters: [
        {
          groupName: 'High-Resolution Scanning Protocol',
          items: ['Multi-planar thin slice MRI / CT acquisition with volumetric reconstructions', 'Dedicated contrast protocols supervised by on-duty radiology fellow'],
        },
        {
          groupName: 'Contrast & Renal Safety',
          items: ['Non-ionic contrast media included under Arogyasri / Hospital pharmacy', 'Immediate on-site serum creatinine verification'],
        },
      ],
      imagingSpecifications: {
        scannerTechnology: 'Siemens 3.0-Tesla High-Field MRI & Siemens 128-Slice Multidetector CT',
        contrastIncluded: 'Included (Govt. approved non-ionic contrast media)',
        sliceOrFieldStrength: '3.0 Tesla / 128 Slices',
        reportingRadiologist: 'Authored by Assistant/Associate Professor of Radio-Diagnosis',
      },
      clinicalConsultationIncluded: 'Reports recognized by national medical boards and tertiary surgical departments.',
      sampleRequirements: 'Physical scanner examination. Renal function verified before contrast.',
      fastingAndPrepInstructions: '4 hours fasting if contrast scan is ordered.',
      reportDeliveryHours: 'Digital scans on hospital HMIS in 2 hours; formal signed report in 4 - 6 hours.',
      accreditationStandard: 'AERB & NABL Certified Teaching Hospital Department',
      specialLabPerks: ['Highly subsidized rates for general public', '24/7 emergency imaging operational with backup power'],
    },
    diabetes_care_package: {
      packageName: 'NIMS Endocrinology Diabetes Care & Renal Monitoring Panel',
      facilityName: 'Nizam’s Institute of Medical Sciences (NIMS)',
      testCategoryId: 'diabetes_care_package',
      parametersCount: 22,
      highlightBadge: 'Department of Endocrinology Protocol',
      tagline: 'Endocrine department protocol measuring long-term glycemic control and diabetic kidney disease',
      packageDescription: 'Standardized diabetes evaluation panel covering Bio-Rad HPLC HbA1c, fasting/post-prandial blood sugar, and spot urinary microalbuminuria.',
      includedParameters: [
        {
          groupName: 'Glycemic Biomarkers (5 Parameters)',
          items: ['HbA1c by HPLC method', 'Fasting Blood Glucose', 'Post-Prandial Blood Sugar', 'Average Estimated Glucose'],
        },
        {
          groupName: 'Renal & Microvascular Safety (10 Parameters)',
          items: ['Spot Urine Microalbumin-to-Creatinine Ratio (UACR)', 'Serum Creatinine, Blood Urea, Electrolytes, eGFR calculation'],
        },
        {
          groupName: 'Lipid Profile (7 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Ratios'],
        },
      ],
      clinicalConsultationIncluded: 'Reports reviewed by Endocrinology clinical specialists.',
      sampleRequirements: 'Venous blood (Fasting + 2hr PP) + Spot urine sample',
      fastingAndPrepInstructions: 'Overnight fasting 8 - 10 hours. Have your usual breakfast and return 2 hours later.',
      reportDeliveryHours: 'Digital report on HMIS portal in 4 hours.',
      accreditationStandard: 'NABL Certified Clinical Biochemistry Wing',
      specialLabPerks: ['Arogyasri beneficiary eligible for 100% free care', 'Dedicated central lab phlebotomy counters for senior citizens'],
    },
    fever_infection_panel: {
      packageName: 'NIMS Emergency Medicine Acute Febrile Tropical Infection Panel',
      facilityName: 'Nizam’s Institute of Medical Sciences (NIMS)',
      testCategoryId: 'fever_infection_panel',
      parametersCount: 22,
      highlightBadge: '24/7 Emergency Medicine Lab Processing',
      tagline: 'Emergency lab protocol for immediate isolation of Dengue, Malaria, Typhoid and bacteremia',
      packageDescription: 'Processed in the 24/7 emergency central laboratory of NIMS for rapid triage of febrile patients.',
      includedParameters: [
        {
          groupName: 'Hematology & Cell Kinetics (10 Parameters)',
          items: ['Complete Blood Count, Platelet Count, Hematocrit/PCV, Peripheral Smear for Malarial Parasites'],
        },
        {
          groupName: 'Infection Serology (8 Parameters)',
          items: ['Dengue NS1 Antigen, Dengue IgG & IgM Antibodies, Malaria Antigen (Pv/Pf), Typhoid Widal Test'],
        },
        {
          groupName: 'Inflammatory Index (4 Parameters)',
          items: ['Serum C-Reactive Protein (CRP), ESR'],
        },
      ],
      clinicalConsultationIncluded: 'Immediate alert to Emergency Medical Officer on duty if platelet count or septic markers are critical.',
      sampleRequirements: 'Venous Blood Sample',
      fastingAndPrepInstructions: 'No fasting required. Emergency collection open 24 hours.',
      reportDeliveryHours: 'Urgent stat report delivered within 2 hours.',
      accreditationStandard: 'NABL Certified Emergency Pathology Lab',
      specialLabPerks: ['Immediate access to NIMS acute care wards if emergency admission is required', 'Subsidized government pricing'],
    },
  },
};

// Fallback generator for other labs/cities to guarantee rich hospital-specific package variations
export function getHospitalLabPackage(labId: string, testCategoryId: string, labName?: string): HospitalLabPackage {
  // Check exact match
  if (HOSPITAL_SPECIFIC_PACKAGES[labId] && HOSPITAL_SPECIFIC_PACKAGES[labId][testCategoryId]) {
    return HOSPITAL_SPECIFIC_PACKAGES[labId][testCategoryId];
  }

  // Generate customized hospital package tailored to this specific facility
  const cleanName = labName || 'Accredited Facility Diagnostic Wing';
  const prefix = cleanName.split(' ')[0] || 'Hospital';

  if (testCategoryId === 'full_body_checkup') {
    return {
      packageName: `${prefix} Comprehensive Executive Health Package`,
      facilityName: cleanName,
      testCategoryId: 'full_body_checkup',
      parametersCount: 78,
      highlightBadge: `${prefix} NABL-Certified Health Protocol`,
      tagline: `Full body preventive assessment customized and certified by ${cleanName} clinical pathology team`,
      packageDescription: `Formulated specifically for patients visiting ${cleanName}. Covers 78 clinical parameters evaluating liver, renal, cardiovascular, metabolic, thyroid and hematologic functions.`,
      includedParameters: [
        {
          groupName: 'Complete Blood Picture & Hemogram (22 Parameters)',
          items: ['Hemoglobin, RBC, Total Leukocytes, Differential Count, Platelet Count, ESR, Peripheral Smear Review'],
        },
        {
          groupName: 'Cardiac & Lipid Metabolism (10 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Total/HDL Ratio, Atherogenic Index'],
        },
        {
          groupName: 'Liver & Renal Profiles (20 Parameters)',
          items: ['Bilirubin (Total & Direct), SGPT, SGOT, ALP, Total Protein, Albumin, Serum Creatinine, Blood Urea, Uric Acid, eGFR, Electrolytes (Na/K/Cl)'],
        },
        {
          groupName: 'Endocrine & Metabolic (8 Parameters)',
          items: ['Ultrasensitive TSH, Fasting Blood Glucose, HbA1c (Glycated Hemoglobin)'],
        },
        {
          groupName: 'Urine Routine & Microscopic (18 Parameters)',
          items: ['Physical, Chemical and Automated Microscopic examination of clean-catch urine'],
        },
      ],
      clinicalConsultationIncluded: `Includes digital report review with ${cleanName} Senior Medical Officer.`,
      sampleRequirements: '10 mL Venous Blood + Morning Midstream Urine Specimen',
      fastingAndPrepInstructions: '10 to 12 hours overnight fasting mandatory. Water permitted.',
      reportDeliveryHours: 'Digital report dispatched via SMS and patient portal in 4 - 6 hours.',
      accreditationStandard: 'NABL & ISO 15189 Certified Quality Standard',
      specialLabPerks: ['Barcoded vacuum sample tubes to prevent mix-ups', 'Free digital health records archive for 5 years'],
    };
  }

  if (testCategoryId === 'cardiac_risk_panel') {
    return {
      packageName: `${prefix} Cardio-Care Precision Risk Evaluation Suite`,
      facilityName: cleanName,
      testCategoryId: 'cardiac_risk_panel',
      parametersCount: 19,
      highlightBadge: `${prefix} Cardiovascular Diagnostics`,
      tagline: `Targeted cardiovascular risk screening evaluating arterial inflammation and cardiac rhythm at ${cleanName}`,
      packageDescription: `Customized cardiovascular screening protocol conducted at ${cleanName}, combining high-sensitivity myocardial biomarkers, lipid fractions, and a certified 12-lead digital ECG.`,
      includedParameters: [
        {
          groupName: 'Cardiac Biomarkers & Inflammation (5 Parameters)',
          items: ['High-Sensitivity C-Reactive Protein (hs-CRP)', 'Serum Homocysteine (Vascular Thrombosis marker)', 'Cardiac Troponin qualitative screening'],
        },
        {
          groupName: 'Lipid Risk Panel (9 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL, Risk Ratios'],
        },
        {
          groupName: '12-Lead Electrocardiography (5 Parameters)',
          items: ['12-Lead Digital ECG with computerized rhythm and ST-segment interpretation'],
        },
      ],
      clinicalConsultationIncluded: `ECG report countersigned by on-duty physician at ${cleanName}.`,
      sampleRequirements: 'Venous Blood + 12-Lead Resting ECG Leads',
      fastingAndPrepInstructions: 'Fasting 10 hours for lipid profile. Avoid caffeine 2 hours before the ECG.',
      reportDeliveryHours: 'ECG result immediate; complete certified blood panel in 3 hours.',
      accreditationStandard: 'NABL Accredited Clinical Laboratory',
      specialLabPerks: ['Priority reporting for patients experiencing palpitations or chest tightness', 'Direct digital delivery'],
    };
  }

  if (testCategoryId === 'advanced_imaging_scans') {
    return {
      packageName: `${prefix} High-Definition Digital MRI & Multi-Slice CT Scan`,
      facilityName: cleanName,
      testCategoryId: 'advanced_imaging_scans',
      parametersCount: 15,
      highlightBadge: `${prefix} Advanced Radio-Diagnosis Wing`,
      tagline: `High-resolution cross-sectional imaging with certified radiologist interpretation at ${cleanName}`,
      packageDescription: `Imaging suite at ${cleanName} equipped with modern multi-slice scanners and specialized body coils for anatomical visualization and diagnostic certainty.`,
      includedParameters: [
        {
          groupName: 'Multi-Sequence Scanning Protocol',
          items: ['T1, T2, FLAIR, STIR and Gradient Echo high-contrast sequence acquisition', 'Sub-millimeter multi-planar volumetric slice reconstructions'],
        },
        {
          groupName: 'Contrast Option & Safety',
          items: ['Non-ionic contrast media administered by trained radiological technologists', 'Pre-procedure renal safety review (Serum Creatinine confirmation)'],
        },
      ],
      imagingSpecifications: {
        scannerTechnology: 'Modern High-Field Superconducting Scanner & Multi-Slice Spiral CT',
        contrastIncluded: 'Available and administered when clinically indicated by physician',
        sliceOrFieldStrength: 'High Field Strength / Multi-Slice Volume Acquisition',
        reportingRadiologist: `Double-verified by Senior Consultant Radiologists at ${cleanName}`,
      },
      clinicalConsultationIncluded: `Formal written radiology report signed by senior imaging specialist with key findings highlighted.`,
      sampleRequirements: 'None (Physical scanner examination).',
      fastingAndPrepInstructions: '4 hours fasting if IV contrast is prescribed. Remove all metal items before entering scanner room.',
      reportDeliveryHours: 'Cloud PACS link within 1 hour; detailed written report in 3 hours.',
      accreditationStandard: 'AERB & NABL Certified Diagnostic Facility',
      specialLabPerks: ['Comfort-contoured patient bed with active noise cancellation', 'Immediate DICOM viewer link sent to patient smartphone'],
    };
  }

  if (testCategoryId === 'diabetes_care_package') {
    return {
      packageName: `${prefix} Comprehensive Diabetes Management & Organ Shield Panel`,
      facilityName: cleanName,
      testCategoryId: 'diabetes_care_package',
      parametersCount: 22,
      highlightBadge: `${prefix} Endocrine & Glycemic Protocol`,
      tagline: `Accurate HPLC glycation tracking and microvascular complications screening at ${cleanName}`,
      packageDescription: `Customized diabetes management package at ${cleanName} tracking 3-month glycemic binding, immediate glucose surges, and early nephropathy microalbumin markers.`,
      includedParameters: [
        {
          groupName: 'Glycemic Profiling (5 Parameters)',
          items: ['HbA1c by certified HPLC method', 'Average Estimated Blood Sugar (eAG)', 'Fasting Blood Sugar (FBS)', 'Post-Prandial Blood Sugar (PPBS - 2 hours)'],
        },
        {
          groupName: 'Kidney Safety & Microalbuminuria (9 Parameters)',
          items: ['Spot Urine Microalbumin-to-Creatinine Ratio (UACR)', 'Serum Creatinine, Blood Urea Nitrogen, eGFR calculation, Electrolytes'],
        },
        {
          groupName: 'Lipid Comorbidity Panel (8 Parameters)',
          items: ['Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Non-HDL cholesterol'],
        },
      ],
      clinicalConsultationIncluded: `Report includes color-coded glycemic risk staging and reference range guide.`,
      sampleRequirements: 'Venous blood (Fasting + 2hr PP) + Spot morning urine',
      fastingAndPrepInstructions: '8 - 10 hours overnight fasting. Have breakfast and return 2 hours later for second draw.',
      reportDeliveryHours: 'Digital report dispatched within 3 hours.',
      accreditationStandard: 'NABL Certified Clinical Biochemistry',
      specialLabPerks: ['Express diabetic phlebotomy counter', 'Quarterly re-test reminder service'],
    };
  }

  // fever_infection_panel
  return {
    packageName: `${prefix} Acute Fever Differential & Infection Serology Panel`,
    facilityName: cleanName,
    testCategoryId: 'fever_infection_panel',
    parametersCount: 22,
    highlightBadge: `${prefix} Emergency Response Serology`,
    tagline: `Rapid diagnostic panel isolating vector-borne and common tropical infections at ${cleanName}`,
    packageDescription: `Acute fever diagnostic panel formulated at ${cleanName} to rapidly isolate Dengue, Malaria, Typhoid, and bacterial infections with priority emergency turnaround.`,
    includedParameters: [
      {
        groupName: 'Complete Hemogram & Platelet Kinetics (12 Parameters)',
        items: ['Complete Blood Count with 5-part Differential, Platelet Count, Hematocrit/PCV, Peripheral Smear'],
      },
      {
        groupName: 'Specific Infection Serology (6 Parameters)',
        items: ['Dengue NS1 Early Antigen, Dengue IgG/IgM Antibodies, Malaria Antigen (Pv/Pf), Typhoid Widal Titres'],
      },
      {
        groupName: 'Systemic Inflammation (4 Parameters)',
        items: ['Quantitative C-Reactive Protein (CRP), Erythrocyte Sedimentation Rate (ESR)'],
      },
    ],
    clinicalConsultationIncluded: `Immediate telephone notification to patient/physician if critical platelet count (<80,000) is detected.`,
    sampleRequirements: 'Venous Blood Sample',
    fastingAndPrepInstructions: 'No fasting required. Walk-in test available any time.',
    reportDeliveryHours: 'STAT Turnaround: Certified digital report within 2 hours.',
    accreditationStandard: 'NABL Certified Hematology & Pathology',
    specialLabPerks: ['Priority fever triage phlebotomy counter', 'Automated SMS delivery of platelet count as soon as verified'],
  };
}
