
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, writeBatch } from 'firebase/firestore';
import { format } from 'date-fns';

export type Product = {
    id: string;
    name: string;
    price: number;
};

export type Customer = {
    id: string;
    name: string;
    phone: string;
};

export type Order = {
    id: string;
    customer: string;
    product: string;
    date: string;
    total: string;
    status: string;
};

export type InventoryItem = {
    id: string;
    name: string;
    stock: string;
    reorder: string;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

const seedDatabase = async () => {
    const batch = writeBatch(db);
    let dirty = false;

    // Seed Products
    const productsCollection = collection(db, 'products');
    const productsSnapshot = await getDocs(productsCollection);
    if (productsSnapshot.empty) {
        dirty = true;
        const initialProducts = [
            { name: 'Bento Cake', price: 65.00 },
            { name: 'Cupcakes (2)', price: 40.00 },
            { name: 'Cupcakes (4)', price: 70.00 },
            { name: 'Cupcakes (8)', price: 120.00 },
            { name: 'Cupcakes (12)', price: 180.00 },
            { name: '6 inches cake', price: 300.00 },
            { name: '8 inches cake', price: 450.00 },
            { name: '10 inches cake', price: 600.00 },
            { name: '12 inches cake', price: 800.00 },
            { name: 'Doughnuts (2)', price: 30.00 },
            { name: 'Doughnuts (4)', price: 55.00 },
            { name: 'Doughnuts (6)', price: 80.00 },
            { name: 'Doughnuts (8)', price: 100.00 },
            { name: 'Doughnuts (10)', price: 120.00 },
            { name: 'Doughnuts (12)', price: 140.00 },
            { name: 'Sausage Rolls', price: 15.00 },
            { name: 'Sobolo Juice', price: 10.00 },
            { name: 'Fruit Juice', price: 12.00 },
        ];
        initialProducts.forEach(product => {
            const docRef = doc(productsCollection);
            batch.set(docRef, product);
        });
        console.log('Seeding products...');
    }

    // Seed Customers
    const customersCollection = collection(db, 'customers');
    const customersSnapshot = await getDocs(customersCollection);
    if (customersSnapshot.empty) {
        dirty = true;
        const initialCustomers = [
            { name: 'Ama Serwaa', phone: '024-123-4567' },
            { name: 'Kofi Mensah', phone: '055-987-6543' },
            { name: 'Walk-in Customer', phone: 'N/A' },
        ];
        initialCustomers.forEach(customer => {
            const docRef = doc(customersCollection);
            batch.set(docRef, customer);
        });
        console.log('Seeding customers...');
    }
    
    // Seed Inventory
    const inventoryCollection = collection(db, 'inventory');
    const inventorySnapshot = await getDocs(inventoryCollection);
    if(inventorySnapshot.empty) {
        dirty = true;
        const initialInventory = [
            { name: 'Flour', stock: '50 kg', reorder: '10 kg', status: 'In Stock' },
            { name: 'Sugar', stock: '25 kg', reorder: '5 kg', status: 'In Stock' },
            { name: 'Eggs', stock: '5 Crates', reorder: '1 Crate', status: 'In Stock' },
            { name: 'Butter', stock: '5 kg', reorder: '2 kg', status: 'Low Stock' },
            { name: 'Chocolate', stock: '10 bars', reorder: '5 bars', status: 'In Stock' },
            { name: 'Vanilla Extract', stock: '1 bottle', reorder: '0.5 bottle', status: 'Out of Stock' },
        ];
        initialInventory.forEach(item => {
            const docRef = doc(inventoryCollection);
            batch.set(docRef, item);
        });
        console.log('Seeding inventory...');
    }

    // Seed Orders (only if products and customers were also seeded)
    const ordersCollection = collection(db, 'orders');
    const ordersSnapshot = await getDocs(ordersCollection);
    if (ordersSnapshot.empty) {
        dirty = true;
        const initialOrders = [
            { customer: 'Ama Serwaa', product: 'Bento Cake (x1)', total: 'GH₵65.00', status: 'Completed', date: format(new Date(2024, 4, 1, 10, 30), 'yyyy-MM-dd HH:mm:ss') },
            { customer: 'Kofi Mensah', product: 'Doughnuts (6) (x1)', total: 'GH₵80.00', status: 'Pending', date: format(new Date(2024, 4, 2, 14, 0), 'yyyy-MM-dd HH:mm:ss') },
            { customer: 'Walk-in Customer', product: 'Sausage Rolls (x2)', total: 'GH₵30.00', status: 'Completed', date: format(new Date(2024, 4, 3, 9, 15), 'yyyy-MM-dd HH:mm:ss') },
        ];
         initialOrders.forEach(order => {
            const docRef = doc(ordersCollection);
            batch.set(docRef, order);
        });
        console.log('Seeding orders...');
    }

    if (dirty) {
        await batch.commit();
        console.log('Database seeding committed.');
        return true;
    }
    console.log('Database seeding check complete. No new data seeded.');
    return false;
};


export function useBusinessData() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const seeded = await seedDatabase();
            // If we seeded, we need a brief moment for writes to propagate before reading.
            if (seeded) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const productsCollection = await getDocs(query(collection(db, 'products'), orderBy('name')));
            setProducts(productsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

            const customersCollection = await getDocs(query(collection(db, 'customers'), orderBy('name')));
            setCustomers(customersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));

            const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
            const ordersCollection = await getDocs(ordersQuery);
            setOrders(ordersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

            const inventoryCollection = await getDocs(query(collection(db, 'inventory'), orderBy('name')));
            setInventory(inventoryCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem)));
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addProduct = async (product: Omit<Product, 'id'>) => {
        const docRef = await addDoc(collection(db, "products"), product);
        await fetchData(); // Refetch to get sorted list
        return { ...product, id: docRef.id };
    };

    const addCustomer = async (customer: Omit<Customer, 'id'>) => {
        const docRef = await addDoc(collection(db, "customers"), customer);
        await fetchData(); // Refetch to get sorted list
        return { ...customer, id: docRef.id };
    };

    const addOrder = async (order: Omit<Order, 'id' | 'date'>) => {
        const newOrderData = {
            ...order,
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
        const docRef = await addDoc(collection(db, "orders"), newOrderData);
        await fetchData(); // Refetch to get sorted list
        return { ...newOrderData, id: docRef.id };
    };

    const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
        const docRef = await addDoc(collection(db, "inventory"), item);
        await fetchData(); // Refetch to get sorted list
        return { ...item, id: docRef.id };
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        const orderRef = doc(db, "orders", orderId);
        await updateDoc(orderRef, { status: newStatus });
        setOrders(prev =>
            prev.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    return { products, customers, orders, inventory, loading, addProduct, addCustomer, addOrder, addInventoryItem, updateOrderStatus, refetch: fetchData };
}
