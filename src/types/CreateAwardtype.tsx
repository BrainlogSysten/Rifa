export interface CreateAwardtype {
    Id:string;
    Title: string; // Título do prêmio
    Description?: string; // Descrição opcional do prêmio
    image1?: File | null; 
    image2?: File | null; 
    image3?: File | null; 
    image4?: File | null; 
    tagType: "Product",
  }