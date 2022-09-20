window.onload=inicio;
window.onkeydown=keyboard;
//window.ontouchmove=mobile;
window.onresize=tomarMedidas;
window.ondrag=mouseMobile;
window.onclick=mouseMobile;
let nave;
let x, y = 0;
let widhtNav, widhtNave, heightNav, heigthNave;
let cronoNewMeteorito;
let numMeteorito = 0;
let vidas = 3;
let sonido;

function inicio(){
    nave = document.querySelector("#nave");
    nave.onmousedown=mouseDrag;
    tomarMedidas();
    x = (widhtNav/2)-(widhtNave/2);
    ubicarNave();
    newMeteorito()
    cronoNewMeteorito = setInterval(newMeteorito, 2000);
    sonido = document.querySelector("audio");
}

const reproducir = async (aud) => {
    sonido.src="audios/"+aud;
    await sonido.play();
    
}

const newMeteorito = () => {
    let imgMet = document.createElement('img');
    imgMet.src = "img/meteorito.png";
    //imgMet.id = `meteorito_${numMeteorito}`;    
    imgMet.className = "meteorito";
    imgMet.style.position = "absolute";
    document.getElementById('body').appendChild(imgMet);    
    let posRespectBotom = heightNav-imgMet.offsetHeight-30;
    imgMet.style.bottom =`${posRespectBotom}px`;
    imgMet.style.left = `${Math.floor(Math.random() * (widhtNav-(imgMet.offsetWidth/2)))}px`;
    //imgMet.style.left = `${(widhtNav/2)-(imgMet.offsetWidth/2)}px`;
    console.log(`meteorito left:${imgMet.style.left} widht navegador es: ${widhtNav} y ya el meteorito es ${imgMet.offsetWidth}`);
    let intervalRecorridoMeteorito = setInterval(() => {        
        //let hight = imgMet.getBoundingClientRect().y - 40;
        if(posRespectBotom > 0){
            posRespectBotom = posRespectBotom - 5;            
            imgMet.style.bottom = `${posRespectBotom}px`;            
            if(comprobarChoque(posRespectBotom, imgMet.offsetLeft, imgMet)){                
                reproducir("choque.mp3");
                comprobarVidas();
                clearInterval(intervalRecorridoMeteorito);
                imgMet.parentNode.removeChild(imgMet);
            }
                
        }
        
    },1);
}

const comprobarVidas = () => {
    vidas--;
    if(vidas == 0){
        clearInterval(cronoNewMeteorito);
        document.getElementById("body").style.backgroundImage=`url(${'img/game-over.jpg'})`;
        document.getElementById("body").style.backgroundImage='cover';
        reproducir("fin.mp3");
    }
}

const comprobarChoque = (posRespectBotom, possRespectLeft,imgMet) => {
    return choqueVertical(posRespectBotom,imgMet) && (choqueHorizontal(possRespectLeft,imgMet));
}

const choqueVertical = (posRespectBotom, imgMet) => {
    console.log(`CHOQUE VERTICAL: meteorito Bottom (posRespectBotom):${posRespectBotom} heightMet es:${imgMet.offsetHeight}, y es: ${y} heightNave es:${heigthNave} `);
    if(y>posRespectBotom+imgMet.offsetHeight){
        return false;
    }
    return ((posRespectBotom)- (y+heigthNave))<= -1;    
}

const choqueHorizontal = (possRespectLeft, imgMet) => {
    console.log(`CHOQUE HORIZONTAL: meteorito left (possRespectLeft):${possRespectLeft} widhtMet/2 es:${imgMet.offsetWidth/2}, x es: ${x} widhNave/2 es:${widhtNave/2} `);
    if(x>possRespectLeft){
        return (x - possRespectLeft+(imgMet.offsetWidth/2)) <= (widhtNave/2);
    }
    return (possRespectLeft-(imgMet.offsetWidth/2) ) <= x+(widhtNave/2);
}

function tomarMedidas(){
    widhtNav = window.innerWidth;
    heightNav = window.innerHeight;
    widhtNave = nave.offsetWidth;
    heigthNave = nave.offsetHeight;
    if(y+heigthNave+30 > heightNav){
        y = heightNav - heigthNave - 30;
        ubicarNave();
    }
    if(x+widhtNave > widhtNav){
        x = widhtNav - widhtNave;
        ubicarNave();
    }
}

const ubicarMeteorito = (imgMet) => {
    /*console.log(imgMet.style.bottom);
    imgMet.style.bottom = `${imgMet.style.bottom - 40}px`;
    imgMet.style.left = `${imgMet.style.left + 40}px`;
    console.log(imgMet.style.bottom);*/
    return console.log("me cago en la puta");
}

const ubicarNave = () => {
    nave.style.bottom =`${y}px`;
    nave.style.left =`${x}px`;
}

function keyboard(e){
    let tec = e.key;
    if(tec == "ArrowUp"){
        naveUp(10);
    }
    else if(tec == "ArrowDown"){
        naveDown(10);
    }
    else if(tec == "ArrowLeft"){
        naveLeft(10);
    }
    else if(tec == "ArrowRight"){
        naveRight(10);
    }
}

const naveUp = (size) => {
    if(heightNav - heigthNave -30 > y){
        y += size;
        ubicarNave();
    }    
}

const naveDown = (size) => {
    if(y>0){
        y -= size;
        ubicarNave();
    }    
}

const naveLeft = (size) => {
    x -= size;
    if(x+widhtNave<=15)
        x = widhtNav-20;    
    ubicarNave();
    
}

const naveRight = (size) => {
    x += size;
    if(x>widhtNav-25)
        x = -widhtNave+size;    
    ubicarNave();    
}

function mouseMobile(e){
    ubicarNave();    
}

function mouseDrag(event) {
    // (1) preparar para mover: hacerlo absoluto y ponerlo sobre todo con el z-index
    nave.style.position = 'absolute';
    nave.style.zIndex = 1000;
  
    // quitar cualquier padre actual y moverlo directamente a body
    // para posicionarlo relativo al body
    document.body.append(nave);
  
    // centrar la pelota en las coordenadas (pageX, pageY)
    function moveAt(pageX, pageY) {
        nave.style.left = pageX - nave.offsetWidth / 2 + 'px';
        nave.style.top = pageY - nave.offsetHeight / 2 + 'px';
    }
  
    // mover nuestra pelota posicionada absolutamente bajo el puntero
    moveAt(event.pageX, event.pageY);
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // (2) mover la pelota con mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // (3) soltar la pelota, quitar cualquier manejador de eventos innecesario
    nave.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      nave.onmouseup = null;
    };
  
  };