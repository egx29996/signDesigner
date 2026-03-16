import React, { useCallback, useMemo } from 'react';
import { usePackageStore } from '../../../stores/package-store';
import { useEditorStore } from '../../../stores/editor-store';

// ---------------------------------------------------------------------------
// ADA character limits by zone
// ---------------------------------------------------------------------------

const MAX_PRIMARY_CHARS = 12;
const MAX_SECONDARY_CHARS = 32;

// ---------------------------------------------------------------------------
// ContentStep
// ---------------------------------------------------------------------------

export const ContentStep: React.FC = () => {
  const signTypes = usePackageStore((s) => s.signTypes);
  const setZoneContent = usePackageStore((s) => s.setZoneContent);
  const activeSignTypeId = useEditorStore((s) => s.activeSignTypeId);

  const activeSignType = useMemo(
    () => signTypes.find((s) => s.id === activeSignTypeId),
    [signTypes, activeSignTypeId],
  );

  // Find editable text zones
  const editableZones = useMemo(() => {
    if (!activeSignType) return [];
    return activeSignType.zones.filter(
      (z) =>
        z.visible &&
        (z.zoneType === 'primary_text' ||
          z.zoneType === 'secondary_text' ||
          z.zoneType === 'header' ||
          z.zoneType === 'code_info'),
    );
  }, [activeSignType]);

  const handleTextChange = useCallback(
    (zoneId: string, text: string) => {
      if (!activeSignType) return;
      setZoneContent(activeSignType.id, zoneId, { text });
    },
    [activeSignType, setZoneContent],
  );

  if (!activeSignType) {
    return (
      <div className="px-4 py-12 text-center text-gray-400">
        Please select a Sign Type first.
      </div>
    );
  }

  const zoneLabelMap: Record<string, string> = {
    primary_text: 'Room Number / Name',
    secondary_text: 'Secondary Text',
    header: 'Header Text',
    code_info: 'Code / Info Text',
  };

  const zoneMaxMap: Record<string, number> = {
    primary_text: MAX_PRIMARY_CHARS,
    secondary_text: MAX_SECONDARY_CHARS,
    header: MAX_SECONDARY_CHARS,
    code_info: MAX_SECONDARY_CHARS,
  };

  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Sign Content</h2>
        <p className="mt-2 text-sm text-gray-500">
          Edit the text content for your{' '}
          <span className="font-semibold text-gray-700">{activeSignType.typeName}</span> sign.
          The preview above updates live.
        </p>
      </div>

      <div className="space-y-6">
        {editableZones.map((zone) => {
          const label = zoneLabelMap[zone.zoneType] || zone.zoneType;
          const max = zoneMaxMap[zone.zoneType] || MAX_SECONDARY_CHARS;
          const currentText = zone.content.text ?? '';
          const charCount = currentText.length;
          const isPrimary = zone.zoneType === 'primary_text';

          return (
            <div key={zone.id}>
              <label
                htmlFor={`content-${zone.id}`}
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                {label}
              </label>

              {isPrimary ? (
                <input
                  id={`content-${zone.id}`}
                  type="text"
                  value={currentText}
                  onChange={(e) => handleTextChange(zone.id, e.target.value)}
                  maxLength={max}
                  placeholder={isPrimary ? '101' : 'Enter text...'}
                  className="w-full px-4 py-3 text-2xl font-bold text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:border-transparent transition-shadow"
                />
              ) : (
                <textarea
                  id={`content-${zone.id}`}
                  value={currentText}
                  onChange={(e) => handleTextChange(zone.id, e.target.value)}
                  maxLength={max}
                  rows={2}
                  placeholder="Enter text..."
                  className="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a3c5e] focus:border-transparent transition-shadow resize-none"
                />
              )}

              {/* Character count */}
              <div className="flex items-center justify-between mt-1">
                <span className="text-[11px] text-gray-400">
                  {charCount}/{max} characters
                </span>
                {charCount > max * 0.8 && (
                  <span className="text-[11px] text-amber-500 font-medium">
                    Approaching limit
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {editableZones.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            This sign type has no editable text zones.
          </div>
        )}
      </div>

      {/* ADA note */}
      <div className="mt-8 p-4 bg-blue-50/60 border border-blue-100 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          <span className="font-semibold">ADA Note:</span> Raised text characters must be between
          5/8" and 2" in height per ADA Standards. Room numbers are limited in character count to
          ensure proper sizing. Braille is generated automatically.
        </p>
      </div>
    </div>
  );
};
