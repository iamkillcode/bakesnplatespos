
'use client';

import { create } from 'zustand';
import { format } from 'date-fns';

type Product = {
    id: string;
    name: string;
    price: number;
};

type Customer = {
    id: string;
    name: string;
    phone: string;
};

type Order = {
    id: string;
    customer: string;
    product: string;
    date: string;
    total: string;
    status: string;
};

type InventoryItem = {
    id: string;
    name: string;
    stock: string;
    reorder: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

type BusinessState = {
    products: Product[];
    customers: Customer[];
    orders: Order[];
    inventory: InventoryItem[];
    addProduct: (product: Omit<Product, 'id'>) => Product;
    addCustomer: (customer: Omit<Customer, 'id'>) => Customer;
    addOrder: (order: Omit<Order, 'id' | 'date'>) => Order;
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
    updateOrderStatus: (orderId: string, status: string) => void;
};

const useBusinessDataStore = create<BusinessState>((set, get) => ({
    products: [
        { id: 'PROD001', name: 'Bento Cake', price: 150.00 },
        { id: 'PROD002', name: 'Cupcakes (2)', price: 30.00 },
        { id: 'PROD003', name: 'Cupcakes (4)', price: 55.00 },
        { id: 'PROD004', name: 'Cupcakes (8)', price: 100.00 },
        { id: 'PROD005', name: 'Cupcakes (12)', price: 140.00 },
        { id: 'PROD006', name: '6" Cake', price: 250.00 },
        { id: 'PROD007', name: '8" Cake', price: 350.00 },
        { id: 'PROD008', name: '10" Cake', price: 450.00 },
        { id: 'PROD009', name: '12" Cake', price: 550.00 },
        { id: 'PROD010', name: 'Doughnuts (2)', price: 25.00 },
        { id: 'PROD011', name: 'Doughnuts (4)', price: 45.00 },
        { id: 'PROD012', name: 'Doughnuts (6)', price: 65.00 },
        { id: 'PROD013', name: 'Doughnuts (8)', price: 85.00 },
        { id: 'PROD014', name: 'Doughnuts (10)', price: 100.00 },
        { id: 'PROD015', name: 'Doughnuts (12)', price: 120.00 },
        { id: 'PROD016', name: 'Sausage Roll', price: 15.00 },
        { id: 'PROD017', name: 'Sobolo Juice', price: 20.00 },
        { id: 'PROD018', name: 'Fruit Juice', price: 25.00 },
    ],
    customers: [
        { id: 'CUS001', name: 'John Doe', phone: '555-0101' },
        { id: 'CUS002', name: 'Jane Smith', phone: '555-0102' },
        { id: 'CUS003', name: 'Bob Johnson', phone: '555-0103' },
    ],
    orders: [
        { id: 'ORD001', customer: 'John Doe', product: 'Bento Cake', date: '2023-11-20', total: 'GH₵150.00', status: 'Completed' },
        { id: 'ORD002', customer: 'Jane Smith', product: 'Cupcakes (4)', date: '2023-11-21', total: 'GH₵55.00', status: 'Pending' },
        { id: 'ORD003', customer: 'Bob Johnson', product: '8" Cake', date: '2023-11-21', total: 'GH₵350.00', status: 'In Progress' },
    ],
    inventory: [
        { id: 'INV001', name: 'All-Purpose Flour', stock: '50 kg', reorder: '20 kg', status: 'In Stock' },
        { id: 'INV002', name: 'Granulated Sugar', stock: '15 kg', reorder: '10 kg', status: 'Low Stock' },
        { id: 'INV003', name: 'Unsalted Butter', stock: '25 kg', reorder: '5 kg', status: 'In Stock' },
        { id: 'INV004', name: 'Large Eggs', stock: '10 dozen', reorder: '12 dozen', status: 'Low Stock' },
        { id: 'INV005', name: 'Cake Boxes (10")', stock: '8 units', reorder: '50 units', status: 'Out of Stock' },
    ],

    addProduct: (product) => {
        const newProduct = { ...product, id: `PROD${String(get().products.length + 1).padStart(3, '0')}` };
        set(state => ({ products: [...state.products, newProduct] }));
        return newProduct;
    },
    addCustomer: (customer) => {
        const newCustomer = { ...customer, id: `CUS${String(get().customers.length + 1).padStart(3, '0')}` };
        set(state => ({ customers: [...state.customers, newCustomer] }));
        return newCustomer;
    },
    addOrder: (order) => {
        const newOrder = { 
            ...order, 
            id: `ORD${String(get().orders.length + 1).padStart(3, '0')}`,
            date: format(new Date(), 'yyyy-MM-dd'),
        };
        set(state => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
    },
    addInventoryItem: (item) => {
        const newItem = { ...item, id: `INV${String(get().inventory.length + 1).padStart(3, '0')}` };
        set(state => ({ inventory: [...state.inventory, newItem] }));
        return newItem;
    },
    updateOrderStatus: (orderId, newStatus) => {
        set(state => ({
            orders: state.orders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        }));
    },
}));

export const useBusinessData = useBusinessDataStore;
