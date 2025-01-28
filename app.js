document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os inputs de dinheiro
    const dinheiroInputs = document.querySelectorAll(".input__dinheiro");

    // Função para formatar o valor como moeda
    const formatarParaReais = (valor) => {
        const numero = parseFloat(valor.replace(/[^\d]/g, "")) / 100;
        if (isNaN(numero)) return "R$ 0,00";
        return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    // Adiciona o evento input em cada campo de dinheiro
    dinheiroInputs.forEach((input) => {
        input.addEventListener("input", (event) => {
            const cursorPos = input.selectionStart; // Posição do cursor antes da alteração
            const valorSemFormatacao = input.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
            input.value = formatarParaReais(valorSemFormatacao);
            const diferenca = input.value.length - valorSemFormatacao.length; // Ajusta posição do cursor
            input.setSelectionRange(cursorPos + diferenca, cursorPos + diferenca);
        });

        // Formata o valor inicial se necessário
        input.addEventListener("blur", () => {
            if (!input.value) input.value = "R$ 0,00";
        });
    });
});
