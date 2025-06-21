import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.AUTH_TOKEN;

async function createFakeProducts() {
    for (let i = 0; i < 100; i++) {
        let fakeProduct = { 
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price({ min: 1, max: 500 }),
            stock: faker.number.int({ min: 1, max: 1000 }),
            category: faker.commerce.department()
        };

        try {
            const response = await fetch("http://localhost:5000/shops/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ product: fakeProduct })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log(`Product ${i + 1} created:`, result);
            
        } catch (error) {
            console.error(`Failed to create product ${i + 1}:`, error);
        }
    }
}

// Call the function
createFakeProducts();