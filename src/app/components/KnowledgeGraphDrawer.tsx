import { useState, useEffect } from 'react';
import {
  Network,
  X,
  Search,
  ArrowRight,
  Sparkles,
  Layers,
  ExternalLink
} from 'lucide-react';
import {
  KnowledgeGraphService,
  type ConceptNeighborhood,
  type GraphNode
} from '../services/knowledgeGraphService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  topicTitle?: string;
  subjectName?: string;
  moduleCode?: string;
}

const disciplineColors: Record<string, { bg: string; text: string; border: string }> = {
  Anatomy: { bg: 'bg-blue-500/10 dark:bg-blue-500/20', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  Physiology: { bg: 'bg-amber-500/10 dark:bg-amber-500/20', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  Histology: { bg: 'bg-purple-500/10 dark:bg-purple-500/20', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-500/30' },
  Biochemistry: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
  Pathology: { bg: 'bg-rose-500/10 dark:bg-rose-500/20', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-500/30' },
  Pharmacology: { bg: 'bg-cyan-500/10 dark:bg-cyan-500/20', text: 'text-cyan-600 dark:text-cyan-400', border: 'border-cyan-500/30' },
  Microbiology: { bg: 'bg-indigo-500/10 dark:bg-indigo-500/20', text: 'text-indigo-600 dark:text-indigo-400', border: 'border-indigo-500/30' },
  Parasitology: { bg: 'bg-teal-500/10 dark:bg-teal-500/20', text: 'text-teal-600 dark:text-teal-400', border: 'border-teal-500/30' },
  Clinical: { bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' },
};

export function KnowledgeGraphDrawer({
  isOpen,
  onClose,
  topicTitle = 'Medical Concept',
  subjectName = 'Clinical Science',
  moduleCode = 'MGL-3'
}: Props) {
  const [activeNeighborhood, setActiveNeighborhood] = useState<ConceptNeighborhood | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GraphNode[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const initial = KnowledgeGraphService.matchTopic(topicTitle, subjectName, moduleCode);
    setActiveNeighborhood(initial);
    setSearchQuery('');
    setSearchResults([]);
  }, [isOpen, topicTitle, subjectName, moduleCode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const results = KnowledgeGraphService.search(q);
    setSearchResults(results);
  };

  const handleSelectNode = (nodeId: string) => {
    const next = KnowledgeGraphService.getNeighborhood(nodeId);
    if (next) {
      setActiveNeighborhood(next);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  if (!isOpen) return null;

  const root = activeNeighborhood?.root;
  const rootColor = root?.discipline ? (disciplineColors[root.discipline] || disciplineColors.Clinical) : disciplineColors.Clinical;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kg-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-lg flex-col bg-card/95 text-foreground shadow-2xl backdrop-blur-xl border-l border-border transition-all duration-300 dark:bg-slate-900/95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Network size={20} />
            </div>
            <div>
              <h2 id="kg-drawer-title" className="text-base font-semibold tracking-tight">
                Concept Map Explorer
              </h2>
              <p className="text-xs text-muted-foreground">
                7,419-Node Medical Knowledge Graph
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close concept map"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X size={18} />
          </button>
        </header>

        {/* Search Input */}
        <div className="border-b border-border/40 px-6 py-3">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search related anatomy, pathology, or drug concepts…"
              className="h-10 w-full rounded-xl border border-border/60 bg-secondary/50 pl-9 pr-4 text-xs transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="mt-2 max-h-48 overflow-y-auto rounded-xl border border-border/80 bg-popover p-1 shadow-lg">
              {searchResults.map(result => (
                <button
                  key={result.id}
                  onClick={() => handleSelectNode(result.id)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors hover:bg-secondary"
                >
                  <span className="font-medium text-foreground">{result.label}</span>
                  <span className="text-[10px] text-muted-foreground">{result.discipline}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {root && (
            <>
              {/* Focused Root Node Card */}
              <div className={`rounded-2xl border p-5 transition-all shadow-sm ${rootColor.border} ${rootColor.bg}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${rootColor.text} bg-background/80`}>
                    <Sparkles size={11} />
                    {root.discipline || 'Clinical Concept'}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {root.moduleCode || 'Curriculum'}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-bold text-foreground">
                  {root.label}
                </h3>

                {root.description && (
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground/90">
                    {root.description}
                  </p>
                )}
              </div>

              {/* Connected Concepts Section */}
              <section aria-label="Connected concepts">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <Layers size={14} />
                    Connected Concepts ({activeNeighborhood.neighbors.length})
                  </h4>
                  <span className="text-[11px] text-muted-foreground/70">Tap any concept to inspect</span>
                </div>

                <div className="grid gap-2.5">
                  {activeNeighborhood.neighbors.map(neighbor => {
                    const nColor = neighbor.discipline ? (disciplineColors[neighbor.discipline] || disciplineColors.Clinical) : disciplineColors.Clinical;
                    return (
                      <button
                        key={neighbor.id}
                        type="button"
                        onClick={() => handleSelectNode(neighbor.id)}
                        className="group flex items-start justify-between rounded-xl border border-border/80 bg-card p-3.5 text-left transition-all hover:border-primary/40 hover:bg-secondary/40 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${nColor.bg} ${nColor.text}`}>
                              {neighbor.discipline}
                            </span>
                            <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                              {neighbor.label}
                            </span>
                          </div>
                          {neighbor.description && (
                            <p className="line-clamp-2 text-[11px] text-muted-foreground leading-relaxed">
                              {neighbor.description}
                            </p>
                          )}
                        </div>
                        <ArrowRight size={15} className="mt-1 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                      </button>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-border/60 p-4 text-center">
          <a
            href="/knowledge-graph"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-xs font-medium text-foreground transition-all hover:bg-secondary/80 focus-visible:outline-2 focus-visible:outline-primary"
          >
            <ExternalLink size={14} />
            Open Full Knowledge Graph Explorer
          </a>
        </footer>
      </div>
    </div>
  );
}
export default KnowledgeGraphDrawer;
