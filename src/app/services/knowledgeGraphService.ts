export interface GraphNode {
  id: string;
  label: string;
  category: 'module' | 'subject' | 'topic' | 'concept' | 'clinical_pearl' | 'code';
  discipline?: string;
  moduleCode?: string;
  description?: string;
  connections: string[]; // target node IDs
  community?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

export interface ConceptNeighborhood {
  root: GraphNode;
  neighbors: GraphNode[];
  edges: GraphEdge[];
}

/** Pre-indexed medical knowledge curriculum graph covering core disciplines and cross-system connections */
export const MEDICAL_CURRICULUM_CONCEPTS: GraphNode[] = [
  // --- GIT & LIVER CONCEPTS ---
  {
    id: 'git_pancreas_anatomy',
    label: 'Pancreas Anatomy & Ductal System',
    category: 'topic',
    discipline: 'Anatomy',
    moduleCode: 'MGL-3',
    description: 'Retroperitoneal organ with head, uncinate process, neck, body, and tail. Main duct of Wirsung joins bile duct at ampulla of Vater.',
    connections: ['git_portal_vein', 'git_duodenum_anatomy', 'git_pancreas_embryology', 'git_pancreas_histo', 'git_pancreatitis_patho', 'git_pancreas_enzymes'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_portal_vein',
    label: 'Portal Vein & Portosystemic Anastomoses',
    category: 'topic',
    discipline: 'Anatomy',
    moduleCode: 'MGL-3',
    description: 'Formed posterior to neck of pancreas by union of splenic vein and superior mesenteric vein. Sites of anastomosis: lower esophagus, rectum, umbilicus.',
    connections: ['git_pancreas_anatomy', 'git_liver_anatomy', 'git_portal_hypertension', 'git_esophageal_varices'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_duodenum_anatomy',
    label: 'Duodenum Anatomy & Relations',
    category: 'topic',
    discipline: 'Anatomy',
    moduleCode: 'MGL-3',
    description: 'C-shaped loop comprising 4 parts. 1st part intraperitoneal/retroperitoneal transition; 2nd part receives bile & pancreatic ducts at major duodenal papilla.',
    connections: ['git_pancreas_anatomy', 'git_peptic_ulcer', 'git_iron_absorption'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_pancreas_embryology',
    label: 'Embryology of Pancreas & Duodenum',
    category: 'topic',
    discipline: 'Anatomy',
    moduleCode: 'MGL-3',
    description: 'Ventral and dorsal pancreatic buds rotate and fuse. Ventral bud forms uncinate process and inferior head. Annular pancreas causes duodenal stenosis.',
    connections: ['git_pancreas_anatomy', 'git_duodenum_anatomy'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_pancreas_histo',
    label: 'Histology of Pancreas (Exocrine & Endocrine)',
    category: 'topic',
    discipline: 'Histology',
    moduleCode: 'MGL-3',
    description: 'Serous acini with centroacinar cells marking the start of intercalated ducts. Islets of Langerhans contain alpha, beta, and delta cells.',
    connections: ['git_pancreas_anatomy', 'git_pancreas_enzymes'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_liver_histo',
    label: 'Histology of Liver Lobule & Sinusoids',
    category: 'topic',
    discipline: 'Histology',
    moduleCode: 'MGL-3',
    description: 'Classic lobule, portal lobule, and acinus of Rappaport. Fenestrated sinusoids lined by endothelial cells and Kupffer macrophages. Space of Disse houses hepatic stellate (Ito) cells.',
    connections: ['git_liver_anatomy', 'git_liver_cirrhosis', 'git_bile_synthesis'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_bile_synthesis',
    label: 'Bile Acid & Salt Synthesis',
    category: 'topic',
    discipline: 'Biochemistry',
    moduleCode: 'MGL-3',
    description: 'Synthesized from cholesterol in hepatocytes. Primary: cholic acid & chenodeoxycholic acid (rate-limiting: cholesterol 7α-hydroxylase). Conjugated with glycine or taurine.',
    connections: ['git_enterohepatic_circulation', 'git_lipid_digestion', 'git_jaundice_heme'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_jaundice_heme',
    label: 'Heme Catabolism & Jaundice',
    category: 'topic',
    discipline: 'Biochemistry',
    moduleCode: 'MGL-3',
    description: 'RBC breakdown converts heme to biliverdin then unconjugated bilirubin. Conjugated in liver via UDP-glucuronosyltransferase. Hemolytic, hepatocellular, and obstructive jaundice.',
    connections: ['git_bile_synthesis', 'git_liver_cirrhosis', 'git_gallstones_patho'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_purine_metabolism',
    label: 'Nucleotide & Purine Metabolism',
    category: 'topic',
    discipline: 'Biochemistry',
    moduleCode: 'MGL-3',
    description: 'De novo synthesis uses PRPP, glutamine, glycine, aspartate, and folate. Catabolism yields uric acid via xanthine oxidase. Hyperuricemia precipitates gout.',
    connections: ['git_allopurinol_pharma', 'git_gout_pathology'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_fatty_liver',
    label: 'Biochemical Basis of Fatty Liver',
    category: 'topic',
    discipline: 'Biochemistry',
    moduleCode: 'MGL-3',
    description: 'Imbalance between hepatic triglyceride synthesis and VLDL secretion. Causes: alcohol excess (high NADH/NAD+), insulin resistance, choline deficiency.',
    connections: ['git_liver_cirrhosis', 'git_alcohol_metabolism'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_enterohepatic_circulation',
    label: 'Enterohepatic Circulation & Bile Regulation',
    category: 'topic',
    discipline: 'Physiology',
    moduleCode: 'MGL-3',
    description: '95% of bile salts reabsorbed in terminal ileum via apical sodium-dependent bile acid transporter (ASBT) and recycled back to liver via portal vein.',
    connections: ['git_bile_synthesis', 'git_ileum_anatomy', 'git_lipid_digestion'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_iron_absorption',
    label: 'Small Intestine Absorption & Ferroportin',
    category: 'topic',
    discipline: 'Physiology',
    moduleCode: 'MGL-3',
    description: 'Non-heme iron absorbed by DMT1 in duodenum. Exported to blood via ferroportin. Hepcidin binds and degrades ferroportin to downregulate iron release.',
    connections: ['git_duodenum_anatomy', 'git_hepcidin_regulation', 'git_anemia_chronic'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_peptic_ulcer',
    label: 'Peptic Ulcer Disease & GERD',
    category: 'topic',
    discipline: 'Pathology',
    moduleCode: 'MGL-3',
    description: 'Mucosal defect extending through muscularis mucosae. Most common etiologies: Helicobacter pylori infection and NSAID use. Duodenal ulcers improve with food; gastric worsen.',
    connections: ['git_hpylori_micro', 'git_ppi_pharma', 'git_duodenum_anatomy', 'git_gastritis_patho'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_liver_cirrhosis',
    label: 'Cirrhosis & Chronic Liver Disease',
    category: 'topic',
    discipline: 'Pathology',
    moduleCode: 'MGL-3',
    description: 'Diffuse hepatic fibrosis and regenerative parenchymal nodules. Stellate cell activation drives collagen deposition in space of Disse. Leads to portal hypertension and liver failure.',
    connections: ['git_portal_vein', 'git_portal_hypertension', 'git_liver_histo', 'git_fatty_liver', 'git_hepatitis_virus'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_gallstones_patho',
    label: 'Gallbladder Diseases & Cholelithiasis',
    category: 'topic',
    discipline: 'Pathology',
    moduleCode: 'MGL-3',
    description: 'Cholesterol vs pigment stones. Risk factors: female, fat, fertile, forty. Complications: acute/chronic cholecystitis, choledocholithiasis, ascending cholangitis, gallstone pancreatitis.',
    connections: ['git_bile_synthesis', 'git_jaundice_heme', 'git_pancreatitis_patho'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_hpylori_micro',
    label: 'Helicobacter pylori Microbiology',
    category: 'topic',
    discipline: 'Microbiology',
    moduleCode: 'MGL-3',
    description: 'Microaerophilic, spiral, Gram-negative rod. Virulence factors: urease (neutralizes gastric acid), CagA, VacA cytotoxins. Diagnosed by urea breath test or stool antigen.',
    connections: ['git_peptic_ulcer', 'git_gastric_adenocarcinoma', 'git_ppi_pharma'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_hepatitis_virus',
    label: 'Viral Hepatitis (HBV, HCV, HAV)',
    category: 'topic',
    discipline: 'Microbiology',
    moduleCode: 'MGL-3',
    description: 'HBV: enveloped partially double-stranded DNA virus; HBeAg indicates high infectivity. HCV: positive-sense ssRNA flavivirus prone to chronic carriage and cirrhosis.',
    connections: ['git_liver_cirrhosis', 'git_hepatocellular_carcinoma', 'git_jaundice_heme'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_parasites_flukes',
    label: 'Liver & Intestinal Flukes (Fasciola, Schistosoma)',
    category: 'topic',
    discipline: 'Parasitology',
    moduleCode: 'MGL-3',
    description: 'Fasciola hepatica causes bile duct inflammation and halzoun. Schistosoma mansoni eggs lodge in portal venules causing periportal pipe-stem fibrosis and portal hypertension.',
    connections: ['git_portal_hypertension', 'git_bile_synthesis', 'git_praziquantel_pharma'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_entamoeba_histo',
    label: 'Entamoeba histolytica & Giardia',
    category: 'topic',
    discipline: 'Parasitology',
    moduleCode: 'MGL-3',
    description: 'E. histolytica trophozoites cause flask-shaped intestinal ulcers and anchovy paste liver abscesses. Giardia lamblia coats duodenal mucosa causing steatorrhea.',
    connections: ['git_duodenum_anatomy', 'git_liver_cirrhosis', 'git_metronidazole_pharma'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_ppi_pharma',
    label: 'Proton Pump Inhibitors & Acid Reducers',
    category: 'topic',
    discipline: 'Pharmacology',
    moduleCode: 'MGL-3',
    description: 'Omeprazole, esomeprazole, pantoprazole irreversibly inhibit H+/K+ ATPase in gastric parietal cells. Combined with clarithromycin + amoxicillin for H. pylori eradication.',
    connections: ['git_peptic_ulcer', 'git_hpylori_micro'],
    community: 'Gastrointestinal & Liver'
  },
  {
    id: 'git_portal_hypertension',
    label: 'Portal Hypertension & Clinical Sequelae',
    category: 'concept',
    discipline: 'Clinical',
    moduleCode: 'MGL-3',
    description: 'Elevated hepatic venous pressure gradient (>5 mmHg). Clinical triad: ascites, splenomegaly, and portosystemic collateral formation (esophageal varices, caput medusae).',
    connections: ['git_portal_vein', 'git_liver_cirrhosis', 'git_parasites_flukes'],
    community: 'Gastrointestinal & Liver'
  }
];

// In-memory graph nodes lookup
const nodeIndex = new Map<string, GraphNode>();
MEDICAL_CURRICULUM_CONCEPTS.forEach(node => {
  nodeIndex.set(node.id, node);
  nodeIndex.set(node.label.toLowerCase(), node);
});

export class KnowledgeGraphService {
  private static cachedGraphData: any = null;

  static async loadFullAstGraph(): Promise<any> {
    if (this.cachedGraphData) return this.cachedGraphData;
    try {
      const graphData = await import('../../../graphify-out/graph.json');
      this.cachedGraphData = graphData.default || graphData;
      return this.cachedGraphData;
    } catch (e) {
      console.warn('Could not load full graphify graph.json; falling back to curriculum graph.', e);
      return null;
    }
  }

  static search(query: string): GraphNode[] {
    const q = query.trim().toLowerCase();
    if (!q) return MEDICAL_CURRICULUM_CONCEPTS.slice(0, 10);

    return MEDICAL_CURRICULUM_CONCEPTS.filter(node =>
      node.label.toLowerCase().includes(q) ||
      node.discipline?.toLowerCase().includes(q) ||
      node.moduleCode?.toLowerCase().includes(q) ||
      node.description?.toLowerCase().includes(q)
    );
  }

  static getNeighborhood(nodeId: string): ConceptNeighborhood | null {
    const root = nodeIndex.get(nodeId) || MEDICAL_CURRICULUM_CONCEPTS.find(n => n.id === nodeId);
    if (!root) return null;

    const neighborIds = new Set(root.connections);
    const neighbors: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    neighborIds.forEach(id => {
      const neighbor = nodeIndex.get(id);
      if (neighbor) {
        neighbors.push(neighbor);
        edges.push({
          source: root.id,
          target: neighbor.id,
          relation: `${root.discipline || 'Related'} ↔ ${neighbor.discipline || 'Concept'}`
        });
      }
    });

    return {
      root,
      neighbors,
      edges
    };
  }

  static matchTopic(topicTitle: string, subjectName = '', moduleCode = ''): ConceptNeighborhood | null {
    const cleanTopic = topicTitle.toLowerCase();
    const cleanSubject = subjectName.toLowerCase();

    // 1. Exact or substring match in curriculum graph
    const match = MEDICAL_CURRICULUM_CONCEPTS.find(n => {
      const label = n.label.toLowerCase();
      if (cleanTopic.includes(label) || label.includes(cleanTopic)) return true;
      if (cleanSubject && n.discipline && n.discipline.toLowerCase() === cleanSubject) {
        const words = cleanTopic.split(/\s+/).filter(w => w.length > 3);
        return words.some(w => label.includes(w) || (n.description && n.description.toLowerCase().includes(w)));
      }
      return false;
    });

    if (match) {
      return this.getNeighborhood(match.id);
    }

    // Fallback: create dynamic root node for this topic
    const fallbackNode: GraphNode = {
      id: `dyn_${topicTitle.replace(/[^a-zA-Z0-9]/g, '_')}`,
      label: topicTitle,
      category: 'topic',
      discipline: subjectName || 'Clinical Science',
      moduleCode: moduleCode || 'ASU-Portal',
      description: `Curriculum topic in ${subjectName || 'Medical Science'}. Connected with foundational anatomy, physiology, and pathology mechanisms.`,
      connections: [],
      community: moduleCode || 'Medical Curriculum'
    };

    // Find related discipline neighbors
    const related = MEDICAL_CURRICULUM_CONCEPTS.filter(n =>
      (subjectName && n.discipline && n.discipline.toLowerCase() === subjectName.toLowerCase()) ||
      (moduleCode && n.moduleCode === moduleCode)
    ).slice(0, 4);

    fallbackNode.connections = related.map(r => r.id);

    return {
      root: fallbackNode,
      neighbors: related,
      edges: related.map(r => ({
        source: fallbackNode.id,
        target: r.id,
        relation: 'Related Module Concept'
      }))
    };
  }
}
