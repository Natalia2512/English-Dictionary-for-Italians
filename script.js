const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultContainer = document.getElementById('result-container');
const wordTitle = document.getElementById('wordTitle');
const wordDescription = document.getElementById('wordDescription');
const audioButton = document.getElementById('audioButton');


searchButton.addEventListener("click",()=>{
    search();
});

searchInput.addEventListener("keyup",(event)=>{
    
    if(event.key === "Enter"){
        search();
    }
});

function search(){

    const searchTerm = searchInput.value.trim();
    if(searchTerm === ''){
        alert('Please Enter a word to Search..')
        return;
    }

    fetchDictionaryData(searchTerm);

}

const partOfSpeechTranslations = {
    noun: 'sostantivo',
    verb: 'verbo',
    adjective: 'aggettivo',
    adverb: 'avverbio',
    pronoun: 'pronome',
    preposition: 'preposizione',
    conjunction: 'congiunzione',
    interjection: 'interiezione',
    determiner: 'determinante'
};

async function translateText(text, targetLang = 'it') {
    try {
        const response = await fetch('https://translation.googleapis.com/language/translate/v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                format: 'text',
                key: 'LA_TUA_CHIAVE_API'
            })
        });

        const data = await response.json();
        return data.data.translations[0].translatedText;
    } catch (error) {
        console.error('Errore durante la traduzione:', error);
        return text; // Fallback alla definizione originale
    }
}

async function fetchDictionaryData(searchTerm) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
        if (!response.ok) {
            throw new Error('Impossibile recuperare i dati');
        }

        const data = await response.json();
        displayResult(data);

    } catch (error) {
        console.log(error);
        alert('Si è verificato un errore.');
    }
}



async function displayResult(data) {
    resultContainer.style.display = 'block';

    const wordData = data[0];
    wordTitle.textContent = wordData.word;

    let meaningsHTML = '';

    for (const meaning of wordData.meanings) {
        const translatedDefinition = await translateText(meaning.definitions[0].definition);

        meaningsHTML += `
            <li>
                <p class="part-of-speech"><strong>Parte del discorso:</strong> ${partOfSpeechTranslations[meaning.partOfSpeech] || meaning.partOfSpeech}</p>
                <p class="definition"><strong>Definizione:</strong> ${translatedDefinition}</p>
                ${meaning.definitions[0].example ? `<p class="example"><strong>Esempio:</strong> ${meaning.definitions[0].example}</p>` : ''}
            </li>
        `;
    }

    wordDescription.innerHTML = `<ul>${meaningsHTML}</ul>`;
}




audioButton.addEventListener("click",()=>{

    const searchTerm = searchInput.value.trim();
    if(searchTerm === ''){
        alert('Please Enter a word to Search..')
        return;
    }

    speak(searchTerm);

});


function speak(word){

    const speech = new SpeechSynthesisUtterance(word);
    speech.lang = 'en-US';
    speech.volume = 2;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);

}