import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth-store';
import { usePackageStore } from '../../stores/package-store';
import { listMyPackages, loadPackage } from '../../lib/persistence';
import { supabase } from '../../lib/supabaseClient';

interface PackageSummary {
  id: string;
  name: string;
  familyId: string;
  updatedAt: string;
  status: string;
}

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-white/10 text-text-secondary' },
  submitted: { label: 'Submitted', cls: 'bg-accent/20 text-accent-light' },
  quoted:    { label: 'Quoted',    cls: 'bg-success/20 text-success' },
};

export const MyDesigns: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);

  const [packages, setPackages] = useState<PackageSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPackages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await listMyPackages();
      setPackages(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load designs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleOpen = async (id: string) => {
    try {
      const pkg = await loadPackage(id);
      if (pkg) {
        usePackageStore.getState().hydrate(pkg);
        navigate('/designer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load design');
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(null);
    try {
      const { error: delError } = await supabase
        .from('sign_packages')
        .delete()
        .eq('id', id);
      if (delError) throw delError;
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleNewPackage = () => {
    // Reset store to blank state
    usePackageStore.setState({
      packageId: null,
      packageName: 'Untitled Package',
      familyId: '',
      signTypes: [],
      metadata: {
        projectName: '',
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        propertyAddress: '',
        notes: '',
      },
      status: 'draft',
      shareToken: null,
      isDirty: false,
    });
    navigate('/');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-surface-elevated border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
            EGX
          </span>
          <span className="text-text-muted text-sm">|</span>
          <span className="text-text-secondary text-sm font-medium tracking-wide">
            My Designs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-text-muted">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 text-xs font-medium rounded border border-border text-text-secondary hover:border-error hover:text-error transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Title row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-text-primary">Saved Designs</h1>
            <button
              onClick={handleNewPackage}
              className="px-4 py-2 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity"
            >
              + New Package
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-error/10 border border-error/30 text-error text-xs">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : packages.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">No saved designs yet</h3>
              <p className="text-xs text-text-muted mb-4 max-w-xs">
                Create a new sign package by selecting a family and customizing your signs.
              </p>
              <button
                onClick={handleNewPackage}
                className="px-4 py-2 text-sm font-medium rounded bg-accent text-white hover:bg-accent-light transition-colors"
              >
                Create Your First Package
              </button>
            </div>
          ) : (
            /* Package cards */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {packages.map((pkg) => {
                const style = STATUS_STYLES[pkg.status] ?? STATUS_STYLES.draft;
                return (
                  <div
                    key={pkg.id}
                    className="flex flex-col bg-surface-elevated border border-border rounded-lg p-4 hover:border-border-active transition-colors group cursor-pointer"
                    onClick={() => handleOpen(pkg.id)}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded ${style.cls}`}>
                        {style.label}
                      </span>
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleting(deleting === pkg.id ? null : pkg.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-error transition-all p-1"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Delete confirmation */}
                    {deleting === pkg.id && (
                      <div className="mb-3 p-2 rounded bg-error/10 border border-error/30 flex items-center justify-between">
                        <span className="text-xs text-error">Delete this design?</span>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleting(null); }}
                            className="text-[10px] text-text-muted hover:text-text-primary"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(pkg.id); }}
                            className="text-[10px] text-error font-bold hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Name + info */}
                    <h3 className="text-sm font-semibold text-text-primary mb-1 truncate">{pkg.name}</h3>
                    <p className="text-[11px] text-text-muted capitalize">{pkg.familyId.replace(/_/g, ' ')} Family</p>
                    <p className="text-[10px] text-text-muted mt-auto pt-3">{formatDate(pkg.updatedAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
