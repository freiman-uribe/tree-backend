export interface Node {
  id: number;
  parent: number | null;
  title: string;
  created_at: Date;
}