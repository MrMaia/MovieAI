// script.js

const apiKey = "e6816bdb33adf13e06533003e116f7a6"; // Substitua com sua chave de API do TMDb

function buscarFilmesAleatorios() {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=a&language=pt-BR`)
        .then(response => response.json())
        .then(data => exibirFilmesAleatorios(data.results))
        .catch(error => console.error('Erro ao buscar filmes:', error));
}

function obterDetalhesFilme(filmeId) {
    return fetch(`https://api.themoviedb.org/3/movie/${filmeId}?api_key=${apiKey}&language=pt-BR`)
        .then(response => response.json());
}

function limitarTexto(texto, limite) {
    if (texto.length > limite) {
        return texto.slice(0, limite) + '...';
    }
    return texto;
}

function converterMinutosParaHoras(minutos) {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    const segundos = 0; // Vamos considerar os segundos como zero

    // Utilizamos a função padStart para garantir que os números tenham dois dígitos
    const horasFormatadas = horas.toString().padStart(2, '0');
    const minutosFormatados = minutosRestantes.toString().padStart(2, '0');
    const segundosFormatados = segundos.toString().padStart(2, '0');

    return `${horasFormatadas}:${minutosFormatados}:${segundosFormatados}`;
}

async function exibirFilmesAleatorios(filmes) {
    const filmesAleatorios = [];

    while (filmesAleatorios.length < 3) {
        const filmeAleatorio = filmes[Math.floor(Math.random() * filmes.length)];
        if (!filmesAleatorios.includes(filmeAleatorio)) {
            filmesAleatorios.push(filmeAleatorio);
        }
    }

    for (let i = 0; i < filmesAleatorios.length; i++) {
        const filme = filmesAleatorios[i];
        const filmeDetalhes = await obterDetalhesFilme(filme.id);

        const filmeDiv = document.getElementsByClassName('movie' + (i + 1))[0];
        filmeDiv.querySelector('h2').innerText = limitarTexto(filmeDetalhes.title, 20);

        // Utilizamos o toFixed() para limitar a nota a duas casas decimais
        const notaFormatada = filmeDetalhes.vote_average.toFixed(2);
        filmeDiv.querySelector('#nota' + (i + 1)).innerText = notaFormatada;

        const duracaoElement = filmeDiv.querySelector('#duracao' + (i + 1));
        const duracaoEmMinutos = filmeDetalhes.runtime;
        const duracaoFormatada = duracaoEmMinutos ? converterMinutosParaHoras(duracaoEmMinutos) : 'Duração indisponível';
        duracaoElement.innerText = duracaoFormatada;

        filmeDiv.querySelector('#ano' + (i + 1)).innerText = filmeDetalhes.release_date ? filmeDetalhes.release_date.slice(0, 4) : 'Ano indisponível';
        filmeDiv.querySelector('.bannerfilme img').src = 'https://image.tmdb.org/t/p/w500' + filmeDetalhes.poster_path;
    }
}

document.getElementById('botaoGerar').addEventListener('click', () => {
    buscarFilmesAleatorios();
});

// Carregar filmes aleatórios ao carregar a página
buscarFilmesAleatorios();