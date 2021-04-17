window.onload = () => {
    document.querySelector(".errorMsg").style.display = "none"
    document.querySelector(".site").style.display = "block"
    fyllHome();
    visaBilder();
    slumpCitat("#left");
    slumpCitat("#right");

};

const lista = document.querySelectorAll(".links a");
lista.forEach((x) => {
    x.addEventListener("click", (e) => {
        e.preventDefault()
        switch (e.target.innerHTML) {
            case "home":
                fyllHome();
                visaBilder();
                break;
            case "news":
                fyllNyheter();
                visaBilder();
                break;
            case "gigs":
                fyllGigs()
                break
            case "images":
                fyllImages();
                break;
            case "albums":
                fyllAlbum();
                break;
        };
        e.target.blur();
        document.querySelector(".show").innerHTML = "";

    });
});


setInterval(slumpCitat, 5000);


function slumpCitat(sida) {
    if (!sida) {
        if (Math.round(Math.random()) === 0) {
            sida = "#right"
        } else {
            sida = "#left"
        }
    }
    const citatHallare = document.querySelector(sida + " blockquote p");
    const titeltext = document.querySelector(sida + " blockquote span");
    let citatVal = citat[slumpNummer(citat.length, 0)]

    citatHallare.innerHTML = `"${citatVal.text}"`;
    titeltext.textContent = `${citatVal.titel}`;

}

function slumpNummer(max, min) {
    // från https://www.geeksforgeeks.org/javascript-math-random-function/ ex 3
    if (min > max) {
        //kollar så max och min är i rätt ordning
        let temp = min;
        min = max;
        max = temp;
    }
    return Math.floor(Math.random() * (max - min)) + min
}

