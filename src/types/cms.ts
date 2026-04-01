export type BlockType = 
  | "heading"
  | "paragraph"
  | "image"
  | "cta_button"
  | "list"
  | "quote"
  | "divider"
  | "video";

export interface ContentBlock {
  id: string;
  type: BlockType;
  data: Record<string, any>;
}

export interface SitePage {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  content: ContentBlock[];
  is_published: boolean;
  show_in_nav: boolean;
  nav_order: number;
  nav_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
  created_at: string;
  updated_at: string;
}
