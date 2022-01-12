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
  
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  productsShow(urlParams.get("id"));

  document.getElementById("addToCart").addEventListener("click", function(e){
    let sel = document.getElementById("colors");
    let color = sel.options[sel.selectedIndex].text;
    if(document.getElementById("quantity").value > 0 && color != "--SVP, choisissez une couleur --"){
        console.log("event passed");
        let lst = [];
        lst.push(document.getElementById("product-img").getAttribute("src"));
        lst.push(document.getElementById("title").innerText);
        lst.push(document.getElementById("price").innerText);
        lst.push(document.getElementById("quantity").value);
        localStorage.setItem(urlParams.get("id"),lst);
        console.log(lst);
    }
  });