let aktuellerFahrer = "";
let aktuellesDatum = "";

/* ==========================
   STAMMDATEN
========================== */

const fahrerStammdaten = [
    {
        name: "Müller",
        dienst: "WN01",
        fahrzeug: "W4711"
    },
    {
        name: "Huber",
        dienst: "WN02",
        fahrzeug: "W4723"
    },
    {
        name: "Maier",
        dienst: "A01",
        fahrzeug: "W4718"
    },
    {
        name: "Berger",
        dienst: "WN03",
        fahrzeug: "W4730"
    },
    {
        name: "Schmidt",
        dienst: "Reserve",
        fahrzeug: "W4735"
    }
];

let plan = {};

/* ==========================
   HILFSFUNKTIONEN
========================== */

function getKey(fahrerName, datum) {
    return fahrerName + "_" + datum;
}

function findeStammdaten(name) {

    return fahrerStammdaten.find(function (f) {
        return f.name === name;
    });
}

/* ==========================
   FAHRER
========================== */

function fahrerHinzufuegen() {

    const name = prompt("Fahrername:");

    if (!name) return;

    fahrerStammdaten.push({
        name: name,
        dienst: "",
        fahrzeug: ""
    });

    ladePlan();
}

function fahrerLoeschen(name) {

    if (!confirm(name + " löschen?")) {
        return;
    }

    const index =
        fahrerStammdaten.findIndex(function (f) {
            return f.name === name;
        });

    if (index > -1) {
        fahrerStammdaten.splice(index, 1);
    }

    ladePlan();
}

/* ==========================
   MODAL
========================== */

function artGeaendert() {

    const art =
        document.getElementById("artInput").value;

    const block =
        document.getElementById("dienstBlock");

    if (
        art === "Urlaub" ||
        art === "Krank" ||
        art === "Zeitausgleich" ||
        art === "Frei"
    ) {
        block.style.display = "none";
    }
    else {
        block.style.display = "block";
    }
}

function zelleBearbeiten(name, datum) {

    aktuellerFahrer = name;
    aktuellesDatum = datum;

    const k = getKey(name, datum);

    const stamm =
        findeStammdaten(name);

    if (!plan[k]) {

        plan[k] = {
            art: "Dienst",
            dienst: stamm.dienst,
            fahrzeug: stamm.fahrzeug
        };
    }

    document.getElementById("artInput").value =
        plan[k].art || "Dienst";

    document.getElementById("dienstInput").value =
        plan[k].dienst || "";

    document.getElementById("fahrzeugInput").value =
        plan[k].fahrzeug || "";

    artGeaendert();

    document.getElementById(
        "modalOverlay"
    ).style.display = "flex";
}

function schliessenModal() {

    document.getElementById(
        "modalOverlay"
    ).style.display = "none";
}

function speichernZelle() {

    const art =
        document.getElementById(
            "artInput"
        ).value;

    const dienst =
        document.getElementById(
            "dienstInput"
        ).value;

    const fahrzeug =
        document.getElementById(
            "fahrzeugInput"
        ).value;

    const key =
        getKey(
            aktuellerFahrer,
            aktuellesDatum
        );

    if (art === "Dienst") {

        plan[key] = {
            art: art,
            dienst: dienst,
            fahrzeug: fahrzeug
        };

    } else {

        plan[key] = {
            art: art
        };
    }

    schliessenModal();

    ladePlan();
}

/* ==========================
   OFFENE DIENSTE
========================== */

function offeneDiensteErmitteln() {

    const liste = [];

    for (const key in plan) {

        const eintrag = plan[key];

        if (
            eintrag.art === "Urlaub" ||
            eintrag.art === "Krank" ||
            eintrag.art === "Zeitausgleich"
        ) {

            const fahrerName =
                key.split("_")[0];

            const datum =
                key.split("_")[1];

            const stamm =
                findeStammdaten(
                    fahrerName
                );

            if (stamm) {

                liste.push({
                    datum: datum,
                    dienst: stamm.dienst
                });
            }
        }
    }

    return liste;
}

