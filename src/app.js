
window.onload = () =>{
    fyllHome();
    slumpCitat("#left");
    slumpCitat("#right");
};


// lyssnar om man trycker på länkarna för att komma till "de andra sidorna". Används enbart om modulgrej. Annars interna länkar alternativt specifika sidor för resp del
const lista = document.querySelectorAll(".links a");
lista.forEach((x) => {
    x.addEventListener("click", (e) => {
        switch(e.target.innerHTML){
            case "home":
                fyllHome();
                break;
            case "news":
                fyllNyheter();
                break;
            case "images":
                console.log("öppna bildruta");
                break;
            case "albums":
                fyllAlbum();
                break;
            case "contact":
                visaKontakt();
                break;
        };
        visaBilder();
        e.target.blur();
        document.querySelector(".show").innerHTML = "";

    });
});


//används för att testa funktioner. Knappen tas bort före live
document.getElementById("testKnapp").addEventListener("click", (e) => {
    // show();
    // document.querySelector(".main").innerHTML = "";
    visaKontakt();
})

setInterval(slumpCitat, 5000);

// setInterval(slumpCitat, 1000);

function slumpCitat(sida){
    if(!sida){
        if(Math.round(Math.random()) === 0){
            sida = "#right"
        } else {
            sida ="#left"
        }
   }
    const citatHallare = document.querySelector(sida + " blockquote p");
    const titeltext = document.querySelector(sida + " blockquote span");
    let citatVal = citat[slumpNummer(citat.length, 0)]

    citatHallare.innerHTML = `"${citatVal.text}"`;
    titeltext.textContent = `${citatVal.titel}`;

}

function slumpNummer (max, min){
    // från https://www.geeksforgeeks.org/javascript-math-random-function/ ex 3
    if(min>max){
        //kollar så max och min är i rätt ordning
        let temp = min;
        min = max;
        max = temp;
    }
    return Math.floor(Math.random() * (max - min)) + min
}

function fyllHome(){
    const main = document.querySelector(".main");

    main.innerHTML = "";

    for(let part of band){
        const artikel = document.createElement("article");
        const hr = document.createElement("hr");
        const text = `<h1>${part.rubrik}</h1>
        <img src="${part.bild.src}" alt="${part.bild.alt}">
        ${part.text}`;

        artikel.innerHTML = text;
        main.appendChild(artikel);
        main.appendChild(hr);
    }
}

function fyllNyheter(){
   // fixa så listan inte sorteras varje gång man trycker på "newsknappen"!!!
    const main = document.querySelector(".main");
    
    main.innerHTML = "";
    news.reverse();
    for(let nyhet of news){
        const artikel = document.createElement("article");
        const hr = document.createElement("hr");
        const text = `<h1>${nyhet.rubrik}</h1> ${nyhet.text}`;

        artikel.innerHTML = text;
        main.appendChild(artikel);
        main.appendChild(hr);
    }
}

function fyllAlbum(){
    const main = document.querySelector(".main");

    main.innerHTML = "";

    for(let skiva of album){
        const artikel = document.createElement("article");
        const hr = document.createElement("hr");
        let latar = "<ol>";
        for(lat of skiva.låtar){
            latar += `<li>${lat}</li>`
        }
        latar += "</ol>"
        
        const text = `<h1>${skiva.titel}</h1>
        <img src="${skiva.img}" alt="${skiva.titel} coverart">
        <br>
        ${latar}<br>
        ${skiva.text}`;

        artikel.innerHTML = text;
        main.appendChild(artikel);
        main.appendChild(hr);
    }
}

function show(bildKalla){
    const show = document.querySelector(".show");
    show.innerHTML = "";
    
    const bild = document.createElement("img");
    bild.setAttribute("src", bildKalla);
    show.appendChild(bild);
    showOn = true;

    document.body.addEventListener("click", (e) => {
        
        // gör om så den försvinner utifrån ex path
        //lägg även till så esc funkar
        if(e.target.localName !== "img"){
            show.innerHTML = "";
        }
    });

}

function visaBilder(){
    let mainBilder = document.querySelectorAll(".main img");
    
    for(let bild of mainBilder){
        bild.addEventListener("click", (e) => {
            // console.log(e.toElement.src)
            show(e.toElement.src);
        });
    }
}

function visaKontakt(){
    // lägg till så det funkar med knappar och fokus
    
    const kontakt = document.querySelector(".kontakt");
    kontakt.style.visibility = "visible";
    document.body.addEventListener("click", (e) => {
        let finns = false;
        for(path of e.path){
            if(path.className === "kontakt")
            finns = true;
        }
        if(!finns && e.target.outerText !== "CONTACT"){
            kontakt.style.visibility = "hidden";
        }
    });
}

const blockqutoeKoll = document.querySelectorAll("blockquote");
for(koll of blockqutoeKoll){
    koll.addEventListener("click", (e) => {
        latTitel = e.target.parentElement.children[1].outerText;
        const show = document.querySelector(".main");
        const placeholder = "*MISSING*";
        
        let titel = placeholder;
        let album = placeholder;
        let text = placeholder;
        let img = "img/album/missingPic160x160.jpg";

        for(texter of helaTexter){
            if(texter.titel === latTitel){
                titel = texter.titel;
                album = texter.album;
                text = texter.text;
            }
        };

        show.innerHTML = `<h1>${titel}</h1>
        <h2>${album}</h2>
        <img src="${img}">
        <br>
        ${text}`;

    });
};