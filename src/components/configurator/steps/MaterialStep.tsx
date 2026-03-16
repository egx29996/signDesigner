import React, { useCallback } from 'react';
import { Check } from 'lucide-react';
import { TEXTURE_REGISTRY, type TextureDefinition } from '../../../lib/texture-registry';
import { usePackageStore } from '../../../stores/package-store';
import { useConfiguratorStore } from '../../../stores/configurator-store';

// ---------------------------------------------------------------------------
// Group textures by category
// ---------------------------------------------------------------------------

type Category = TextureDefinition['category'];

const CATEGORY_LABELS: Record<Category, string> = {
  metal: 'Metal',
  wood: 'Wood',
  stone: 'Stone',
  solid: 'Solid',
  specialty: 'Specialty',
};

const CATEGORY_ORDER: Category[] = ['metal', 'wood', 'stone', 'solid', 'specialty'];

function groupByCategory(): { category: Category; label: string; items: TextureDefinition[] }[] {
  const groups: { category: Category; label: string; items: TextureDefinition[] }[] = [];
  for (const cat of CATEGORY_ORDER) {
    const items = TEXTURE_REGISTRY.filter((t) => t.category === cat);
    if (items.length > 0) {
      groups.push({ category: cat, label: CATEGORY_LABELS[cat], items });
    }
  }
  return groups;
}

// ---------------------------------------------------------------------------
// MaterialStep
// ---------------------------------------------------------------------------

export const MaterialStep: React.FC = () => {
  const faceMaterial = usePackageStore((s) => s.designTokens.faceMaterial);
  const setToken = usePackageStore((s) => s.setToken);
  const nextStep = useConfiguratorStore((s) => s.nextStep);

  const groups = React.useMemo(() => groupByCategory(), []);

  const handleSelect = useCallback(
    (id: string) => {
      setToken('faceMaterial', id);
      setTimeout(() => nextStep(), 300);
    },
    [setToken, nextStep],
  );

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Face Material</h2>
        <p className="mt-2 text-sm text-gray-500">
          Choose the primary surface material for your sign face.
        </p>
      </div>

      {groups.map((group) => (
        <div key={group.category} className="mb-8">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {group.label}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {group.items.map((tex) => {
              const selected = faceMaterial === tex.id;

              return (
                <button
                  key={tex.id}
                  onClick={() => handleSelect(tex.id)}
                  className={[
                    'relative flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer',
                    'border bg-white',
                    selected
                      ? 'border-2 border-[#1a3c5e] ring-2 ring-[#1a3c5e]/20 shadow-md'
                      : 'border-gray-200 hover:shadow-md hover:-translate-y-0.5',
                  ].join(' ')}
                >
                  {/* Selected check */}
                  {selected && (
                    <div className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-[#1a3c5e] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}

                  {/* Texture preview */}
                  <div className="w-full h-24 relative">
                    {tex.imagePath ? (
                      <img
                        src={`/textures/${tex.imagePath}`}
                        alt={tex.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full"
                        style={{ backgroundColor: tex.baseColor || '#e5e7eb' }}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="px-3 py-2.5">
                    <span className="text-sm font-semibold text-gray-900">{tex.name}</span>
                    <span className="block text-[11px] text-gray-400 mt-0.5 capitalize">
                      {group.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
