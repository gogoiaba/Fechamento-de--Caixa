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

    const atualizarQuantidade = (valor, indice) => {
        let valorCentavos = parseInt(valor.replace(/[^\d]/g, ""), 10) || 0; // Valor em centavos
        if (valorCentavos < 0) valorCentavos = 0; // Impede valores negativos
        quantidadeInputs[indice].value = Math.floor(valorCentavos / valores[indice]); // Calcula a quantidade
        atualizarSomaTotal(); // Atualiza a soma total
        validarValor(valor, indice); // Valida o valor
    };
    
    const atualizarValor = (quantidade, indice) => {
        let quantidadeNumerica = parseInt(quantidade, 10) || 0; // Quantidade como inteiro
        if (quantidadeNumerica < 0) quantidadeNumerica = 0; // Impede valores negativos
        const valorCalculado = quantidadeNumerica * valores[indice]; // Valor total em centavos
        dinheiroInputs[indice].value = formatarParaReais(valorCalculado.toString()); // Formata o valor
        atualizarSomaTotal(); // Atualiza a soma total
        validarValor(dinheiroInputs[indice].value, indice); // Valida o valor
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

    const atualizarDiferenca = () => {
        const somaTotalCentavos = parseInt(somaTotalInput.value.replace(/[^\d]/g, ""), 10) || 0; // Soma Total em centavos
        const acumuladoresCentavos = parseInt(acumuladoresInput.value.replace(/[^\d]/g, ""), 10) || 0; // Saldo contábil em centavos
    
        const diferencaCentavos = somaTotalCentavos - acumuladoresCentavos; // Calcula a diferença
        const negativo = diferencaCentavos < 0; // Verifica se é negativo
        const positivo = diferencaCentavos > 0; // Verifica se é positivo
    
        diferencaInput.value = formatarParaReais(Math.abs(diferencaCentavos).toString(), negativo); // Atualiza o campo de diferença
    
        // Remove todas as classes de cor
        diferencaInput.classList.remove("diferenca-negativa", "diferenca-positiva");
    
        // Aplica a classe CSS apropriada
        if (negativo) {
            diferencaInput.classList.add("diferenca-negativa");
        } else if (positivo) {
            diferencaInput.classList.add("diferenca-positiva");
        }
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

    const validarValor = (valor, indice) => {
        const valorCentavos = parseInt(valor.replace(/[^\d]/g, ""), 10) || 0; // Valor em centavos
        const quantidade = parseInt(quantidadeInputs[indice].value, 10) || 0; // Quantidade
        const valorCalculado = quantidade * valores[indice]; // Valor total calculado em centavos
    
        // Remove as classes de invalidez antes de qualquer coisa
        dinheiroInputs[indice].classList.remove("valor-invalido");
        quantidadeInputs[indice].classList.remove("quantidade-invalida");
    
        // Verifica se o valor é possível com a quantidade
        if (valorCentavos !== valorCalculado) {
            dinheiroInputs[indice].classList.add("valor-invalido");
            quantidadeInputs[indice].classList.add("quantidade-invalida");
        }
    };
    
    const limparCampos = () => {
        dinheiroInputs.forEach(input => input.value = "R$ 0,00");
        quantidadeInputs.forEach(input => input.value = "0");
        somaTotalInput.value = "R$ 0,00";
        acumuladoresInput.value = "R$ 0,00";
        diferencaInput.value = "R$ 0,00";

        // Remove as classes de invalidez se houver
        dinheiroInputs.forEach(input => input.classList.remove("valor-invalido"));
        quantidadeInputs.forEach(input => input.classList.remove("quantidade-invalida"));
    };

    // Adiciona evento ao botão "Limpar"
    const botaoLimpar = document.getElementById("limpar");
    botaoLimpar.addEventListener("click", () => {
        limparCampos();
    });

    quantidadeInputs.forEach(input => {
        input.addEventListener("focus", () => {
            if (input.value === "0") input.value = ""; // Limpa se o valor for o placeholder inicial
        });

        input.addEventListener("blur", () => {
            if (input.value === "") input.value = "0"; // Reverte ao placeholder inicial se vazio
        });
    });
});
