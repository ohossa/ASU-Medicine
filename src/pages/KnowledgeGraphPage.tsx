import React, { useState, useMemo } from 'react';
import {
  Network,
  Search,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  KnowledgeGraphService,
  MEDICAL_CURRICULUM_CONCEPTS,
} from '../app/services/knowledgeGraphService';
import { FlowBreadcrumbs } from '../app/components/FlowBreadcrumbs';
import { PortalFooter } from '../app/components/PortalFooter';

interface Props {
  userButton?: React.ReactNode;
}

const DISCIPLINES = [
  'All',
  'Anatomy',
  'Physiology',
  'Histology',
  'Biochemistry',
  'Pathology',
  'Pharmacology',
  'Microbiology',
  'Parasitology',
  'Clinical'
];

export function KnowledgeGraphPage({ userButton }: Props) {
  const navigate = useNavigate();
  const [selectedDiscipline, setSelectedDiscipline] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string>(MEDICAL_CURRICULUM_CONCEPTS[0].id);

  const activeNeighborhood = useMemo(() => {
    return KnowledgeGraphService.getNeighborhood(selectedNodeId);
  }, [selectedNodeId]);

  const filteredNodes = useMemo(() => {
    return MEDICAL_CURRICULUM_CONCEPTS.filter(node => {
      const matchDiscipline = selectedDiscipline === 'All' || node.discipline === selectedDiscipline;
      const q = searchQuery.trim().toLowerCase();
      const matchSearch = !q || (
        node.label.toLowerCase().includes(q) ||
        node.description?.toLowerCase().includes(q) ||
        node.discipline?.toLowerCase().includes(q) ||
        node.moduleCode?.toLowerCase().includes(q)
      );
      return matchDiscipline && matchSearch;
    });
  }, [selectedDiscipline, searchQuery]);

  const root = activeNeighborhood?.root;

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <nav
          aria-label="Breadcrumb"
          className="sticky top-3 z-30 mb-8 flex items-center justify-between rounded-2xl border border-border bg-card/90 px-4 py-2.5 glass-panel backdrop-blur-xl shadow-sm"
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="Back to dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
            >
              <ArrowLeft size={18} />
            </button>
            <FlowBreadcrumbs
              crumbs={[
                { label: 'Portal', onClick: () => navigate('/') },
                { label: 'Knowledge Graph Explorer' }
              ]}
            />
          </div>
          {userButton && <div className="shrink-0">{userButton}</div>}
        </nav>

        {/* Hero Banner */}
        <header className="mb-8 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 glass-panel backdrop-blur-md shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Network size={14} />
                7,419 Nodes · 12,139 Connections · 1,073 Community Clusters
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground">
                Medical Curriculum Knowledge Graph
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Explore interdisciplinary relationships across Ain Shams medical modules. Trace how anatomical structures drive physiological mechanisms, trigger pathological lesions, and guide pharmacotherapy.
              </p>
            </div>
          </div>
        </header>

        {/* Search & Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search concepts across Anatomy, Physiology, Pathology, Drugs (e.g. 'Pancreas', 'Bile', 'Hepcidin', 'H. pylori')…"
              className="h-12 w-full rounded-2xl border border-border bg-card/80 pl-11 pr-4 text-sm text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Discipline Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {DISCIPLINES.map(disc => {
              const active = selectedDiscipline === disc;
              return (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscipline(disc)}
                  className={`h-9 shrink-0 rounded-xl px-4 text-xs font-medium transition-all focus-visible:outline-2 focus-visible:outline-primary ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'border border-border/80 bg-card text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  {disc}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Concept Navigator & Neighborhood Inspector */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Concept Directory */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1 text-xs text-muted-foreground font-medium">
              <span>Concepts Matching Filter ({filteredNodes.length})</span>
              <span>Select to view concept map</span>
            </div>

            <div className="max-h-[640px] space-y-2 overflow-y-auto pr-1">
              {filteredNodes.map(node => {
                const isSelected = node.id === selectedNodeId;
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-primary ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30'
                        : 'border-border bg-card hover:border-border/80 hover:bg-secondary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground">
                        {node.discipline}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {node.connections.length} connections
                      </span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-foreground">
                      {node.label}
                    </h3>
                    {node.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
                        {node.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Focused Concept Neighborhood Map */}
          <div className="lg:col-span-7">
            {root ? (
              <div className="sticky top-24 rounded-3xl border border-border bg-card p-6 shadow-md glass-panel backdrop-blur-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      <Sparkles size={12} />
                      {root.discipline} · {root.moduleCode}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {root.id}
                    </span>
                  </div>
                  <h2 className="mt-3 text-2xl font-bold text-foreground">
                    {root.label}
                  </h2>
                  {root.description && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {root.description}
                    </p>
                  )}
                </div>

                {/* Connected Neighborhood */}
                <div className="space-y-3 pt-4 border-t border-border/60">
                  <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers size={14} />
                    Direct Interdisciplinary Connections ({activeNeighborhood?.neighbors.length ?? 0})
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {activeNeighborhood?.neighbors.map(neighbor => (
                      <button
                        key={neighbor.id}
                        onClick={() => setSelectedNodeId(neighbor.id)}
                        className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-secondary/30 p-4 text-left transition-all hover:border-primary/40 hover:bg-secondary/60 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <div>
                          <span className="inline-block rounded-md bg-background px-2 py-0.5 text-[10px] font-medium text-foreground">
                            {neighbor.discipline}
                          </span>
                          <h4 className="mt-2 text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                            {neighbor.label}
                          </h4>
                          {neighbor.description && (
                            <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                              {neighbor.description}
                            </p>
                          )}
                        </div>
                        <div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-primary">
                          <span>Explore concept</span>
                          <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Practice Link */}
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-foreground">Practice Questions for this Topic</h4>
                    <p className="text-[11px] text-muted-foreground">Solve verified MCQs covering this concept directly in the portal.</p>
                  </div>
                  <button
                    onClick={() => navigate('/practice/MGL-3')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    <span>Practice Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">Select a concept to inspect its knowledge neighborhood.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <PortalFooter />
    </div>
  );
}
export default KnowledgeGraphPage;
