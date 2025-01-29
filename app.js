document.addEventListener("DOMContentLoaded", () => {
    const dinheiroInputs = document.querySelectorAll(".input__dinheiro");
    const quantidadeInputs = document.querySelectorAll(".input__quantidade");
    const somaTotalInput = document.querySelector(".input__somatotal");
    const acumuladoresInput = document.querySelector(".input__acumuladores");
    const diferencaInput = document.querySelector(".input__diferenca");

    const valores = [200, 500, 1000, 2000, 5000, 10000, 20000, 5, 10, 25, 50, 100]; // Convertido para centavos

    const formatarParaReais = (valor, negativo = false) => {
        const numero = Math.abs(parseFloat(valor.replace(/[^\d]/g, "")) / 100);
        if (isNaN(numero)) return "R$ 0,00";
        const resultado = numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        return negativo ? `- ${resultado}` : resultado;
    };

    const atualizarQuantidade = (valor, indice) => {
        let valorCentavos = parseInt(valor.replace(/[^\d]/g, ""), 10) || 0;
        if (valorCentavos < 0) valorCentavos = 0;
        quantidadeInputs[indice].value = Math.floor(valorCentavos / valores[indice]);
        atualizarSomaTotal();
        validarValor(valor, indice);
    };

    const atualizarValor = (quantidade, indice) => {
        let quantidadeNumerica = parseInt(quantidade, 10) || 0;
        if (quantidadeNumerica < 0) quantidadeNumerica = 0;
        const valorCalculado = quantidadeNumerica * valores[indice];
        dinheiroInputs[indice].value = formatarParaReais(valorCalculado.toString());
        atualizarSomaTotal();
        validarValor(dinheiroInputs[indice].value, indice);
    };

    const validarValor = (valor, indice) => {
        const valorCentavos = parseInt(valor.replace(/[^\d]/g, ""), 10) || 0;
        const quantidade = parseInt(quantidadeInputs[indice].value, 10) || 0;
        const valorCalculado = quantidade * valores[indice];

        dinheiroInputs[indice].classList.remove("valor-invalido");
        quantidadeInputs[indice].classList.remove("quantidade-invalida");

        if (valorCentavos !== valorCalculado) {
            dinheiroInputs[indice].classList.add("valor-invalido");
            quantidadeInputs[indice].classList.add("quantidade-invalida");
        }
    };

    const atualizarSomaTotal = () => {
        let somaTotalCentavos = 0;

        quantidadeInputs.forEach((input, index) => {
            const quantidade = parseInt(input.value, 10) || 0;
            somaTotalCentavos += quantidade * valores[index];
        });

        somaTotalInput.value = formatarParaReais(somaTotalCentavos.toString());
        atualizarDiferenca();
    };

    const atualizarDiferenca = () => {
        const somaTotalCentavos = parseInt(somaTotalInput.value.replace(/[^\d]/g, ""), 10) || 0;
        const acumuladoresCentavos = parseInt(acumuladoresInput.value.replace(/[^\d]/g, ""), 10) || 0;

        const diferencaCentavos = somaTotalCentavos - acumuladoresCentavos;
        const negativo = diferencaCentavos < 0;
        const positivo = diferencaCentavos > 0;

        diferencaInput.value = formatarParaReais(Math.abs(diferencaCentavos).toString(), negativo);

        diferencaInput.classList.remove("diferenca-negativa", "diferenca-positiva");

        if (negativo) {
            diferencaInput.classList.add("diferenca-negativa");
        } else if (positivo) {
            diferencaInput.classList.add("diferenca-positiva");
        }
    };

    const limparCampos = () => {
        dinheiroInputs.forEach(input => input.value = "R$ 0,00");
        quantidadeInputs.forEach(input => input.value = "0");
        somaTotalInput.value = "R$ 0,00";
        acumuladoresInput.value = "R$ 0,00";
        diferencaInput.value = "R$ 0,00";

        dinheiroInputs.forEach(input => input.classList.remove("valor-invalido"));
        quantidadeInputs.forEach(input => input.classList.remove("quantidade-invalida"));

        diferencaInput.classList.remove("diferenca-negativa", "diferenca-positiva");
    };

    const botaoLimpar = document.getElementById("limpar");
    botaoLimpar.addEventListener("click", () => {
        limparCampos();
    });

    quantidadeInputs.forEach(input => {
        input.addEventListener("focus", () => {
            if (input.value === "0") input.value = "";
        });

        input.addEventListener("blur", () => {
            if (input.value === "") input.value = "0";
        });
    });

    dinheiroInputs.forEach((input, index) => {
        let valorOriginal;

        input.addEventListener("focus", () => {
            valorOriginal = input.value;
            if (input.value === "R$ 0,00") input.value = "";
        });

        input.addEventListener("blur", () => {
            if (input.value === "") input.value = valorOriginal;
        });

        input.addEventListener("input", () => {
            const cursorPos = input.selectionStart;
            const valorSemFormatacao = input.value.replace(/[^\d]/g, "");
            input.value = formatarParaReais(valorSemFormatacao);
            const diferenca = input.value.length - valorSemFormatacao.length;
            input.setSelectionRange(cursorPos + diferenca, cursorPos + diferenca);

            atualizarQuantidade(input.value, index);
        });

        input.addEventListener("blur", () => {
            if (!input.value) input.value = valorOriginal;
        });
    });

    quantidadeInputs.forEach((input, index) => {
        input.addEventListener("input", () => {
            atualizarValor(input.value, index);
        });
    });

    acumuladoresInput.addEventListener("input", () => {
        const cursorPos = acumuladoresInput.selectionStart;
        const valorSemFormatacao = acumuladoresInput.value.replace(/[^\d]/g, "");
        acumuladoresInput.value = formatarParaReais(valorSemFormatacao);
        const diferenca = acumuladoresInput.value.length - valorSemFormatacao.length;
        acumuladoresInput.setSelectionRange(cursorPos + diferenca, cursorPos + diferenca);

        atualizarDiferenca();
    });

    acumuladoresInput.addEventListener("blur", () => {
        if (!acumuladoresInput.value) acumuladoresInput.value = "R$ 0,00";
    });
});
