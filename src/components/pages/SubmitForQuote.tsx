import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePackageStore } from '../../stores/package-store';
import { savePackage, submitForQuote } from '../../lib/persistence';
import type { PackageMetadata } from '../../types';

export const SubmitForQuote: React.FC = () => {
  const navigate = useNavigate();
  const signTypes = usePackageStore((s) => s.signTypes);
  const packageId = usePackageStore((s) => s.packageId);
  const packageName = usePackageStore((s) => s.packageName);
  const metadata = usePackageStore((s) => s.metadata);

  const activeTypes = signTypes.filter((st) => st.quantity > 0);
  const totalQty = signTypes.reduce((sum, st) => sum + st.quantity, 0);

  const [form, setForm] = useState<PackageMetadata>({
    projectName: metadata.projectName || packageName || '',
    customerName: metadata.customerName || '',
    customerEmail: metadata.customerEmail || '',
    customerPhone: metadata.customerPhone || '',
    propertyAddress: metadata.propertyAddress || '',
    notes: metadata.notes || '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const isValid =
    form.customerName.trim().length > 0 &&
    form.customerEmail.trim().length > 0 &&
    activeTypes.length > 0;

  const update = (field: keyof PackageMetadata, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError('');

    try {
      // Save the package first (get ID if new)
      const serialized = usePackageStore.getState().serialize();
      const id = packageId ?? await savePackage(serialized);

      // Update store with the ID
      usePackageStore.setState({ packageId: id, metadata: form });

      // Submit for quote
      await submitForQuote(id, form);
      usePackageStore.setState({ status: 'submitted' });

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success state
  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-elevated border border-border rounded-lg p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Quote Request Submitted!</h2>
          <p className="text-sm text-text-secondary mb-6">
            We'll be in touch within 24 hours. Our team will review your sign package
            and prepare a detailed quote for you.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate('/designs')}
              className="px-4 py-2 text-sm font-medium rounded border border-border text-text-secondary hover:border-accent hover:text-accent transition-colors"
            >
              My Designs
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90"
            >
              New Package
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No signs guard
  if (activeTypes.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">No Signs in Package</h2>
        <p className="text-sm text-text-muted mb-4">Set quantities for at least one sign type before submitting.</p>
        <button
          onClick={() => navigate('/designer')}
          className="px-4 py-2 text-sm rounded bg-accent text-white hover:bg-accent-light"
        >
          Back to Designer
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-[52px] min-h-[52px] flex items-center justify-between px-5 bg-surface-elevated border-b border-border">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/review')}
            className="text-text-secondary hover:text-text-primary text-sm"
          >
            {'\u2190 Back'}
          </button>
          <span className="text-text-muted text-sm">|</span>
          <span className="text-text-primary text-sm font-semibold">Submit for Quote</span>
        </div>
        <span className="text-lg font-extrabold tracking-widest bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
          EGX
        </span>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Form — 3 cols */}
            <div className="md:col-span-3">
              <h2 className="text-lg font-bold text-text-primary mb-1">Project Details</h2>
              <p className="text-xs text-text-muted mb-5">
                Tell us about your project so we can prepare an accurate quote.
              </p>

              {error && (
                <div className="mb-4 p-3 rounded bg-error/10 border border-error/30 text-error text-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Field label="Project Name" value={form.projectName} onChange={(v) => update('projectName', v)} />
                <Field label="Your Name *" value={form.customerName} onChange={(v) => update('customerName', v)} required />
                <Field label="Email *" type="email" value={form.customerEmail} onChange={(v) => update('customerEmail', v)} required />
                <Field label="Phone" type="tel" value={form.customerPhone} onChange={(v) => update('customerPhone', v)} />
                <Field label="Property Address" value={form.propertyAddress} onChange={(v) => update('propertyAddress', v)} />

                <div>
                  <label className="block text-[11px] text-text-label mb-1">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-border rounded text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors resize-none"
                    placeholder="Anything else we should know..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="mt-2 w-full py-2.5 text-sm font-medium rounded bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Submitting...' : 'Submit for Quote'}
                </button>
              </form>
            </div>

            {/* Package summary — 2 cols */}
            <div className="md:col-span-2">
              <div className="rounded-lg border border-border bg-surface-elevated p-4 sticky top-8">
                <h3 className="text-sm font-semibold text-text-primary mb-3">Package Summary</h3>
                <div className="flex flex-col gap-2">
                  {activeTypes.map((st) => (
                    <div key={st.id} className="flex items-center justify-between text-xs">
                      <span className="text-text-secondary">{st.typeName}</span>
                      <span className="font-mono text-text-primary">x{st.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">Total Signs</span>
                  <span className="text-sm font-bold text-accent">{totalQty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Reusable form field */
function Field({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] text-text-label mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 text-sm bg-white/5 border border-border rounded text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors"
      />
    </div>
  );
}
