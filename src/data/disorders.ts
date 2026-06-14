// Disorder data type used across the app.
// Content is paraphrased educational summary, NOT verbatim DSM-5-TR text.
export type CategorySlug =
  | 'anxiety'
  | 'mood'
  | 'trauma'
  | 'personality'
  | 'neuro'
  | 'psychotic'
  | 'substance'
  | 'eating'
  | 'ocd'
  | 'sleep'
  | 'dissociative'
  | 'neurocognitive';

export interface Disorder {
  id: string;
  name: string;
  shortName?: string;
  category: CategorySlug;
  icd10?: string;
  icd11?: string;
  prevalence?: string;
  onsetTypical?: string;
  overviewSimple: string;
  overviewClinical: string;
  criteriaSummary: string[];
  symptoms?: {
    cognitive?: string[];
    emotional?: string[];
    behavioral?: string[];
    physical?: string[];
  };
  severity?: { mild: string; moderate: string; severe: string };
  riskFactors?: { biological?: string[]; environmental?: string[]; social?: string[] };
  comorbidities?: string[];
  differentials?: string[];
  /**
   * Structured differential diagnosis — DSM-aligned format, paraphrased
   * (not verbatim DSM-5-TR text). Each entry covers one similar disorder
   * with key distinguishing features, symptom overlap, and rule-out guidance.
   */
  differentialDetailed?: Array<{
    disorder: string;
    distinguishing: string;     // Key distinguishing feature(s)
    overlap?: string;            // Symptom overlap analysis
    ruleOut?: string;            // DSM rule-out guidance
  }>;
  durationCriteria?: string;     // Required duration / time course
  functionalImpairment?: string; // Functional impairment criterion summary
  associatedFeatures?: string[]; // Associated features supporting diagnosis
  specifiers?: string[];         // DSM specifiers (e.g., with anxious distress)
  clinicalNotes?: string[];      // Clinician-oriented notes
  ruleOuts?: string[];           // Conditions/causes that must be excluded
  /** Course specifiers (e.g., single episode, recurrent, in partial remission). */
  courseSpecifiers?: string[];
  /** Developmental considerations across the lifespan. */
  developmentalConsiderations?: string;
  /** Cultural considerations affecting presentation, idioms of distress, help-seeking. */
  culturalConsiderations?: string;
  /** Gender/sex-related considerations in prevalence, presentation, or course. */
  genderConsiderations?: string;
  /** Prognostic factors — temperamental, environmental, genetic/physiological, course modifiers. */
  prognosticFactors?: {
    temperamental?: string[];
    environmental?: string[];
    geneticPhysiological?: string[];
    courseModifiers?: string[];
  };
  /** Diagnostic markers — labs, imaging, physiologic findings, psychometric measures. */
  diagnosticMarkers?: string[];
  /** Suicide / self-harm risk information where applicable. */
  suicideRisk?: string;
  /** Functional consequences across major life domains. */
  functionalConsequences?: string[];
  treatments?: { therapies?: string[]; medicationClasses?: string[]; lifestyle?: string[] };
  warnings?: string[];
  relatedIds?: string[];
  keywords: string[]; // search synonyms
}

export interface CategoryMeta {
  slug: CategorySlug;
  name: string;
  description: string;
  colorVar: string; // hsl variable
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: 'anxiety', name: 'Anxiety Disorders', description: 'Excessive fear, worry, and related behavioral disturbances.', colorVar: 'var(--cat-anxiety)' },
  { slug: 'mood', name: 'Depressive & Bipolar', description: 'Disturbances of mood, energy, and motivation.', colorVar: 'var(--cat-mood)' },
  { slug: 'trauma', name: 'Trauma & Stressor-Related', description: 'Conditions following exposure to traumatic or stressful events.', colorVar: 'var(--cat-trauma)' },
  { slug: 'ocd', name: 'OCD & Related', description: 'Obsessions, compulsions, and repetitive behaviors.', colorVar: 'var(--cat-psychotic)' },
  { slug: 'personality', name: 'Personality Disorders', description: 'Enduring patterns of inner experience and behavior.', colorVar: 'var(--cat-personality)' },
  { slug: 'neuro', name: 'Neurodevelopmental', description: 'Conditions with onset in the developmental period.', colorVar: 'var(--cat-neuro)' },
  { slug: 'psychotic', name: 'Schizophrenia Spectrum', description: 'Psychotic features including delusions and hallucinations.', colorVar: 'var(--cat-psychotic)' },
  { slug: 'substance', name: 'Substance-Related', description: 'Disorders involving substance use and addictive behaviors.', colorVar: 'var(--cat-substance)' },
  { slug: 'eating', name: 'Feeding & Eating', description: 'Persistent disturbance of eating or eating-related behavior.', colorVar: 'var(--cat-eating)' },
  { slug: 'sleep', name: 'Sleep–Wake', description: 'Disorders of sleep quality, timing, and amount.', colorVar: 'var(--cat-anxiety)' },
  { slug: 'dissociative', name: 'Dissociative', description: 'Disruption of consciousness, memory, identity, or perception.', colorVar: 'var(--cat-trauma)' },
  { slug: 'neurocognitive', name: 'Neurocognitive', description: 'Acquired decline in cognitive functioning.', colorVar: 'var(--cat-neuro)' },
];