function offeneDiensteAnzeigen() {

    const container =
        document.getElementById(
            "offeneDienste"
        );

    if (!container) return;

    container.innerHTML = "";

    const liste =
        offeneDiensteErmitteln();

    for (let i = 0; i < liste.length; i++) {

        const datumObj =
            new Date(
                liste[i].datum
            );

        const datumText =
            datumObj.toLocaleDateString(
                "de-DE"
            );

        container.innerHTML +=
            "<div class='offen'>" +
            datumText +
            "<br>" +
            liste[i].dienst +
            "</div>";
    }
}

/* ==========================
   MATRIX
========================== */

function ladePlan() {

    const von =
    new Date(
        document.getElementById("von").value + "T00:00:00"
    );

const bis =
    new Date(
        document.getElementById("bis").value + "T23:59:59"
    );

if (isNaN(von) || isNaN(bis))
        return;

    const tage = [];

    const d =
        new Date(von);

    while (d <= bis) {

        tage.push(
            new Date(d)
        );

        d.setDate(
            d.getDate() + 1
        );
    }

    const thead =
        document.getElementById("thead");

    const tbody =
        document.getElementById("tbody");

    thead.innerHTML = "";
    tbody.innerHTML = "";

    let header =
        "<tr><th class='fahrerkopf'>Fahrer</th>";

    for (let i = 0; i < tage.length; i++) {

        const tag =
            tage[i];

        const wd =
            tag.toLocaleDateString(
                "de-DE",
                { weekday: "short" }
            );

        let headerKlasse = "";

        if (tag.getDay() === 6) {
            headerKlasse = "samstag";
        }

        if (tag.getDay() === 0) {
            headerKlasse = "sonntag";
        }

        header +=
            "<th class='" +
            headerKlasse +
            "'>" +
            wd +
            "<br>" +
            tag.getDate() +
            "</th>";
    }

    header += "</tr>";

    thead.innerHTML = header;

    for (let f = 0; f < fahrerStammdaten.length; f++) {

        const fahrer =
            fahrerStammdaten[f];

        let row =
            "<tr>" +
            "<td class='fahrer'>" +
            fahrer.name +
            "<br>" +
            "<button class='loeschen' onclick=\"fahrerLoeschen('" +
            fahrer.name +
            "')\">🗑 Löschen</button>" +
            "</td>";

        for (let t = 0; t < tage.length; t++) {

            const tag =
                tage[t];

            const datum =
                tag.toISOString().split("T")[0];

            let daten =
                plan[
                    getKey(
                        fahrer.name,
                        datum
                    )
                ];

            if (!daten) {

                daten = {
                    art: "Dienst",
                    dienst: fahrer.dienst,
                    fahrzeug: fahrer.fahrzeug
                };
            }

            let text1 = "";
            let text2 = "";
            let klasse = "";

            if (daten.art === "Urlaub") {

                text1 = "Urlaub";
                klasse = "urlaub";

            } else if (daten.art === "Krank") {

                text1 = "Krank";
                klasse = "krank";

            } else if (daten.art === "Zeitausgleich") {

                text1 = "ZA";
                klasse = "za";

            } else if (daten.art === "Frei") {

                text1 = "Frei";
                klasse = "frei";

            } else {

                text1 = daten.dienst;
                text2 = daten.fahrzeug;
            }

            let tagesKlasse = "";

            if (tag.getDay() === 6) {
                tagesKlasse = "samstag";
            }

            if (tag.getDay() === 0) {
                tagesKlasse = "sonntag";
            }

            row +=
                "<td class='zelle " +
                klasse +
                " " +
                tagesKlasse +
                "' onclick=\"zelleBearbeiten('" +
                fahrer.name +
                "','" +
                datum +
                "')\">" +

                "<div class='dienst'>" +
                text1 +
                "</div>" +

                "<div class='fahrzeug'>" +
                text2 +
                "</div>" +

                "</td>";
        }

        row += "</tr>";

        tbody.innerHTML += row;
    }

    offeneDiensteAnzeigen();
}

/* ==========================
   START
========================== */

window.onload = function () {

    document.getElementById("von").value =
        "2026-10-01";

    document.getElementById("bis").value =
        "2026-10-15";

    ladePlan();
};