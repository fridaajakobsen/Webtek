// page 2
document.addEventListener('DOMContentLoaded', function () {
    let innleggContainer = document.getElementById('innlegg-container');
    let gjeldendeSideNummer = 1;
    const antallInnleggPerSide = 9; 
    let erLasterInn = false; 

    function hentInnlegg() {
        if (erLasterInn) return; 

        erLasterInn = true; 
        fetch(`https://jsonplaceholder.typicode.com/posts?_page=${gjeldendeSideNummer}&_limit=${antallInnleggPerSide}`)
            .then(response => response.json())
            .then(innleggListe => {    
                innleggListe.forEach(innlegg => {
                    let innleggElement = document.createElement('div');
                    innleggElement.classList.add('innlegg');
                    innleggElement.innerHTML = `
                        <h3>${innlegg.title}</h3>
                        <p>${innlegg.body}</p>
                    `;
                    innleggContainer.appendChild(innleggElement);
                });
                gjeldendeSideNummer++; 
                erLasterInn = false; 
            })
            .catch(feil => {
                console.error('Feil ved henting av innlegg:', feil);
                erLasterInn = false; 
            });
    }
    
    hentInnlegg();

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 10)) {
            hentInnlegg(); 
        }
    });
});

// page 3
document.addEventListener('DOMContentLoaded', function () {
    const værContainer = document.getElementById('vær-container');
    const stederMedVærdata = [
        { navn: 'Tokyo, Japan', breddegrad: 35.6895, lengdegrad: 139.6917 },
        { navn: 'New York, USA', breddegrad: 40.7128, lengdegrad: -74.0060 },
        { navn: 'London, UK', breddegrad: 51.5074, lengdegrad: -0.1278 },
        { navn: 'Sydney, Australia', breddegrad: -33.8688, lengdegrad: 151.2093 },
        { navn: 'Oslo, Norge', breddegrad: 59.9139, lengdegrad: 10.7522 }
    ];

    function hentVærdata(sted) {
        const { navn, breddegrad, lengdegrad } = sted;
        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${breddegrad}&longitude=${lengdegrad}&current_weather=true`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const vær = data.current_weather;
                let værBoks = document.getElementById(`vær-${navn.replace(/ /g, '-')}`);
                            
                if (!værBoks) {
                    værBoks = document.createElement('div');
                    værBoks.classList.add('vær-boks');
                    værBoks.id = `vær-${navn.replace(/ /g, '-')}`;
                    værContainer.appendChild(værBoks);
                }
           
                værBoks.innerHTML = `
                    <h3>${navn}</h3>
                    <p>Temperatur: ${vær.temperature} °C</p>
                    <p>Vindhastighet: ${vær.windspeed} km/t</p>
                    <p>Tilstand: ${vær.weathercode}</p>
                `;
            })
            .catch(feil => console.error('Feil ved henting av værdata:', feil));
    }

    function oppdaterVærdata() {
        stederMedVærdata.forEach(sted => {
            hentVærdata(sted);
        });
    }

    oppdaterVærdata();

    setInterval(oppdaterVærdata, 10000); 
});
