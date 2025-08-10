async function test () {
    const res = await fetch('http://localhost:5000/products');
    const data = await res.json();
    console.log(data);
}

test();