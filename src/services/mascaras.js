// Funções de máscara e validação de CPF, CNPJ e telefone.
//
// Padrão do sistema: o db.json guarda SÓ OS NÚMEROS (ex.: "12345678901")
// e a máscara é aplicada apenas na hora de mostrar (campos e listagens).

// Remove tudo que não for número
export function somenteNumeros(valor) {
    return String(valor ?? '').replace(/\D/g, '');
}

// 12345678901 -> 123.456.789-01 (vai formatando enquanto digita)
export function mascararCpf(valor) {
    const d = somenteNumeros(valor).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// 12345678000199 -> 12.345.678/0001-99 (vai formatando enquanto digita)
export function mascararCnpj(valor) {
    const d = somenteNumeros(valor).slice(0, 14);
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

// Celular (terceiro dígito 9): 32912345678 -> (32) 9 1234-5678  (11 dígitos)
// Fixo:                        3212345678  -> (32) 1234-5678    (10 dígitos)
export function limitarTelefone(valor) {
    const d = somenteNumeros(valor);
    const max = d[2] === '9' ? 11 : 10;
    return d.slice(0, max);
}

export function mascararTelefone(valor) {
    const d = limitarTelefone(valor);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;

    const ddd = d.slice(0, 2);
    const resto = d.slice(2);

    if (resto[0] === '9') {
        if (resto.length <= 1) return `(${ddd}) ${resto}`;
        if (resto.length <= 5) return `(${ddd}) ${resto[0]} ${resto.slice(1)}`;
        return `(${ddd}) ${resto[0]} ${resto.slice(1, 5)}-${resto.slice(5)}`;
    }

    if (resto.length <= 4) return `(${ddd}) ${resto}`;
    return `(${ddd}) ${resto.slice(0, 4)}-${resto.slice(4)}`;
}

// Validações (usadas antes de salvar)
export function cpfCompleto(valor) {
    return somenteNumeros(valor).length === 11;
}

export function cnpjCompleto(valor) {
    return somenteNumeros(valor).length === 14;
}

export function telefoneCompleto(valor) {
    const d = somenteNumeros(valor);
    return d.length === (d[2] === '9' ? 11 : 10);
}

// Para as listagens: só aplica a máscara se o valor tiver o tamanho certo;
// caso contrário mostra o valor como está (ex.: dados antigos/incompletos).
export function exibirCpf(valor) {
    return cpfCompleto(valor) ? mascararCpf(valor) : valor ?? '';
}

export function exibirCnpj(valor) {
    return cnpjCompleto(valor) ? mascararCnpj(valor) : valor ?? '';
}

export function exibirTelefone(valor) {
    return telefoneCompleto(valor) ? mascararTelefone(valor) : valor ?? '';
}

// Limitadores: o campo guarda só os números, já cortados no tamanho máximo
export function limitarCpf(valor) {
    return somenteNumeros(valor).slice(0, 11);
}

export function limitarCnpj(valor) {
    return somenteNumeros(valor).slice(0, 14);
}

export function limitarCep(valor) {
    return somenteNumeros(valor).slice(0, 8);
}

// 36015370 -> 36015-370 (vai formatando enquanto digita)
export function mascararCep(valor) {
    const d = limitarCep(valor);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export function cepCompleto(valor) {
    return somenteNumeros(valor).length === 8;
}

export function exibirCep(valor) {
    return cepCompleto(valor) ? mascararCep(valor) : valor ?? '';
}