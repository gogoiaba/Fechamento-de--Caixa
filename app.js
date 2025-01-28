// Seleciona todos os inputs de dinheiro
const inputsDinheiro = document.querySelectorAll('.input__dinheiro');

// Aplica a formatação em cada input
inputsDinheiro.forEach(input => {
    input.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, ''); // Remove tudo que não for número
        value = (value / 100).toFixed(2); // Divide por 100 e fixa 2 casas decimais
        value = value.replace('.', ','); // Substitui ponto por vírgula
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos como separador de milhar
        this.value = `R$ ${value}`;
    });
});
