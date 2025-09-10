
'use client';

import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
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

export function useBusinessData() {
    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const productsCollection = await getDocs(collection(db, 'products'));
            setProducts(productsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));

            const customersCollection = await getDocs(collection(db, 'customers'));
            setCustomers(customersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Customer)));

            const ordersQuery = query(collection(db, 'orders'), orderBy('date', 'desc'));
            const ordersCollection = await getDocs(ordersQuery);
            setOrders(ordersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order)));

            const inventoryCollection = await getDocs(collection(db, 'inventory'));
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
        const newProduct = { ...product, id: docRef.id };
        setProducts(prev => [...prev, newProduct]);
        return newProduct;
    };

    const addCustomer = async (customer: Omit<Customer, 'id'>) => {
        const docRef = await addDoc(collection(db, "customers"), customer);
        const newCustomer = { ...customer, id: docRef.id };
        setCustomers(prev => [...prev, newCustomer]);
        return newCustomer;
    };

    const addOrder = async (order: Omit<Order, 'id' | 'date'>) => {
        const newOrderData = {
            ...order,
            date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        };
        const docRef = await addDoc(collection(db, "orders"), newOrderData);
        const newOrder = { ...newOrderData, id: docRef.id };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
        const docRef = await addDoc(collection(db, "inventory"), item);
        const newItem = { ...item, id: docRef.id };
        setInventory(prev => [...prev, newItem]);
        return newItem;
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
