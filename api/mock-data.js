import { faker } from '@faker-js/faker';

const token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImsxN3FUaE5IaWJGSmRid0hySllPSiJ9.eyJpc3MiOiJodHRwczovL2Rldi13NHZnY3gxZS51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMTAyOTU4OTQ1ODQ5MTg3MjAxMzEiLCJhdWQiOlsibmV4dXMtYXBpIiwiaHR0cHM6Ly9kZXYtdzR2Z2N4MWUudXMuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc1MDI4NzQ4NywiZXhwIjoxNzUwMzczODg3LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiNkJsWU0zVGN6YndzNU54VVhUT2VDVVVyNGQyeFFyZ3MifQ.ETKoVFeDdDExdg4Sc-ctWjsmGD90pEJs1I7ppEZKEwR1l1fE79FXMOoa4Ekg7GLzM_23_icy-872ZKzczDq3Htfou62mEcN0rjCNG_NjdOlRkt-D5ipHVjsQ9mc8vr3cKAr69GBzj9vWRQ8wOXeuIwTPU6FQGj8e3FwpuEE0xkNkk5S9e40Mkt19USTJG-5F0jLWq-q9tDuF40vWzfMnMAtyMqKinFATW_1LEOzlPiJZZVFuWdspr-cS8o_nWL9RbjzUm2ev55LJNFNAwO-3bR2Pzisvcw0Xge_XX-_Vmv7clEusRNqVSmky3nhWRXUJ_1UYm7gpfK4V5vNvVSd5Ug"

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
        
        // Optional: Add delay to avoid overwhelming the server
        // await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Call the function
createFakeProducts();