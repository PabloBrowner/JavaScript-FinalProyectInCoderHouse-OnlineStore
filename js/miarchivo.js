//E-Commerce de impresoras 3D

async function obtenerProductos () {
    const response = await fetch(`./json/productos.json`)
    return await response.json()
}

let arrayProductos = obtenerProductos()


const main = document.querySelector("#main");
const container = document.querySelector(".container");

const sidebar = document.querySelector(".sidebar") //Funciona con selectores css
const btnCarrito = document.querySelector(".btn-carrito")

//Ni bien arranca la pagina consulto el localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || []

btnCarrito.addEventListener("click", () => {
    sidebar.classList.toggle("active")
    //Sweetalert
    if(carrito.length === 0) {
        Swal.fire({
            title: "Carrito vacio", 
            text: "😒",
            icon: "warning",
            background: "#333"
        })
    }
})

const cargarProductos = () => {
    arrayProductos.then(productos => {
        productos.forEach(element => {
            main.innerHTML += `
            <div class="caja">
                <div class="card mb-3" id="producto${element.id}"style="max-width: 20rem;">
                    <img src="./img/${element.img}"" class="card-img-top caja--img" alt="...">
                    <div class="caja--datos>
                        <div class="card-body" style="margin-left: 10px;">
                            <p class="marca textoCard" style="margin-bottom: 5px; font-weight: regular; font-size: 20px">${element.marca} ${element.nombre}</p>
                            <p class="precio" style="margin-bottom: 5px; font-weight: regular; font-size: 20px; color: rgb(46, 126, 255">$<span>${element.precio}</span></p>
                            <button class="btn btn-primary btn-agregar" data-id ="${element.id}" style="margin-bottom: 5px; width: 80%; margin-left: 10%; margin-top: 5px";>Agregar</button>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    

        const btnAgregar = document.querySelectorAll(".btn-agregar")
        //Necesito agregarle un escuchador
        btnAgregar.forEach((e) => 
            e.addEventListener("click", (e) => { //Cuando haga click aca me agrega el producto al carrito
                let cardPadre =  e.target.parentElement //Con parent element selecciono el padre, como lo puse dos veces me selecciono caja
            
                agregarAlCarrito(cardPadre)
            })
        )
    })
}


//SWEETALERT
//Como lo vuelvo a utilizar lo guardo como una variable
const swalToast = (texto, color, posicion) => {
    Swal.fire({
        toast: true,
        text: texto,
        background: color,
        position: posicion,
        showConfirmButton: false,
        timer: 1400,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          }
    })
}

const agregarAlCarrito = (cardPadre) => {

    //Sweetalert
    swalToast("Producto agregado", "#33ff33", "bottom-end")

    let producto = {
        nombre: cardPadre.querySelector(".nombre"), 
        precio: Number(cardPadre.querySelector(".precio span").textContent),
        cantidad: 1,
        imagen: cardPadre.parentElement.querySelector("img").src,
        id: Number(cardPadre.querySelector("button").getAttribute("data-id")),
    }

    //Para que cuando se agregan dos juegos iguales aparezca la cantidad en vez de multiplicarse
    //Con esto digo que si el producto que se esta ingresando tiene un id igujal a un id que ya se encuentra en el carrito que me devuelva ese objeto

    let productoEncontrado = carrito.find((element) => element.id === producto.id)

    if(productoEncontrado) {
        productoEncontrado.cantidad++;
    } else {
        carrito.push(producto);
    }

    mostrarCarrito()
}

//Recorro el carrito para ir agregando cosas en el

const mostrarCarrito = () => {
    sidebar.innerHTML = "" //Con esto evito que se multiplique
    carrito.forEach(element => {
        let{img, marca, nombre, precio, id} = element
        sidebar.innerHTML += `
        <div class="caja">
            <div class="card border-primary mb-3" id="producto${element.id}"style="max-width: 20rem;">
                    <img src="./img/${element.img}" class="card-img-top caja--img" alt="${element.nombre}">
                    <div class="card-header">${element.nombre}</div>
                    <div class="card-body">
                        <div class="caja--datos">
                            <h4 class="card-title">${element.marca}</h4>
                            <p class="card-text">$${element.precio}</p>
                            <button class="btn-restar" data-id="${id}">-</button>
                            <button class="btn-borrar" data-id="${id}">BORRAR</button>
                        </div>
                    </div>
            </div>
        </div>
        `
    })

    //Local Storage
    localStorage.setItem("carrito", JSON.stringify(carrito))

    aumentarNumeroCantidadCarrito()
    calcularTotal()
}

const restarProducto = (productoRestar) => {
    //Sweetalert
    swalToast("Producto retirado", "#ff0000", "bottom")

    let productoEncontrado = carrito.find
    ((element) => element.id === Number(productoRestar))
    if(productoEncontrado) {
        productoEncontrado.cantidad--
        if(productoEncontrado.cantidad === 0) {
            borrarProducto(productoRestar)
        }
    }

    mostrarCarrito()
}

const borrarProducto = (productoBorrar) => {
    carrito = carrito.filter(element => element.id !== Number(productoBorrar))
    //Con esto digo que me borre todos los productos que coincida el id con el boton y devolveme el resto, por eso filter
    mostrarCarrito()
}

//Delegacion de eventos

const escucharBotonesSidebar = () => {
    sidebar.addEventListener("click", (e) => {
        if(e.target.classList.contains("btn-restar")) { //El e.target va a ser referencia al modo en que se disparo el evento, en este caso el boton //Contains me devuelve true or false
            restarProducto(e.target.getAttribute("data-id")) 
    }
    if(e.target.classList.contains("btn-borrar")) {
            borrarProducto(e.target.getAttribute("data-id"))
    }
})
}

const aumentarNumeroCantidadCarrito = () => {
    let total = carrito.reduce((acc,ite) => acc+ite.cantidad,0)
    //Reduce es para sacar el total con un acumulador(que inicia en 0) y un iterador(es cada elemento), con la propiedad cantidad y el parametro 0 indico que el acumulador inicia en 0
    document.querySelector(".cant--carrito").textContent = total
}

const calcularTotal = () => {

    if(carrito.length !== 0) {
        let total = carrito.reduce((acc,ite) => acc + ite.precio * ite.cantidad,0)

        let divTotal = document.createElement("div")
        divTotal.className = "caja"
        divTotal.id = "total--compra"

        divTotal.innerHTML = `<p>Total $${total}</p><button>Finalizar compra</button>`
        sidebar.appendChild(divTotal)
    
        let botonFinalizar = document.querySelector("#total--compra")

        botonFinalizar.onclick = () => {
        const mixin = Swal.mixin()
        //Mixin es solo un nombre que le pone el profe
        mixin.fire({
            title: "Complete con sus datos",
            html: ` <input id="tarjeta" type= "number" class= "swal2-input" placeholder= "Nro de Tarjeta">
            <br>
            <input id="domicilio" type= "text" class= "swal2-input" placeholder= "Domicilio">
            <p>Total $${total}</p>
            `,
            confirmButtonText: "Comprar",
            confirmButtonColor: "rgb(46, 126, 255)",
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            showCloseButton: true,
            allowOutsideClick: false,

            preConfirm: () => {
                let domicilio = Swal.getPopup().querySelector("#domicilio").value

                if(!domicilio) {
                    Swal.showValidationMessage("Por favor, completar datos")
                }
                return domicilio
            }
        })
        .then((response) => {
            if(response.isConfirmed) {
                console.log(response)
                mixin.fire(
                    "Compra realizada",
                    "El pedido sera enviado a" + response.value,
                    "success"
                )
            }
        })
        }
    } 
}





cargarProductos()
mostrarCarrito()
escucharBotonesSidebar()