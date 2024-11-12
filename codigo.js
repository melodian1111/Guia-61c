var fila =
  "<tr><td class='id'></td><td class='foto'></td><td class='price'></td><td class='title'></td><td class='description'></td><td class='category'></td></tr>";
var productos = null;
function codigoCat(catstr) {
  var code = "null";
  switch (catstr) {
    case "electronicos":
      code = "c1";
      break;
    case "joyeria":
      code = "c2";
      break;
    case "caballeros":
      code = "c3";
      break;
    case "damas":
      code = "c4";
      break;
  }
  return code;
}
var orden = 0;

function listarProductos(productos) {
    var precio = document.getElementById("price");
    precio.setAttribute("onclick", "orden*=-1;listarProductos(productos);");
    var num = productos.length;
    var listado = document.getElementById("listado");
    var ids, titles, prices, descriptions, categories, fotos;
    var tbody = document.getElementById("tbody"),
        nfila = 0;
    tbody.innerHTML = "";
    var catcode;
    for (i = 0; i < num; i++) tbody.innerHTML += fila;
    var tr;
    ids = document.getElementsByClassName("id");
    titles = document.getElementsByClassName("title");
    descriptions = document.getElementsByClassName("description");
    categories = document.getElementsByClassName("category");
    fotos = document.getElementsByClassName("foto");
    prices = document.getElementsByClassName("price");
    if (orden === 0) {
        orden = -1;
        precio.innerHTML = "Precio";
    } else if (orden == 1) {
        ordenarAsc(productos, "price");
        precio.innerHTML = "Precio A";
        precio.style.color = "darkgreen";
    } else if (orden == -1) {
        ordenarDesc(productos, "price");
        precio.innerHTML = "Precio D";
        precio.style.color = "blue";
    }
    listado.style.display = "block";
    for (nfila = 0; nfila < num; nfila++) {
        ids[nfila].innerHTML = productos[nfila].id;
        titles[nfila].innerHTML = productos[nfila].title;
        descriptions[nfila].innerHTML = productos[nfila].description;
        categories[nfila].innerHTML = productos[nfila].category;
        catcode = codigoCat(productos[nfila].category);
        tr = categories[nfila].parentElement;
        tr.setAttribute("class", catcode);
        prices[nfila].innerHTML = "$" + productos[nfila].price;
        fotos[nfila].innerHTML = "<img src='" + productos[nfila].image + "'>";
        fotos[nfila].firstChild.setAttribute(
            "onclick",
            "window.open('" + productos[nfila].image + "');"
        );
        // Agregar botón de eliminación
        var eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.setAttribute("onclick", `eliminarProducto(${productos[nfila].id})`);
        tr.appendChild(eliminarBtn);
    }
}

function obtenerProductos() {
    fetch("https://retoolapi.dev/cT4DjE/productos")
        .then((res) => res.json())
        .then((data) => {
            productos = data;
            productos.forEach(function(producto) {
                producto.price = parseFloat(producto.price);
            });
            listarProductos(productos);
            document.getElementById("listado").style.display = "block"; // Mostrar el listado
            document.getElementById("toggleListado").style.display = "inline"; // Mostrar el botón de enrollar
        })
        .catch((error) => {
            console.error("Error al obtener los productos:", error);
        });
}

function ordenarDesc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return -1;
    if (a[p_key] < b[p_key]) return 1;
    return 0;
  });
}

function ordenarAsc(p_array_json, p_key) {
  p_array_json.sort(function (a, b) {
    if (a[p_key] > b[p_key]) return 1;
    if (a[p_key] < b[p_key]) return -1;
    return 0;
  });
}

function agregarProducto() {
    var titulo = document.getElementById("titulo").value;
    var precio = parseFloat(document.getElementById("precio").value);
    var descripcion = document.getElementById("descripcion").value;
    var imagen = document.getElementById("imagen").value;
    var categoria = document.getElementById("categoria").value;

    // Asignar un nuevo ID basado en el último ID de la lista actual de productos, comenzando desde 26
    var ultimoId = productos.length > 0 ? productos[productos.length - 1].id : 25;
    var nuevoId = ultimoId >= 25 ? ultimoId + 1 : 26;

    var nuevoProducto = {
        title: titulo,
        price: precio,
        description: descripcion,
        image: imagen,
        category: categoria
    };

    fetch("https://retoolapi.dev/cT4DjE/productos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoProducto)
    })
    .then(response => response.json())
    .then(data => {
        // Agregar el nuevo producto a la lista local
        productos.push(data);
        listarProductos(productos);

        // Limpiar los campos del formulario
        document.getElementById("nuevoProductoForm").reset();
    })
    .catch(error => {
        console.error("Error al agregar el producto:", error);
    });
}

function toggleListado() {
    var listado = document.getElementById("listado");
    var toggleButton = document.getElementById("toggleListado");
    if (listado.style.display === "none" || listado.style.display === "") {
        listado.style.display = "block";
        toggleButton.textContent = "Enrollar Lista";
    } else {
        listado.style.display = "none";
        toggleButton.textContent = "Desplegar Lista";
    }
}

function eliminarProducto(id) {
    fetch(`https://retoolapi.dev/cT4DjE/productos/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            // Eliminar el producto de la lista local
            productos = productos.filter(producto => producto.id !== id);
            listarProductos(productos);
        } else {
            console.error("Error al eliminar el producto:", response.statusText);
        }
    })
    .catch(error => {
        console.error("Error al eliminar el producto:", error);
    });
}
