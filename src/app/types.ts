export interface ImageT {
    id: number;
    url: string;
    description: string;
    slideActive: boolean;
    groupId: number;
    Group: Group; // This might need to be updated based on the structure of the Group interface
  }
  
export interface Group {
id: number;
name: string;
Image: ImageT[];
}
