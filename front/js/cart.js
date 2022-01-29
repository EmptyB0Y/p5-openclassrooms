//Affiche tous les produits ajoutés au panier contenu dans le localStorage
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
                <h2>${product[1]} - ${product[3]}</h2>
                <p>${product[4]}</p>
              </div>
              <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                  <p>Qté : </p>
                  <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product[2]}">
                </div>
                <div class="cart__item__content__settings__delete">
                  <p class="deleteItem">Supprimer</p>
                </div>
              </div>
            </div>`;
            items.appendChild(article);
            //article.getElementsByClassName("itemQuantity").item(0).setAttribute("value",product[2]);
    }
  }

//Met à jour le panier quand un produit viens à être supprimé ou quand l'utilisateur change la quantité d'un produit
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

//Parse la string renvoyé par localStorage.getItem() afin de pouvoir l'utiliser en tant que liste
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
  product[j] = String(sessionStorage.getItem(sessionStorage.key(i)));
  return product;
}

//Empêche l'utilisateur d'entrer des chiffres pour l'évènement input donné
function preventNumberInput(e){
  let key = e.which;
    if ((key >= 33 && key <= 38) || (key >= 40 && key <= 44) || (key >= 46 && key <= 64)|| (key >= 123 && key <= 126)){
        e.preventDefault();
    }
}

//Vérifie que l'utilisateur entre une addresse email au format valide
function testEmailPattern(str){
  let regex = /^[A-Za-z0-9_-]+@\w+\.[a-z]+$/;
  console.log(regex.test(str));
  return regex.test(str);
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

//Envoie des informations de contacts ainsi que la liste de produits commandés à l'API
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
      let id = res.json().then(function(result){
        window.open(`../html/confirmation.html?id=${result.orderId}`);
      });
    }
    else{
      console.log(res);
      alert("Erreur...");
    }
});
}

//Supprime tout le panier
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
if(urlParams.has("id")){
  document.getElementsByClassName("confirmation").item(0).innerHTML = `<p>Merci ! <br>Commande validée ! <br>Votre numéro de commande est : <span id="orderId"></span></p>`;
  document.getElementById("orderId").innerText = urlParams.get("id");
}
//------------------------------
//ORDER PAGE
else{
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


//FILL FORM AND CHECK VALIDITY
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
      else if(form.children[i].children[1].id == "email"){
        form.children[i].children[1].addEventListener("input",function(){
          if(!testEmailPattern(form.children[i].children[1].value)){
            form.children[5].children[0].setAttribute("disabled","");
          }
          else{
            form.children[5].children[0].removeAttribute("disabled");
          }
        });
      }
    }

//ORDER
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

    if(credentials.length == 5){

      if(form.children[5].children[0].hasAttribute("disabled")){
        alert("Le format de l'e-mail est invalide !");
      }
      else{
        if(productList.length != 0){
          clearCart();
          order(credentials,productList);
        }
        else{
          alert("Votre panier est vide !");
        }
      }
    }
    else{
      alert("Le formulaire de commande est incomplet !")
    }

  });
}
