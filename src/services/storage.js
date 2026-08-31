import { supabase } from "../lib/supabase";

function slugifyFilename(file) {
  const ext = file.name.split(".").pop();
  const base = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${Date.now()}-${base || "image"}.${ext}`;
}

export async function uploadImage(bucket, file) {
  if (!supabase) return { url: null, error: "Supabase n'est pas configuré." };
  const path = slugifyFilename(file);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path, error: null };
}

export async function deleteImage(bucket, path) {
  if (!supabase) return { error: "Supabase n'est pas configuré." };
  if (!path) return { error: null };
  const { error } = await supabase.storage.from(bucket).remove([path]);
  return { error: error ? error.message : null };
}

export function pathFromPublicUrl(bucket, url) {
  if (!url) return null;
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

/**
 * Removes the previous image only after a replacement has been durably saved
 * (call this after the DB update/insert succeeds, never right after upload).
 * Deleting eagerly on upload — before the form is actually saved — leaves the
 * database pointing at a file that no longer exists if the save is abandoned
 * or fails.
 */
export async function cleanupPreviousImage(bucket, previousUrl, newUrl) {
  if (!previousUrl || previousUrl === newUrl) return;
  const path = pathFromPublicUrl(bucket, previousUrl);
  if (path) await deleteImage(bucket, path);
}