export const DISORDERS: Disorder[] = [
  {
    id: 'mdd',
    name: 'Major Depressive Disorder',
    shortName: 'MDD',
    category: 'mood',
    icd10: 'F32 / F33',
    prevalence: '~7% adults / year',
    onsetTypical: 'Late teens to mid-20s',
    overviewSimple: 'A condition where a person feels deeply sad, empty, or unable to enjoy life for at least two weeks, affecting daily functioning.',
    overviewClinical: 'Characterized by one or more major depressive episodes — at least 2 weeks of depressed mood or anhedonia plus additional cognitive, neurovegetative, and somatic symptoms causing significant distress or impairment.',
    criteriaSummary: [
      'Five or more depressive symptoms during the same 2-week period.',
      'At least one symptom is depressed mood or loss of interest/pleasure.',
      'Symptoms cause clinically significant distress or impairment.',
      'Not attributable to a substance or other medical condition.',
      'Episode is not better explained by a psychotic disorder.',
    ],
    symptoms: {
      emotional: ['Persistent sadness', 'Hopelessness', 'Anhedonia', 'Excessive guilt', 'Worthlessness'],
      cognitive: ['Difficulty concentrating', 'Indecisiveness', 'Recurrent thoughts of death'],
      behavioral: ['Social withdrawal', 'Reduced productivity', 'Psychomotor slowing or agitation'],
      physical: ['Sleep disturbance', 'Fatigue', 'Appetite or weight changes'],
    },
    severity: {
      mild: 'Few symptoms beyond required, minor functional impairment.',
      moderate: 'Symptoms or impairment between mild and severe.',
      severe: 'Most symptoms present; markedly interferes with functioning.',
    },
    riskFactors: {
      biological: ['Family history', 'Neurochemical imbalances', 'Female sex (post-puberty)'],
      environmental: ['Adverse childhood experiences', 'Recent loss', 'Chronic illness'],
      social: ['Isolation', 'Low social support', 'Socioeconomic stress'],
    },
    comorbidities: ['Anxiety disorders', 'Substance use disorders', 'Chronic pain'],
    differentials: ['Persistent Depressive Disorder', 'Bipolar Depression', 'Adjustment Disorder', 'Bereavement'],
    differentialDetailed: [
      { disorder: 'Bipolar Depression', distinguishing: 'Prior or current manic/hypomanic episode is the defining feature; depression alone never establishes bipolarity.', overlap: 'Depressive phenomenology (anhedonia, neurovegetative symptoms, suicidality) is often indistinguishable cross-sectionally.', ruleOut: 'Obtain a careful lifetime mood history and collateral information before initiating antidepressant monotherapy.' },
      { disorder: 'Persistent Depressive Disorder', distinguishing: 'Chronic course (≥2 years) of milder depressive symptoms rather than discrete major episodes.', overlap: 'Low mood, low energy, low self-esteem are shared.', ruleOut: 'Both diagnoses may co-occur ("double depression") when MDD episodes punctuate a chronic baseline.' },
      { disorder: 'Adjustment Disorder with depressed mood', distinguishing: 'Symptoms develop within 3 months of an identifiable stressor and do not meet full MDD threshold.', overlap: 'Sad mood, tearfulness, mild withdrawal.', ruleOut: 'If full MDD criteria are met following a stressor, diagnose MDD rather than adjustment disorder.' },
      { disorder: 'Normal bereavement / prolonged grief', distinguishing: 'Distress is centered on the loss, comes in waves, and self-esteem is generally preserved.', overlap: 'Sadness, sleep and appetite disruption, social withdrawal.', ruleOut: 'Pervasive worthlessness, suicidal ideation unrelated to the deceased, or psychomotor retardation favor MDD.' },
      { disorder: 'Substance/medication-induced depressive disorder', distinguishing: 'Symptoms develop during or shortly after intoxication, withdrawal, or exposure to a known depressogenic agent.', overlap: 'Full depressive syndrome can be reproduced.', ruleOut: 'Reassess after sustained abstinence or removal of the agent.' },
      { disorder: 'Depressive disorder due to another medical condition', distinguishing: 'Direct pathophysiological consequence of a medical illness (e.g., hypothyroidism, stroke, Parkinson disease).', overlap: 'Identical mood symptoms.', ruleOut: 'Screen TSH, B12, and consider neuroimaging where indicated.' },
    ],
    durationCriteria: '≥2 weeks of continuous symptoms, most of the day, nearly every day.',
    functionalImpairment: 'Clinically significant distress or impairment in social, occupational, academic, or other important areas of functioning.',
    associatedFeatures: ['Tearfulness', 'Irritability (especially in youth)', 'Brooding/rumination', 'Somatic complaints (pain, GI)', 'Reduced libido'],
    specifiers: ['With anxious distress', 'With mixed features', 'With melancholic features', 'With atypical features', 'With psychotic features', 'With catatonia', 'With peripartum onset', 'With seasonal pattern'],
    ruleOuts: ['Substance/medication-induced mood symptoms', 'Hypothyroidism / endocrine causes', 'Bipolar disorder (prior mania/hypomania)', 'Psychotic disorder primary'],
    clinicalNotes: ['Always screen for suicidality and access to means.', 'Document any lifetime hypomania/mania before starting antidepressant monotherapy.', 'Reassess diagnosis if response is partial after 6–8 weeks at adequate dose.'],
    courseSpecifiers: ['Single episode', 'Recurrent', 'In partial remission', 'In full remission', 'Chronic (continuous ≥2 years)'],
    developmentalConsiderations: 'Children and adolescents more often present with irritability, somatic complaints, or school refusal than overt sadness. Older adults more commonly present with cognitive complaints, somatic preoccupation, and apathy that can mimic neurocognitive disorder ("pseudodementia").',
    culturalConsiderations: 'Idioms of distress vary widely: somatic emphasis (headache, weakness, "nerves") is common in many cultures and may eclipse mood complaints. Help-seeking pathways, stigma, and the framing of guilt vs. shame influence presentation. Assess in the patient\'s preferred language when possible.',
    genderConsiderations: 'Lifetime prevalence is roughly 1.5–3× higher in females from adolescence onward. Female-specific course modifiers include premenstrual exacerbation, peripartum onset, and perimenopausal recurrence. Males more often present with irritability, anger, substance use, and complete suicide at higher rates.',
    prognosticFactors: {
      temperamental: ['High neuroticism / negative affectivity', 'Early-onset rumination'],
      environmental: ['Adverse childhood experiences', 'Recent loss or chronic stress', 'Low social support'],
      geneticPhysiological: ['First-degree relative with MDD (2–4× risk)', 'Chronic medical illness (CVD, diabetes, chronic pain)'],
      courseModifiers: ['Earlier age at onset predicts longer, more recurrent course', 'Residual symptoms between episodes increase relapse risk', 'Comorbid anxiety or substance use worsens prognosis'],
    },
    diagnosticMarkers: ['No diagnostic laboratory test is confirmatory.', 'PHQ-9 supports screening, severity tracking, and treatment monitoring.', 'TSH, B12/folate, CBC, BMP, vitamin D recommended to rule out medical contributors.', 'Polysomnography may show reduced REM latency and slow-wave sleep deficits (research finding, not diagnostic).'],
    suicideRisk: 'Lifetime suicide risk is markedly elevated; ~50% of suicide decedents had a mood disorder. Assess ideation, intent, plan, access to means, prior attempts, hopelessness, command hallucinations, agitation, recent discharge, and acute losses at every visit. Mixed features, severe insomnia, and comorbid substance use further elevate near-term risk. Safety planning and means restriction are first-line non-pharmacologic interventions.',
    functionalConsequences: ['Occupational impairment: presenteeism, absenteeism, job loss', 'Academic decline and school dropout in youth', 'Disruption of intimate, parenting, and peer relationships', 'Reduced self-care, medication adherence, and worse outcomes in comorbid medical illness', 'Increased all-cause mortality independent of suicide'],
    treatments: {
      therapies: ['Cognitive Behavioral Therapy (CBT)', 'Behavioral Activation', 'Interpersonal Therapy'],
      medicationClasses: ['SSRIs', 'SNRIs', 'Atypical antidepressants'],
      lifestyle: ['Regular aerobic exercise', 'Sleep hygiene', 'Social connection'],
    },
    warnings: ['Suicidal ideation requires urgent professional evaluation.'],
    relatedIds: ['pdd', 'bd1', 'gad'],
    keywords: ['depression', 'sad', 'sadness', 'hopeless', 'empty', 'no energy', 'anhedonia', 'cant enjoy', 'crying', 'mdd', 'low mood', 'tired all the time'],
  },
  {
    id: 'pdd',
    name: 'Persistent Depressive Disorder',
    shortName: 'PDD (Dysthymia)',
    category: 'mood',
    icd10: 'F34.1',
    overviewSimple: 'A long-lasting (2+ years) low-grade depression where a person rarely feels truly happy.',
    overviewClinical: 'Chronic depressed mood for most of the day, more days than not, for at least 2 years (1 year in youth), with associated symptoms.',
    criteriaSummary: [
      'Depressed mood most of the day, more days than not, ≥2 years.',
      'Two or more associated symptoms while depressed.',
      'No symptom-free period >2 months during this time.',
      'Causes significant distress or impairment.',
    ],
    symptoms: {
      emotional: ['Chronic low mood', 'Hopelessness', 'Low self-esteem'],
      cognitive: ['Poor concentration', 'Difficulty making decisions'],
      physical: ['Low energy', 'Appetite changes', 'Sleep disturbance'],
    },
    treatments: { therapies: ['CBT', 'Interpersonal Therapy'], medicationClasses: ['SSRIs', 'SNRIs'] },
    differentials: ['Major Depressive Disorder', 'Cyclothymic Disorder'],
    relatedIds: ['mdd'],
    keywords: ['dysthymia', 'chronic depression', 'always sad', 'long term low mood'],
  },
  {
    id: 'bd1',
    name: 'Bipolar I Disorder',
    category: 'mood',
    icd10: 'F31',
    overviewSimple: 'A mood condition that involves at least one episode of mania — extreme energy, elation, or irritability — often alternating with depression.',
    overviewClinical: 'Defined by at least one manic episode lasting ≥1 week (or any duration if hospitalization required), often with depressive episodes.',
    criteriaSummary: [
      'At least one manic episode meeting full criteria.',
      'Manic episode not better explained by other conditions.',
      'Hypomanic and depressive episodes are common but not required.',
    ],
    symptoms: {
      emotional: ['Elevated or irritable mood', 'Grandiosity'],
      behavioral: ['Decreased need for sleep', 'Pressured speech', 'Risky behavior', 'Goal-directed hyperactivity'],
      cognitive: ['Racing thoughts', 'Distractibility'],
    },
    differentials: ['Bipolar II', 'Borderline Personality Disorder', 'Schizoaffective', 'Substance-Induced Mood Disorder'],
    treatments: {
      therapies: ['Psychoeducation', 'CBT', 'Family-focused therapy'],
      medicationClasses: ['Mood stabilizers (lithium, valproate)', 'Atypical antipsychotics'],
      lifestyle: ['Regular sleep schedule', 'Mood charting'],
    },
    warnings: ['Manic episodes can include dangerous risk-taking; psychiatric evaluation needed.'],
    relatedIds: ['bd2', 'mdd', 'bpd'],
    keywords: ['bipolar', 'mania', 'manic', 'mood swings', 'high and low', 'cant sleep but energetic'],
  },
  {
    id: 'bd2',
    name: 'Bipolar II Disorder',
    category: 'mood',
    icd10: 'F31.81',
    overviewSimple: 'Recurrent depressive episodes alternating with hypomania (a milder elevated mood) — without full mania.',
    overviewClinical: 'At least one hypomanic episode and one major depressive episode; never a full manic episode.',
    criteriaSummary: ['≥1 hypomanic episode (≥4 days)', '≥1 major depressive episode', 'No history of mania'],
    symptoms: { emotional: ['Hypomanic elevation', 'Depressive lows'] },
    relatedIds: ['bd1', 'mdd'],
    keywords: ['bipolar 2', 'hypomania', 'mild mania'],
  },
  {
    id: 'gad',
    name: 'Generalized Anxiety Disorder',
    shortName: 'GAD',
    category: 'anxiety',
    icd10: 'F41.1',
    onsetTypical: 'Median age ~30',
    overviewSimple: 'Persistent, excessive worry about everyday things that is hard to control and causes physical tension.',
    overviewClinical: 'Excessive anxiety and worry occurring more days than not for ≥6 months, about a number of events or activities.',
    criteriaSummary: [
      'Excessive anxiety and worry ≥6 months.',
      'Difficulty controlling the worry.',
      'Three or more associated symptoms (one in children).',
      'Significant distress or impairment.',
    ],
    symptoms: {
      cognitive: ['Constant worry', 'Difficulty concentrating', 'Mind going blank'],
      emotional: ['Restlessness', 'Feeling on edge'],
      physical: ['Muscle tension', 'Fatigue', 'Sleep disturbance', 'Irritability'],
    },
    treatments: {
      therapies: ['CBT', 'Acceptance and Commitment Therapy', 'Mindfulness-Based Stress Reduction'],
      medicationClasses: ['SSRIs', 'SNRIs', 'Buspirone'],
      lifestyle: ['Reduce caffeine', 'Regular exercise', 'Sleep hygiene'],
    },
    differentials: ['Panic Disorder', 'Social Anxiety', 'OCD', 'Adjustment Disorder'],
    differentialDetailed: [
      { disorder: 'Panic Disorder', distinguishing: 'Discrete, abrupt panic attacks with prominent somatic crescendo rather than diffuse, persistent worry.', overlap: 'Autonomic arousal, anticipatory anxiety.', ruleOut: 'Worry in GAD is broad and future-oriented; worry in PD focuses on having further attacks.' },
      { disorder: 'Social Anxiety Disorder', distinguishing: 'Fear is specific to scrutiny in social situations.', overlap: 'Anticipatory anxiety, avoidance, somatic tension.', ruleOut: 'If anxiety appears only in social-evaluative contexts, prefer SAD.' },
      { disorder: 'Obsessive-Compulsive Disorder', distinguishing: 'Worry in OCD is ego-dystonic, repetitive, and tied to compulsive neutralization.', overlap: 'Intrusive thoughts, doubt.', ruleOut: 'Absence of compulsions and ego-syntonic worry favor GAD.' },
      { disorder: 'Adjustment Disorder with anxiety', distinguishing: 'Identifiable stressor within 3 months; duration limited.', overlap: 'Worry, tension, sleep disruption.', ruleOut: 'Diagnose GAD only when symptoms persist ≥6 months independent of a stressor.' },
      { disorder: 'Anxiety due to another medical condition', distinguishing: 'Pathophysiological link to medical illness (hyperthyroidism, pheochromocytoma, cardiopulmonary disease).', overlap: 'Restlessness, palpitations, tremor.', ruleOut: 'Targeted medical workup when symptom onset is atypical or new in mid-/late life.' },
      { disorder: 'Substance-induced anxiety', distinguishing: 'Onset with intoxication or withdrawal (caffeine, stimulants, alcohol/benzodiazepine withdrawal).', overlap: 'Hyperarousal, insomnia, irritability.', ruleOut: 'Reassess after sustained abstinence.' },
    ],
    durationCriteria: 'Excessive anxiety and worry occurring more days than not for ≥6 months.',
    functionalImpairment: 'Causes significant distress or impairment in social, occupational, or other important domains.',
    associatedFeatures: ['Headaches', 'GI distress', 'Trembling', 'Sweating', 'Exaggerated startle'],
    ruleOuts: ['Hyperthyroidism', 'Stimulant or caffeine excess', 'Cardiac arrhythmia', 'Substance withdrawal'],
    clinicalNotes: ['Worry topics in GAD are typically multiple and shifting.', 'Avoid long-term benzodiazepine monotherapy where possible.', 'CBT and SSRIs/SNRIs are first-line.'],
    relatedIds: ['pd', 'sad', 'mdd'],
    keywords: ['anxiety', 'worry', 'always worried', 'tense', 'on edge', 'cant relax', 'gad', 'overthinking'],
  },
  {
    id: 'pd',
    name: 'Panic Disorder',
    category: 'anxiety',
    icd10: 'F41.0',
    overviewSimple: 'Sudden, intense waves of fear (panic attacks) that come without warning, often with strong physical symptoms.',
    overviewClinical: 'Recurrent unexpected panic attacks plus persistent concern about additional attacks or maladaptive behavior change.',
    criteriaSummary: [
      'Recurrent unexpected panic attacks.',
      '≥1 month of worry about more attacks or behavioral change.',
      'Not attributable to substances or another medical condition.',
    ],
    symptoms: {
      physical: ['Heart palpitations', 'Sweating', 'Shortness of breath', 'Chest pain', 'Dizziness'],
      cognitive: ['Fear of losing control', 'Fear of dying', 'Derealization'],
    },
    treatments: { therapies: ['CBT with interoceptive exposure'], medicationClasses: ['SSRIs', 'SNRIs'] },
    relatedIds: ['gad', 'agora'],
    keywords: ['panic', 'panic attack', 'cant breathe', 'heart racing', 'feel like dying'],
  },
  {
    id: 'sad',
    name: 'Social Anxiety Disorder',
    category: 'anxiety',
    icd10: 'F40.10',
    overviewSimple: 'Strong fear of being judged, embarrassed, or rejected in social situations, often leading to avoidance.',
    overviewClinical: 'Marked fear or anxiety about one or more social situations involving possible scrutiny by others.',
    criteriaSummary: [
      'Fear of social situations with possible scrutiny.',
      'Fear of acting in a way that will be negatively evaluated.',
      'Social situations almost always provoke anxiety.',
      'Persistent ≥6 months; significant impairment.',
    ],
    symptoms: { emotional: ['Intense fear of judgment'], behavioral: ['Avoidance of social situations'], physical: ['Blushing', 'Trembling', 'Sweating'] },
    treatments: { therapies: ['CBT with exposure', 'Social skills training'], medicationClasses: ['SSRIs', 'SNRIs', 'Beta-blockers (performance only)'] },
    relatedIds: ['gad', 'avpd'],
    keywords: ['social anxiety', 'shy', 'afraid of people', 'fear of judgement', 'public speaking fear', 'fear of social situations'],
  },
  {
    id: 'agora',
    name: 'Agoraphobia',
    category: 'anxiety',
    icd10: 'F40.00',
    overviewSimple: 'Fear of places or situations where escape might be hard, such as crowds or open spaces, often leading to staying home.',
    overviewClinical: 'Marked fear or anxiety about ≥2 of: public transport, open spaces, enclosed spaces, crowds, or being outside the home alone.',
    criteriaSummary: ['Fear of ≥2 agoraphobic situations', 'Active avoidance', 'Persistent ≥6 months'],
    symptoms: { behavioral: ['Avoidance of crowds, transit, open spaces'], emotional: ['Anticipatory anxiety'] },
    relatedIds: ['pd'],
    keywords: ['agoraphobia', 'afraid of leaving house', 'crowd fear'],
  },
  {
    id: 'specphobia',
    name: 'Specific Phobia',
    category: 'anxiety',
    icd10: 'F40.2',
    overviewSimple: 'Strong, lasting fear of a specific object or situation (e.g., heights, spiders, flying).',
    overviewClinical: 'Marked fear about a specific object or situation that is actively avoided or endured with intense distress.',
    criteriaSummary: ['Fear of a specific object/situation', 'Almost always provokes immediate fear', 'Persistent ≥6 months'],
    symptoms: { emotional: ['Immediate fear response'], behavioral: ['Avoidance'] },
    treatments: { therapies: ['Exposure therapy'] },
    keywords: ['phobia', 'afraid of heights', 'afraid of spiders', 'fear of flying'],
  },
  {
    id: 'ptsd',
    name: 'Post-Traumatic Stress Disorder',
    shortName: 'PTSD',
    category: 'trauma',
    icd10: 'F43.10',
    overviewSimple: 'Lasting distress after a traumatic event, including flashbacks, avoidance, and feeling on guard.',
    overviewClinical: 'Develops after exposure to actual or threatened death, serious injury, or sexual violence; involves intrusion, avoidance, negative cognition/mood, and hyperarousal symptoms ≥1 month.',
    criteriaSummary: [
      'Exposure to traumatic event (direct, witnessed, or learned).',
      'Intrusion symptoms (flashbacks, nightmares).',
      'Persistent avoidance of trauma reminders.',
      'Negative alterations in cognitions and mood.',
      'Marked alterations in arousal and reactivity.',
      'Duration >1 month with significant impairment.',
    ],
    symptoms: {
      cognitive: ['Flashbacks', 'Negative beliefs about self/world', 'Memory gaps'],
      emotional: ['Persistent fear, horror, anger', 'Detachment', 'Inability to feel positive emotions'],
      behavioral: ['Avoidance', 'Hypervigilance', 'Reckless behavior'],
      physical: ['Exaggerated startle', 'Sleep disturbance'],
    },
    treatments: { therapies: ['Trauma-focused CBT', 'EMDR', 'Prolonged Exposure'], medicationClasses: ['SSRIs', 'Prazosin (nightmares)'] },
    differentials: ['Acute Stress Disorder', 'Adjustment Disorder', 'Dissociative Disorders'],
    differentialDetailed: [
      { disorder: 'Acute Stress Disorder', distinguishing: 'Same symptom domains but duration 3 days–1 month after trauma.', overlap: 'Intrusion, avoidance, arousal, dissociation.', ruleOut: 'If symptoms persist >1 month, transition diagnosis to PTSD.' },
      { disorder: 'Adjustment Disorder', distinguishing: 'Stressor need not meet Criterion A; symptom pattern does not meet full PTSD criteria.', overlap: 'Distress, sleep disturbance, low mood.', ruleOut: 'Use PTSD when full symptom clusters are present after a qualifying trauma.' },
      { disorder: 'Major Depressive Disorder', distinguishing: 'No trauma-specific re-experiencing or avoidance.', overlap: 'Anhedonia, sleep disturbance, negative cognitions.', ruleOut: 'Both may co-occur; diagnose both when each is fully met.' },
      { disorder: 'Panic Disorder', distinguishing: 'Panic attacks are unexpected and not cued by trauma reminders.', overlap: 'Autonomic arousal, fear of recurrence.', ruleOut: 'Trauma-cued reactivity favors PTSD.' },
      { disorder: 'Dissociative disorders', distinguishing: 'Dissociation is the predominant feature, not embedded in a trauma syndrome.', overlap: 'Depersonalization, derealization, amnesia.', ruleOut: 'Use PTSD dissociative subtype when criteria for PTSD are met.' },
      { disorder: 'Borderline Personality Disorder', distinguishing: 'Pervasive instability across identity, affect, and relationships predates trauma context.', overlap: 'Hyperreactivity, dissociation, self-destructive behavior.', ruleOut: 'Comorbidity is common; longitudinal pattern guides primary diagnosis.' },
    ],
    durationCriteria: 'Symptom duration >1 month following exposure to a qualifying traumatic event.',
    functionalImpairment: 'Clinically significant distress or impairment in social, occupational, or other important areas.',
    associatedFeatures: ['Survivor guilt', 'Dissociative symptoms', 'Somatic complaints', 'Anger outbursts'],
    specifiers: ['With dissociative symptoms (depersonalization or derealization)', 'With delayed expression'],
    ruleOuts: ['Substance/medication effects', 'Traumatic brain injury without psychiatric criteria', 'Other primary psychiatric disorder'],
    clinicalNotes: ['Use a validated structured measure (e.g., PCL-5) to track symptoms.', 'Assess suicide risk at every visit.', 'Trauma-focused psychotherapies have the strongest evidence base.'],
    warnings: ['Suicide risk is elevated; assess safety.'],
    relatedIds: ['asd', 'mdd'],
    keywords: ['ptsd', 'trauma', 'flashbacks', 'nightmares', 'cant forget', 'hypervigilant', 'startle'],
  },
  {
    id: 'asd',
    name: 'Acute Stress Disorder',
    category: 'trauma',
    icd10: 'F43.0',
    overviewSimple: 'Severe stress reactions occurring 3 days to 1 month after a traumatic event.',
    overviewClinical: 'Symptom pattern similar to PTSD but lasting 3 days to 1 month after trauma exposure.',
    criteriaSummary: ['Trauma exposure', '≥9 symptoms across intrusion, mood, dissociation, avoidance, arousal', 'Duration 3 days–1 month'],
    symptoms: { emotional: ['Numbing', 'Anxiety'], cognitive: ['Dissociation', 'Intrusive memories'] },
    relatedIds: ['ptsd'],
    keywords: ['acute stress', 'recent trauma'],
  },
  {
    id: 'ocd',
    name: 'Obsessive-Compulsive Disorder',
    shortName: 'OCD',
    category: 'ocd',
    icd10: 'F42',
    overviewSimple: 'Unwanted intrusive thoughts (obsessions) that lead to repeated behaviors or mental acts (compulsions) to reduce distress.',
    overviewClinical: 'Presence of obsessions, compulsions, or both that are time-consuming (>1 hr/day) or cause significant distress.',
    criteriaSummary: [
      'Presence of obsessions and/or compulsions.',
      'Symptoms time-consuming (>1 hour/day) or cause distress.',
      'Not better explained by another disorder.',
    ],
    symptoms: {
      cognitive: ['Intrusive thoughts (contamination, harm, symmetry)', 'Doubt'],
      behavioral: ['Washing', 'Checking', 'Counting', 'Ordering', 'Mental rituals'],
      emotional: ['Anxiety relieved temporarily by compulsions'],
    },
    treatments: { therapies: ['Exposure and Response Prevention (ERP)', 'CBT'], medicationClasses: ['SSRIs (often higher doses)', 'Clomipramine'] },
    differentials: ['Generalized Anxiety', 'OCPD', 'Body Dysmorphic Disorder'],
    differentialDetailed: [
      { disorder: 'Generalized Anxiety Disorder', distinguishing: 'Worries in GAD are about real-life concerns and ego-syntonic; OCD obsessions are intrusive and ego-dystonic.', overlap: 'Intrusive cognitions, anxious arousal.', ruleOut: 'Presence of compulsions or mental rituals favors OCD.' },
      { disorder: 'Obsessive-Compulsive Personality Disorder', distinguishing: 'OCPD is a pervasive, ego-syntonic preoccupation with order, perfectionism, and control — no true obsessions or compulsions.', overlap: 'Rigidity, checking-like behavior.', ruleOut: 'Absence of distressing intrusive thoughts argues against OCD.' },
      { disorder: 'Body Dysmorphic Disorder', distinguishing: 'Obsessions focus specifically on perceived appearance defects.', overlap: 'Repetitive checking, reassurance seeking.', ruleOut: 'When preoccupation is restricted to appearance, diagnose BDD.' },
      { disorder: 'Hoarding Disorder', distinguishing: 'Persistent difficulty discarding possessions due to perceived need to save.', overlap: 'Repetitive behaviors, distress when items discarded.', ruleOut: 'Separate diagnosis when hoarding is the dominant feature.' },
      { disorder: 'Tic disorder', distinguishing: 'Tics are sudden, non-goal-directed motor or vocal acts not preceded by an obsession.', overlap: 'Repetitive behaviors.', ruleOut: 'Premonitory urges without cognitive obsessions favor tic disorder.' },
    ],
    durationCriteria: 'Time-consuming (>1 hour/day) or causes clinically significant distress.',
    functionalImpairment: 'Marked interference with daily routine, occupational, academic, or social functioning.',
    associatedFeatures: ['Avoidance of triggers', 'Family accommodation', 'Depressive symptoms', 'Insight ranges from good to absent'],
    specifiers: ['With good or fair insight', 'With poor insight', 'With absent insight/delusional beliefs', 'Tic-related'],
    ruleOuts: ['Substance-induced (e.g., stimulants)', 'Other medical condition'],
    clinicalNotes: ['ERP is the first-line psychotherapy; SSRIs often require higher doses than for depression.', 'Assess for family accommodation explicitly.'],
    relatedIds: ['bdd', 'gad'],
    keywords: ['ocd', 'obsessions', 'compulsions', 'intrusive thoughts', 'checking', 'washing', 'rituals', 'cant stop thinking'],
  },
  {
    id: 'bdd',
    name: 'Body Dysmorphic Disorder',
    category: 'ocd',
    icd10: 'F45.22',
    overviewSimple: 'Preoccupation with perceived flaws in appearance that others usually cannot see.',
    overviewClinical: 'Preoccupation with one or more perceived defects in physical appearance, leading to repetitive behaviors.',
    criteriaSummary: ['Preoccupation with perceived flaws', 'Repetitive behaviors (mirror checking, grooming)', 'Significant distress'],
    symptoms: { cognitive: ['Distorted self-image'], behavioral: ['Mirror checking', 'Skin picking', 'Reassurance seeking'] },
    relatedIds: ['ocd', 'ed-an'],
    keywords: ['body dysmorphia', 'ugly', 'appearance obsession', 'bdd'],
  },
  {
    id: 'sz',
    name: 'Schizophrenia',
    category: 'psychotic',
    icd10: 'F20',
    onsetTypical: 'Late teens to mid-30s',
    overviewSimple: 'A serious mental illness that affects how a person thinks, feels, and perceives reality — including hallucinations and delusions.',
    overviewClinical: 'Two or more characteristic symptoms (delusions, hallucinations, disorganized speech, grossly disorganized/catatonic behavior, negative symptoms) for ≥1 month, with continuous signs ≥6 months.',
    criteriaSummary: [
      'Two or more characteristic symptoms ≥1 month.',
      'Significant decline in social/occupational functioning.',
      'Continuous signs persist ≥6 months.',
      'Schizoaffective and mood disorders excluded.',
    ],
    symptoms: {
      cognitive: ['Delusions', 'Disorganized thinking', 'Cognitive deficits'],
      behavioral: ['Disorganized behavior', 'Catatonia', 'Social withdrawal'],
      emotional: ['Flat affect', 'Avolition', 'Anhedonia'],
      physical: ['Hallucinations (often auditory)'],
    },
    treatments: { therapies: ['Psychoeducation', 'CBT for psychosis', 'Family therapy', 'Supported employment'], medicationClasses: ['Atypical antipsychotics', 'Long-acting injectables'] },
    differentials: ['Schizoaffective', 'Bipolar with psychosis', 'Substance-induced psychosis'],
    warnings: ['Acute psychosis or self-harm risk requires urgent psychiatric care.'],
    relatedIds: ['szaff', 'bd1'],
    keywords: ['schizophrenia', 'hearing voices', 'hallucinations', 'delusions', 'paranoid', 'voices in head', 'psychosis'],
  },
  {
    id: 'szaff',
    name: 'Schizoaffective Disorder',
    category: 'psychotic',
    icd10: 'F25',
    overviewSimple: 'A combination of schizophrenia symptoms and a mood episode (depression or mania).',
    overviewClinical: 'Concurrent psychotic and mood symptoms with ≥2 weeks of psychotic symptoms in absence of mood symptoms.',
    criteriaSummary: ['Major mood episode concurrent with schizophrenia criteria', '≥2 weeks of psychosis without mood episode', 'Mood symptoms present majority of total duration'],
    symptoms: { cognitive: ['Hallucinations', 'Delusions'], emotional: ['Depressive or manic episodes'] },
    relatedIds: ['sz', 'bd1'],
    keywords: ['schizoaffective'],
  },
  {
    id: 'bpd',
    name: 'Borderline Personality Disorder',
    shortName: 'BPD',
    category: 'personality',
    icd10: 'F60.3',
    overviewSimple: 'Intense and unstable emotions, relationships, and self-image, often with fear of abandonment and impulsive behavior.',
    overviewClinical: 'Pervasive pattern of instability in interpersonal relationships, self-image, and affect, with marked impulsivity beginning by early adulthood.',
    criteriaSummary: [
      'Frantic efforts to avoid real/imagined abandonment.',
      'Unstable, intense relationships.',
      'Identity disturbance.',
      'Impulsivity in ≥2 self-damaging areas.',
      'Recurrent suicidal behavior or self-harm.',
      'Affective instability.',
      'Chronic emptiness.',
      'Inappropriate intense anger.',
      'Transient dissociation or paranoid ideation.',
    ],
    symptoms: {
      emotional: ['Affective instability', 'Anger', 'Emptiness'],
      behavioral: ['Self-harm', 'Impulsivity', 'Relationship turmoil'],
      cognitive: ['Black-and-white thinking', 'Stress-related dissociation'],
    },
    treatments: { therapies: ['Dialectical Behavior Therapy (DBT)', 'Mentalization-Based Therapy', 'Schema therapy'] },
    differentials: ['Bipolar II', 'PTSD', 'Histrionic PD', 'NPD'],
    warnings: ['Self-harm and suicide risk require active safety planning.'],
    relatedIds: ['bd1', 'ptsd'],
    keywords: ['borderline', 'bpd', 'unstable relationships', 'fear of abandonment', 'self harm', 'mood swings', 'emptiness'],
  },
  {
    id: 'avpd',
    name: 'Avoidant Personality Disorder',
    category: 'personality',
    icd10: 'F60.6',
    overviewSimple: 'Long-standing pattern of social inhibition, feelings of inadequacy, and hypersensitivity to criticism.',
    overviewClinical: 'Pervasive pattern of social inhibition, feelings of inadequacy, and hypersensitivity to negative evaluation.',
    criteriaSummary: ['≥4 of: avoidance of occupational activities, unwillingness to engage unless certain of being liked, restraint in intimate relationships, preoccupation with criticism, inhibition in new situations, view of self as inferior, reluctance to take risks.'],
    symptoms: { emotional: ['Feelings of inadequacy', 'Shame'], behavioral: ['Social withdrawal'] },
    relatedIds: ['sad'],
    keywords: ['avoidant', 'feel inadequate', 'avpd'],
  },
  {
    id: 'npd',
    name: 'Narcissistic Personality Disorder',
    category: 'personality',
    icd10: 'F60.81',
    overviewSimple: 'A pattern of grandiosity, need for admiration, and lack of empathy for others.',
    overviewClinical: 'Pervasive grandiosity, need for admiration, and lack of empathy beginning by early adulthood.',
    criteriaSummary: ['≥5 of grandiosity, fantasies of power, sense of specialness, need for admiration, entitlement, exploitativeness, lack of empathy, envy, arrogance.'],
    symptoms: { emotional: ['Fragile self-esteem beneath grandiosity'], behavioral: ['Exploitative interpersonal style'] },
    relatedIds: ['bpd'],
    keywords: ['narcissist', 'narcissistic', 'npd', 'grandiose'],
  },
  {
    id: 'adhd',
    name: 'Attention-Deficit/Hyperactivity Disorder',
    shortName: 'ADHD',
    category: 'neuro',
    icd10: 'F90',
    onsetTypical: 'Symptoms before age 12',
    overviewSimple: 'Persistent patterns of inattention and/or hyperactivity-impulsivity that interfere with daily functioning.',
    overviewClinical: 'Persistent inattention and/or hyperactivity-impulsivity present before age 12, in ≥2 settings, causing impairment.',
    criteriaSummary: [
      'Six (or five if ≥17 years) symptoms of inattention or hyperactivity-impulsivity.',
      'Several symptoms present before age 12.',
      'Symptoms in ≥2 settings.',
      'Clear impairment in functioning.',
    ],
    symptoms: {
      cognitive: ['Inattention', 'Distractibility', 'Forgetfulness', 'Poor working memory'],
      behavioral: ['Hyperactivity', 'Impulsivity', 'Task switching difficulty'],
    },
    treatments: { therapies: ['Behavioral therapy', 'Coaching', 'CBT for adult ADHD'], medicationClasses: ['Stimulants (methylphenidate, amphetamines)', 'Non-stimulants (atomoxetine, guanfacine)'] },
    differentials: ['Learning disorders', 'Anxiety', 'Mood disorders', 'Sleep disorders'],
    relatedIds: ['asd-autism'],
    keywords: ['adhd', 'cant focus', 'distracted', 'hyperactive', 'impulsive', 'forgetful', 'attention'],
  },
  {
    id: 'asd-autism',
    name: 'Autism Spectrum Disorder',
    category: 'neuro',
    icd10: 'F84.0',
    overviewSimple: 'A developmental condition affecting communication, social interaction, and behavior, with restricted interests or repetitive patterns.',
    overviewClinical: 'Persistent deficits in social communication and interaction, plus restricted, repetitive patterns of behavior, present in early development.',
    criteriaSummary: [
      'Deficits in social-emotional reciprocity, nonverbal communication, and relationships.',
      'Restricted, repetitive patterns of behavior, interests, or activities.',
      'Symptoms present in early developmental period.',
      'Cause clinically significant impairment.',
    ],
    symptoms: { behavioral: ['Repetitive movements', 'Insistence on sameness', 'Restricted interests'], cognitive: ['Sensory sensitivities'], emotional: ['Difficulty with social reciprocity'] },
    relatedIds: ['adhd'],
    keywords: ['autism', 'asd', 'spectrum', 'sensory', 'stimming'],
  },
  {
    id: 'an',
    name: 'Anorexia Nervosa',
    category: 'eating',
    icd10: 'F50.0',
    overviewSimple: 'Restricting food intake leading to significantly low body weight, with intense fear of gaining weight.',
    overviewClinical: 'Restriction of energy intake leading to significantly low body weight, intense fear of weight gain, and disturbance in self-perception.',
    criteriaSummary: ['Restriction of intake → significantly low weight', 'Intense fear of gaining weight', 'Disturbance in body image'],
    symptoms: { behavioral: ['Food restriction', 'Excessive exercise'], cognitive: ['Body image distortion'], physical: ['Amenorrhea', 'Bradycardia', 'Hypothermia'] },
    treatments: { therapies: ['Family-Based Therapy (adolescents)', 'CBT-E'], lifestyle: ['Medical and nutritional rehabilitation'] },
    warnings: ['Highest mortality of psychiatric disorders; medical monitoring required.'],
    relatedIds: ['bn'],
    keywords: ['anorexia', 'eating disorder', 'wont eat', 'low weight', 'fear of gaining weight'],
  },
  {
    id: 'bn',
    name: 'Bulimia Nervosa',
    category: 'eating',
    icd10: 'F50.2',
    overviewSimple: 'Repeated episodes of binge eating followed by compensatory behaviors like vomiting or excessive exercise.',
    overviewClinical: 'Recurrent binge eating with compensatory behaviors at least once weekly for 3 months.',
    criteriaSummary: ['Recurrent binges with loss of control', 'Recurrent compensatory behaviors', '≥1×/week for 3 months', 'Self-evaluation overly influenced by shape/weight'],
    treatments: { therapies: ['CBT-E', 'Interpersonal Therapy'], medicationClasses: ['SSRIs (fluoxetine)'] },
    relatedIds: ['an', 'bed'],
    keywords: ['bulimia', 'binge purge', 'vomiting after eating'],
  },
  {
    id: 'bed',
    name: 'Binge-Eating Disorder',
    category: 'eating',
    icd10: 'F50.81',
    overviewSimple: 'Recurrent episodes of eating large amounts of food with a sense of loss of control, without regular compensatory behaviors.',
    overviewClinical: 'Recurrent binge eating ≥1×/week for 3 months, with marked distress and no compensatory behaviors.',
    criteriaSummary: ['Recurrent binges with loss of control', 'Three or more associated features', 'Marked distress', 'No regular compensatory behaviors'],
    relatedIds: ['bn'],
    keywords: ['binge eating', 'overeating', 'bed'],
  },
  {
    id: 'aud',
    name: 'Alcohol Use Disorder',
    category: 'substance',
    icd10: 'F10.20',
    overviewSimple: 'A pattern of alcohol use causing significant impairment, including loss of control and continued use despite harm.',
    overviewClinical: 'Problematic pattern of alcohol use leading to clinically significant impairment, with ≥2 of 11 criteria within a 12-month period.',
    criteriaSummary: ['≥2 of 11 criteria within 12 months including: larger amounts than intended, unsuccessful cutting down, craving, tolerance, withdrawal, social/occupational consequences.'],
    severity: { mild: '2–3 criteria', moderate: '4–5 criteria', severe: '≥6 criteria' },
    treatments: { therapies: ['Motivational Interviewing', 'CBT', '12-Step facilitation'], medicationClasses: ['Naltrexone', 'Acamprosate', 'Disulfiram'] },
    warnings: ['Withdrawal can be life-threatening; medical detox may be required.'],
    relatedIds: ['mdd', 'ptsd'],
    keywords: ['alcoholism', 'aud', 'drinking problem', 'cant stop drinking'],
  },
  {
    id: 'insomnia',
    name: 'Insomnia Disorder',
    category: 'sleep',
    icd10: 'F51.01',
    overviewSimple: 'Persistent difficulty falling or staying asleep, causing daytime distress, despite adequate opportunity to sleep.',
    overviewClinical: 'Predominant complaint of dissatisfaction with sleep quantity or quality ≥3 nights/week for ≥3 months.',
    criteriaSummary: ['Difficulty initiating, maintaining, or early-morning awakening', '≥3 nights/week for ≥3 months', 'Significant distress or impairment'],
    treatments: { therapies: ['CBT for Insomnia (CBT-I)'], lifestyle: ['Sleep hygiene', 'Stimulus control'], medicationClasses: ['Short-term hypnotics if needed'] },
    relatedIds: ['gad', 'mdd'],
    keywords: ['insomnia', 'cant sleep', 'sleep problems', 'wake up early'],
  },
];

import { EXTRA_DISORDERS } from './disorders.generated';
import { MOOD_BIPOLAR_DISORDERS } from './disorders.moodBipolar';

// Merge precedence (richest content wins):
//   chapter modules (e.g., MOOD_BIPOLAR_DISORDERS)  >  inline seed  >  generated
// Chapter modules override inline seed by id; generated only fills gaps.
for (const d of MOOD_BIPOLAR_DISORDERS) {
  const idx = DISORDERS.findIndex((x) => x.id === d.id);
  if (idx >= 0) DISORDERS[idx] = d;
  else DISORDERS.push(d);
}
const _seen = new Set(DISORDERS.map((d) => d.id));
for (const d of EXTRA_DISORDERS) {
  if (!_seen.has(d.id)) {
    DISORDERS.push(d);
    _seen.add(d.id);
  }
}

export const findRelated = (id: string) => {
  const d = DISORDERS.find((x) => x.id === id);
  if (!d?.relatedIds) return [];
  return DISORDERS.filter((x) => d.relatedIds!.includes(x.id));
};
