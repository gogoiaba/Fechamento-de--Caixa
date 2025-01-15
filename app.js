const valorInput = document.getElementById('valor');

valorInput.addEventListener('input', function () {
    let value = this.value.replace(/\D/g, ''); // Remove tudo que não for número
    value = (value / 100).toFixed(2) + ''; // Formata para decimal
    value = value.replace('.', ','); // Substitui ponto por vírgula
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Adiciona pontos separadores de milhar
    this.value = 'R$ ' + value;
});