function fyllHome() {
    const main = document.querySelector(".main");

    main.innerHTML = "";

    for (let part of band) {
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

function fyllNyheter() {
    // fixa så listan inte sorteras varje gång man trycker på "newsknappen"!!!
    const main = document.querySelector(".main");

    main.innerHTML = "";
    news.reverse();
    for (let nyhet of news) {
        const artikel = document.createElement("article");
        const hr = document.createElement("hr");
        const text = `<h1>${nyhet.rubrik}</h1> ${nyhet.text}`;

        artikel.innerHTML = text;
        main.appendChild(artikel);
        main.appendChild(hr);
    }
}

function fyllGigs() {
    const main = document.querySelector(".main");
    main.innerHTML = ""

    const gigList = document.createElement("ul")
    gigList.className = "gigList"
    for (const spelning of spelningar) {
        const {
            datum,
            namn,
            plats
        } = spelning

        const anpassatDatum = prettyDate(datum)


        const li = document.createElement("li")
        li.innerHTML = `<span class="dateSpan">${anpassatDatum}</span>
        <span class="nameSpan">${namn}</span>
        <span class="placeSpan">${plats}</span>`
        gigList.append(li)
    }

    main.append(gigList)
}

function prettyDate(yymmdd) {
    let ymd = yymmdd.match(/(\d{2})/g)
    return `20${ymd[0]}-${ymd[1]}-${ymd[2]}`
}

function fyllImages() {
    const main = document.querySelector(".main");


    let mainText = ""

    for (const spelning of bilderSpelningar.reverse()) {
        const {
            namn,
            plats,
            datum,
            antalBilder
        } = spelning

        let anpassatDatum = prettyDate(datum)

        let thumbs = ""
        for (let i = 0; i < antalBilder; i++) {
            thumbs += `<a href="#"><img src="img/spelningar/${datum}/tn/a (${i + 1}).jpg"></a>`
        }

        const text = `<div>
        <h2>${namn}
        <span>(${anpassatDatum})</span></h2>
        <h3>${plats}</h3>
        <div class="thumbs">${thumbs}</div>
        
        </div>
        <hr>`

        mainText = mainText + text
    }

    main.innerHTML = `<div class="gigPics">
    ${mainText}
    </div>`

    let thumbBilder = document.querySelectorAll(".thumbs img");

    for (let bild of thumbBilder) {
        bild.addEventListener("click", (e) => {
            e.preventDefault()
            const pos = calcPos(e)
            console.log(e)
            show(e.target.src.replace("/tn", ""), pos);
        });
    }
}

function calcPos(e) {
    return e.view.scrollY + 20 + "px"
}

function fyllAlbum() {
    const main = document.querySelector(".main");

    main.innerHTML = "";

    for (let skiva of album) {
        const artikel = document.createElement("article");
        artikel.className = "album"
        const hr = document.createElement("hr");
        let latar = `<ol class="latlista">`;
        for (lat of skiva.låtar) {
            latar += `<li class="lat">${lat}</li>`
        }
        latar += "</ol>"

        let spotify;
        let spotifyIndicator = "";
        if (skiva.spotify) {
            spotify = `href="${skiva.spotify}" target="_blank" class="albumlink"`
            spotifyIndicator = `<img src="img/ikoner/spotify.svg" alt="Spotify" class="albumcoverSpotify">`
        } else {
            spotify = `class="ingenLank"`

        }

        let albumText = ""
        if (skiva.text) {
            albumText = `<p class="albumText">${skiva.text}</p>`
        }

        const text = `<h1>${skiva.titel}</h1>
        <a ${spotify}>
        <img src="${skiva.img}" alt="${skiva.titel} coverart" class="albumcover">
        ${spotifyIndicator}
        </a>
        ${latar}
        ${albumText}`;

        artikel.innerHTML = text;
        main.appendChild(artikel);
        main.appendChild(hr);
    }

    const latLankLista = document.querySelectorAll(".main li")
    for (const lat of latLankLista) {
        lat.addEventListener("click", (e) => {
            visaText(e.target.innerText)
        })
    }
}

function show(bildKalla, pos = "50vh") {
    const show = document.querySelector(".show");
    show.innerHTML = "";

    const bild = document.createElement("img");
    bild.setAttribute("src", bildKalla);
    show.appendChild(bild);
    show.classList.add("showing")
    show.style.top = pos
    showOn = true;

    document.body.addEventListener("click", (e) => {

        // gör om så den försvinner utifrån ex path
        //lägg även till så esc funkar
        if (e.target.localName !== "img") {
            show.innerHTML = "";
            show.classList.remove("showing")
        }
    });

}

function visaBilder() {
    let mainBilder = document.querySelectorAll(".main img");

    for (let bild of mainBilder) {
        bild.addEventListener("click", (e) => {
            const pos = calcPos(e)
            show(e.target.src, pos);
        });
    }
}

const blockqutoeKoll = document.querySelectorAll("blockquote");
for (koll of blockqutoeKoll) {
    koll.addEventListener("click", (e) => {
        const latTitel = e.target.parentElement.children[1].innerText;
        visaText(latTitel)
    });
};

async function visaText(latTitel) {
    latTitel = latTitel.toUpperCase()
    const show = document.querySelector(".main");
    const placeholder = "*MISSING*";

    let titel = placeholder;
    let album = placeholder;
    let text = placeholder;
    let img = "img/album/missingPic160x160.jpg";

    for (texter of helaTexter) {
        if (texter.titel === latTitel) {
            let path = texter.album
            path = path.toLowerCase()
            path = path.replace(/[^\w]+/g, "")

            titel = texter.titel;
            album = texter.album;
            text = texter.text;
            img = `img/album/${path}160x160.jpg`
        }
    };

    show.innerHTML = `<h1>${titel}</h1>
    <h2>${album}</h2>
    <img src="${img}">
    <br>
    ${text}`

    const status = await fetch(`/audio/${titel}.mp3`)
    if (status.status === 200) {
        show.innerHTML = show.innerHTML + `
        <audio controls autoplay muted>
            <source src="/audio/${titel}.mp3" type="audio/mp3">
        </audio>`
    }

}