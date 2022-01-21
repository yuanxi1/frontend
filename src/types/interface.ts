export interface Tag {
    id: number;
    name: string;
  }
export interface Task {
    id: number;
    title: string;
    description: string;
    tag_list: Tag[];
    completed: boolean;
    duedate: string;
}