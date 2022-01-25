//Remplis la fiche détaillée du produit sélectionné
function productsShow(id){
    fetch("http://127.0.0.1:3000/api/products/"+id).then(blob => blob.json())
    .then(data => {
        console.log(data.imageUrl);
        let img = document.createElement("img");
        img.setAttribute("src",data.imageUrl);
        img.setAttribute("id","product-img");
        document.getElementsByClassName("item__img").item(0).appendChild(img);
        document.getElementById("title").innerText = data.name;
        document.title = data.name;
        document.getElementById("price").innerText = data.price;
        document.getElementById("description").innerText = `${data.description}`;
        for(let i = 0;i < data.colors.length; i++){
            const child = document.createElement("option");
            child.innerHTML = data.colors[i];
            document.getElementById("colors").appendChild(child).setAttribute("value",data.colors[i]);
        }
    });
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  productsShow(urlParams.get("id"));

  document.getElementById("addToCart").addEventListener("click", function(e){
    let sel = document.getElementById("colors");
    let color = sel.options[sel.selectedIndex].text;
    if(document.getElementById("quantity").value > 0 && color != "--SVP, choisissez une couleur --"){
        let lst = [];
        lst.push(document.getElementById("product-img").getAttribute("src"));
        lst.push(document.getElementById("title").innerText);
        lst.push(document.getElementById("quantity").value);
        lst.push(color);
        if(Boolean(localStorage.getItem(urlParams.get("id")))){
            let product;
            for(let i = 0;i < localStorage.length; i++){
                if(localStorage.key(i) == urlParams.get("id")){
                    product = productParser(i);
                    break;
                }
            }
            if(product[3] == color){
                lst[2] = Number(lst[2]) + Number(product[2])
                localStorage.setItem(urlParams.get("id"),lst);
            }
            else{
                localStorage.setItem(urlParams.get("id")+"-"+color,lst);
                sessionStorage.setItem(urlParams.get("id")+"-"+color,document.getElementById("price").innerText);
            }
        }
        else{
            localStorage.setItem(urlParams.get("id"),lst);
            sessionStorage.setItem(urlParams.get("id"),document.getElementById("price").innerText);
        }
        alert("Article ajouté au panier !");
    }
  });