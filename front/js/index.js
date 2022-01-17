//Affiche tous les produits retournés par l'API
function productsList(){
  let items = document.getElementById("items");
  fetch("http://127.0.0.1:3000/api/products").then(blob => blob.json())
  .then(data => {
      data.forEach(element => {
        items.appendChild(document.createElement("article")).innerHTML = 
        `<a href="./product.html?id=${element["_id"]}">
        <article>
          <img src="${element["imageUrl"]}" alt="${element["description"]}">
          <h3 class="productName">${element["name"]}</h3>
          <p class="productDescription">${element["description"]}</p>
        </article>
      </a>`;
      });
  });
}

productsList();