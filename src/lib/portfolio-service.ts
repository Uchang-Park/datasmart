import { supabase } from "@/lib/supabase";

export const PORTFOLIO_BUCKET = "portfolio";

export type Portfolio = {
  id: string;
  title: string;
  description: string;
  image_path: string;
  image_url: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PortfolioInput = {
  title: string;
  description: string;
  sort_order?: number | undefined;
};

function throwIfError(error: { message: string; hint?: string | null } | null) {
  if (!error) return;
  const hint = error.hint ? ` (${error.hint})` : "";
  throw new Error(`${error.message}${hint}`);
}

export async function listPortfolios() {
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  throwIfError(error);
  return (data ?? []) as Portfolio[];
}

export async function listPortfoliosForPublic() {
  try {
    return await listPortfolios();
  } catch {
    return [];
  }
}

function extensionOf(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "jpg";
}

export async function uploadPortfolioImage(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("이미지 파일만 업로드할 수 있습니다.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("이미지 크기는 5MB 이하여야 합니다.");
  }

  const path = `${crypto.randomUUID()}.${extensionOf(file)}`;
  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  throwIfError(error);

  const { data } = supabase.storage.from(PORTFOLIO_BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deletePortfolioImage(path: string) {
  if (!path) return;
  const { error } = await supabase.storage.from(PORTFOLIO_BUCKET).remove([path]);
  throwIfError(error);
}

export async function createPortfolio(input: PortfolioInput, file: File) {
  const image = await uploadPortfolioImage(file);
  const { data, error } = await supabase
    .from("portfolios")
    .insert({
      title: input.title,
      description: input.description,
      image_path: image.path,
      image_url: image.url,
      sort_order: input.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    await deletePortfolioImage(image.path).catch(() => undefined);
    throwIfError(error);
  }
  return data as Portfolio;
}

export async function updatePortfolio(
  id: string,
  input: PortfolioInput,
  options?: { file?: File | undefined; previousImagePath?: string | undefined },
) {
  let image_path: string | undefined;
  let image_url: string | undefined;

  if (options?.file) {
    const image = await uploadPortfolioImage(options.file);
    image_path = image.path;
    image_url = image.url;
  }

  const { data, error } = await supabase
    .from("portfolios")
    .update({
      title: input.title,
      description: input.description,
      sort_order: input.sort_order ?? 0,
      ...(image_path && image_url ? { image_path, image_url } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (image_path) await deletePortfolioImage(image_path).catch(() => undefined);
    throwIfError(error);
  }

  if (image_path && options?.previousImagePath) {
    await deletePortfolioImage(options.previousImagePath).catch(() => undefined);
  }

  return data as Portfolio;
}

export async function deletePortfolio(item: Portfolio) {
  const { error } = await supabase.from("portfolios").delete().eq("id", item.id);
  throwIfError(error);
  await deletePortfolioImage(item.image_path).catch(() => undefined);
}
