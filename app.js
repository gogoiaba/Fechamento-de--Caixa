document.addEventListener("DOMContentLoaded", () => {
    // Seleciona todos os inputs de dinheiro, quantidade, soma total, acumuladores e diferença
    const dinheiroInputs = document.querySelectorAll(".input__dinheiro");
    const quantidadeInputs = document.querySelectorAll(".input__quantidade");
    const somaTotalInput = document.querySelector(".input__somatotal");
    const acumuladoresInput = document.querySelector(".input__acumuladores");
    const diferencaInput = document.querySelector(".input__diferenca");

    // Mapeia os valores correspondentes às cédulas e moedas (em centavos)
    const valores = [200, 500, 1000, 2000, 5000, 10000, 20000, 5, 10, 25, 50, 100]; // Convertido para centavos

    // Função para formatar o valor como moeda
    const formatarParaReais = (valor, negativo = false) => {
        const numero = Math.abs(parseFloat(valor.replace(/[^\d]/g, "")) / 100);
        if (isNaN(numero)) return "R$ 0,00";
        const resultado = numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        return negativo ? `- ${resultado}` : resultado;
    };

    // Atualiza a quantidade com base no valor
    const atualizarQuantidade = (valor, indice) => {
        const valorCentavos = parseInt(valor.replace(/[^\d]/g, ""), 10) || 0; // Valor em centavos
        quantidadeInputs[indice].value = Math.floor(valorCentavos / valores[indice]); // Calcula a quantidade
        atualizarSomaTotal(); // Atualiza a soma total
    };

    // Atualiza o valor com base na quantidade
    const atualizarValor = (quantidade, indice) => {
        const quantidadeNumerica = parseInt(quantidade, 10) || 0; // Quantidade como inteiro
        const valorCalculado = quantidadeNumerica * valores[indice]; // Valor total em centavos
        dinheiroInputs[indice].value = formatarParaReais(valorCalculado.toString()); // Formata o valor
        atualizarSomaTotal(); // Atualiza a soma total
    };

    // Atualiza a soma total
    const atualizarSomaTotal = () => {
        let somaTotalCentavos = 0;

        // Percorre todas as quantidades e valores
        quantidadeInputs.forEach((input, index) => {
            const quantidade = parseInt(input.value, 10) || 0;
            somaTotalCentavos += quantidade * valores[index]; // Soma os valores em centavos
        });

        // Atualiza o campo de soma total
        somaTotalInput.value = formatarParaReais(somaTotalCentavos.toString());
        atualizarDiferenca(); // Atualiza a diferença
    };

    // Atualiza a diferença entre soma total e acumuladores
    const atualizarDiferenca = () => {
        const somaTotalCentavos = parseInt(somaTotalInput.value.replace(/[^\d]/g, ""), 10) || 0; // Soma Total em centavos
        const acumuladoresCentavos = parseInt(acumuladoresInput.value.replace(/[^\d]/g, ""), 10) || 0; // Saldo contábil em centavos

        const diferencaCentavos = somaTotalCentavos - acumuladoresCentavos; // Calcula a diferença
        const negativo = diferencaCentavos < 0; // Verifica se é negativo
        diferencaInput.value = formatarParaReais(Math.abs(diferencaCentavos).toString(), negativo); // Atualiza o campo de diferença
    };

    // Adiciona evento para atualizar a quantidade ao digitar o valor
    dinheiroInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            const cursorPos = input.selectionStart; // Posição do cursor antes da alteração
            const valorSemFormatacao = input.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
            input.value = formatarParaReais(valorSemFormatacao);
            const diferenca = input.value.length - valorSemFormatacao.length; // Ajusta posição do cursor
            input.setSelectionRange(cursorPos + diferenca, cursorPos + diferenca);

            atualizarQuantidade(input.value, index);
        });

        // Formata o valor inicial se necessário
        input.addEventListener("blur", () => {
            if (!input.value) input.value = "R$ 0,00";
        });
    });

    // Adiciona evento para atualizar o valor ao digitar a quantidade
    quantidadeInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            atualizarValor(input.value, index);
        });
    });

    // Adiciona evento para atualizar a diferença ao digitar o acumulador
    acumuladoresInput.addEventListener("input", () => {
        const cursorPos = acumuladoresInput.selectionStart; // Posição do cursor antes da alteração
        const valorSemFormatacao = acumuladoresInput.value.replace(/[^\d]/g, ""); // Remove caracteres não numéricos
        acumuladoresInput.value = formatarParaReais(valorSemFormatacao);
        const diferenca = acumuladoresInput.value.length - valorSemFormatacao.length; // Ajusta posição do cursor
        acumuladoresInput.setSelectionRange(cursorPos + diferenca, cursorPos + diferenca);

        atualizarDiferenca(); // Atualiza a diferença
    });

    // Formata o acumulador inicial se necessário
    acumuladoresInput.addEventListener("blur", () => {
        if (!acumuladoresInput.value) acumuladoresInput.value = "R$ 0,00";
    });
});
