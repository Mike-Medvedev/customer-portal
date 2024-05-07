export interface Product {
    [key: string]: string | undefined;
    title: string;
    sku: string;
    price: string;
    status: 'available' | 'sold';
    category: 'caskets' | 'urns' | 'memorial items';
    desc: string;
    material?: string;
    color?: string;
}
