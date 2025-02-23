'use client'
import ProductForm from "@/components/products/ProductForm";
import { useEffect } from "react";


export default function NewProduct() {
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {

            console.log("Token from localStorage:", storedToken);
        }
    }, []);
    return (
        <>
            <h1>Edit product</h1>
            <div className="flex">

                <ProductForm />
            </div>
        </>
    );
}
