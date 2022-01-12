function productsList(){
    let items = document.getElementById("cart__items");
    for(let i = 0; i < localStorage.length; i++){
            let article = document.createElement("article");
            let product = productParser(i);
            article.setAttribute("class","cart__item");
            article.setAttribute("data-id",localStorage.key(i));
            console.log(product);
            article.innerHTML = 
            `<div class="cart__item__img">
              <img src="${product[0]}" alt="Photographie d'un canapé">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__titlePrice">
                <h2>${product[1]}</h2>
                <p>${product[2]}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>`;
            items.appendChild(article);
            article.getElementsByClassName("itemQuantity").item(0).setAttribute("value",product[3]);
    }
  }

function updateCart(){
    let total = document.getElementsByClassName("cart__item");
    let prices = document.getElementsByClassName("cart__item__content__titlePrice");
    let totalPrice = 0;
    let totalQuantity = [];
    let quantity = 0;

    for(let i = 0; i < total.length; i++){
        totalQuantity.push(Number(total.item(i).getElementsByClassName("itemQuantity").item(0).getAttribute("value")));
        quantity += totalQuantity[i];
    }
    for(let i = 0; i < total.length; i++){
        totalPrice += Number(totalQuantity[i]) * Number(prices.item(i).lastElementChild.innerHTML);
    }
    document.getElementById("totalQuantity").innerHTML = quantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;
}

function productParser(i){
  let lst = String(localStorage.getItem(localStorage.key(i)));
  lst += ",";
  let product = [];
  let str = "";
  let j = 0;
  for(let i = 0; i <= lst.length; i++){
    if(lst.charAt(i) == ','){
      product[j] = str;
      str = "";
      j++;
    }
    else{
      str += lst.charAt(i);
    }
  }
  return product;
}

function order(credentials,products){
  fetch("http://127.0.0.1:3000/api/order/", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  body: JSON.stringify({
    name: credentials[0],
    surname: credentials[1],
    address: credentials[2],
    city: credentials[3],
    email: credentials[4],
    products: products
  })
})
.then( (response) => {
    console.log(response); 
   resolve("../html/confirmation.html");
});
}

productsList();
updateCart();

let productsDel = document.getElementsByClassName("cart__item__content__settings__delete");

document.getElementsByClassName("cart").item(0).addEventListener("click",function(){
    for(let i = 0; i < productsDel.length; i++){
        products.item(i).addEventListener("click",function(){
            if(Boolean(productsDel.item(i))){
                let del = productsDel.item(i).parentElement.parentElement.parentElement;
                localStorage.removeItem(del.getAttribute("data-id"));
                del.parentElement.removeChild(del);
                productsDel = document.getElementsByClassName("cart__item__content__settings__delete");
                updateCart();
            }
        });
    }
});

document.getElementById("cart__items").addEventListener("input",function(e){
    console.log("update cart");
    for(let i = 0; i < products.length; i++){
        products.item(i).parentElement.getElementsByClassName("itemQuantity").item(0).setAttribute("value",e.target.value);
    }
    updateCart();
});

let form = document.getElementsByClassName("cart__order__form").item(0);
let credentials = [];
let productList = [];
  for(let i = 0; i < form.children.length-1; i++){
    form.children[i].children[1].addEventListener("input",function(e){
      credentials[i] = e.target.value;
    });
  }
document.getElementById("order").addEventListener("click",function(e){
  e.preventDefault();
  console.log(credentials);
  for(let i = 0; i < localStorage.length; i++){
    productList[i] = productParser(i);
  }
  console.log(productList);
  order(credentials,productList);
});