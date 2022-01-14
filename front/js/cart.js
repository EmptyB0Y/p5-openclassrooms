function productsList(){
    let items = document.getElementById("cart__items");
    for(let i = 0; i < localStorage.length; i++){
            let article = document.createElement("article");
            let product = productParser(i);
            article.setAttribute("class","cart__item");
            article.setAttribute("data-id",localStorage.key(i));
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

function preventNumberInput(e){
  var key = e.which;
    if (key >= 48 && key <= 57){
        e.preventDefault();
    }
}

/**
 *
 * Expects request to contain:
 * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 * products: [string] <-- array of product _id
 *
 */
function order(credentials,products){
  fetch("http://127.0.0.1:3000/api/products/order/", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    contact : {
    firstName: credentials[0],
    lastName: credentials[1],
    address: credentials[2],
    city: credentials[3],
    email: credentials[4]
    },
    products: products
  })
})
.then((res) => {
    if(res.ok){
      window.open(`../html/confirmation.html?id=${res.orderId}`);
    }
    else{
      console.log(res);
      alert("Erreur...");
    }
});
}

function clearCart(){
  localStorage.clear();
  let items = document.getElementsByClassName("cart__item");
  let cart = document.getElementById("cart__items");
  for(let i = 0; i < items.length; i++) {
    cart.removeChild(items.item(i));
  }
  updateCart();
}

//------------------------------
//CONFIRMATION PAGE
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString)
if(urlParams.get("id")){
  document.getElementById("orderId").innerText = urlParams.get("id");
}
//------------------------------
//ORDER PAGE
productsList();
updateCart();

let productsDel = document.getElementsByClassName("cart__item__content__settings__delete");
let products = document.getElementsByClassName("cart__item");

//DELETE ITEM
document.getElementsByClassName("cart").item(0).addEventListener("click",function(){
    for(let i = 0; i < productsDel.length; i++){
        productsDel.item(i).addEventListener("click",function(){
            if(Boolean(productsDel.item(i))){
                let del = products.item(i);
                localStorage.removeItem(del.getAttribute("data-id"));
                del.parentElement.removeChild(del);
                productsDel = document.getElementsByClassName("cart__item__content__settings__delete");
                updateCart();
            }
        });
    }
});

//CHANGE ITEM QUANTITY

document.getElementById("cart__items").addEventListener("input",function(e){
    for(let i = 0; i < products.length; i++){
        productsDel.item(i).parentElement.getElementsByClassName("itemQuantity").item(0).setAttribute("value",e.target.value);
        let product = productParser(localStorage.getItem(products.item(i).getAttribute("data-id")));
        product[3] = e.target.value;
        localStorage.setItem(products.item(i).getAttribute("data-id"),[String(product[0]),String(product[1]),product[2],product[3],String(product[4])]);
    }
    updateCart();
});


//ORDER AND CHECK FORM VALIDITY
let form = document.getElementsByClassName("cart__order__form").item(0);
let credentials = [];
let productList = [];
  for(let i = 0; i < form.children.length-1; i++){
    form.children[i].children[1].addEventListener("input",function(e){
      credentials[i] = e.target.value;
    });
    if(form.children[i].children[1].id == "firstName" || form.children[i].children[1].id == "lastName" || form.children[i].children[1].id == "city"){
      form.children[i].children[1].addEventListener("keypress",function(e){
        preventNumberInput(e);
      });
    }
  }

document.getElementById("order").addEventListener("click",function(e){
  e.preventDefault();
  let id;
  for(let i = 0; i < localStorage.length; i++){
    id = localStorage.key(i);
    if(id.length >= 32){
      id = id.slice(0,32);
    }
    productList.push(id);
  }
  if(credentials.length > 5){

    if(productList.length > 0){
      clearCart();
      order(credentials,productList);
    }
    else{
      alert("Votre panier est vide !");
    }
  }
  else{
    alert("Le formulaire de commande est incomplet !")
  }

});

