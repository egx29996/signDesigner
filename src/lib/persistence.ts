import { supabase } from './supabaseClient';
import type { SerializedPackage, PackageMetadata } from '../types';

/**
 * Upsert a sign package to the database.
 * If packageId exists, updates; otherwise inserts and returns new id.
 */
export async function savePackage(pkg: SerializedPackage): Promise<string> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not authenticated');

  const row = {
    family_id: pkg.familyId,
    name: pkg.packageName,
    design_tokens: pkg.designTokens,
    token_color_sources: pkg.tokenColorSources,
    sign_types: pkg.signTypes,
    metadata: pkg.metadata,
    status: pkg.status,
    user_id: user.id,
  };

  if (pkg.packageId) {
    const { error } = await supabase
      .from('sign_packages')
      .update(row)
      .eq('id', pkg.packageId)
      .eq('user_id', user.id);

    if (error) throw error;
    return pkg.packageId;
  }

  const { data, error } = await supabase
    .from('sign_packages')
    .insert(row)
    .select('id')
    .single();

  if (error) throw error;
  return data.id as string;
}

/**
 * Load a package by its ID (must belong to current user via RLS).
 */
export async function loadPackage(packageId: string): Promise<SerializedPackage | null> {
  const { data, error } = await supabase
    .from('sign_packages')
    .select('*')
    .eq('id', packageId)
    .single();

  if (error || !data) return null;

  return {
    packageId: data.id,
    packageName: data.name,
    familyId: data.family_id,
    designTokens: data.design_tokens,
    tokenColorSources: data.token_color_sources ?? {},
    signTypes: data.sign_types,
    metadata: data.metadata ?? {},
    status: data.status,
    shareToken: data.share_token,
  } as SerializedPackage;
}

/**
 * Load a package by its public share token (no auth required via RLS).
 */
export async function loadSharedPackage(shareToken: string): Promise<SerializedPackage | null> {
  const { data, error } = await supabase
    .from('sign_packages')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  if (error || !data) return null;

  return {
    packageId: data.id,
    packageName: data.name,
    familyId: data.family_id,
    designTokens: data.design_tokens,
    tokenColorSources: data.token_color_sources ?? {},
    signTypes: data.sign_types,
    metadata: data.metadata ?? {},
    status: data.status,
    shareToken: data.share_token,
  } as SerializedPackage;
}

/**
 * Generate a unique share token for a package and return the full URL.
 */
export async function createShareLink(packageId: string): Promise<string> {
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16);

  const { error } = await supabase
    .from('sign_packages')
    .update({ share_token: token })
    .eq('id', packageId);

  if (error) throw error;

  const origin = window.location.origin;
  return `${origin}/share/${token}`;
}

/**
 * List all packages belonging to the current user.
 */
export async function listMyPackages(): Promise<
  Array<{ id: string; name: string; familyId: string; updatedAt: string; status: string }>
> {
  const { data, error } = await supabase
    .from('sign_packages')
    .select('id, name, family_id, updated_at, status')
    .order('updated_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as string,
    name: row.name as string,
    familyId: row.family_id as string,
    updatedAt: row.updated_at as string,
    status: row.status as string,
  }));
}

/**
 * Submit a package for quoting — updates status and metadata.
 */
export async function submitForQuote(packageId: string, metadata: PackageMetadata): Promise<void> {
  const { error } = await supabase
    .from('sign_packages')
    .update({
      status: 'submitted',
      metadata,
    })
    .eq('id', packageId);

  if (error) throw error;
}
