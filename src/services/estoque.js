import axios from 'axios';
import { BASE_URL } from '../config/axios';

const estoquesURL = `${BASE_URL}/estoques`;

// Limites de nível de estoque (em ml), por tipo sanguíneo em cada hemocentro.
// Mudando aqui, todas as telas vão acompanhar.
//   Crítico: abaixo de 2.250 ml
//   Alerta:  de 2.250 ml até 6.750 ml
//   Estável: acima de 6.750 ml
export const LIMITE_CRITICO = 2250;
export const LIMITE_ESTAVEL = 6750;

export const NIVEL_CRITICO = 'Crítico';
export const NIVEL_ALERTA = 'Em alerta';
export const NIVEL_ESTAVEL = 'Estável';

export function nivelEstoque(qtdMl) {
  const qtd = Number(qtdMl) || 0;
  if (qtd < LIMITE_CRITICO) return NIVEL_CRITICO;
  if (qtd <= LIMITE_ESTAVEL) return NIVEL_ALERTA;
  return NIVEL_ESTAVEL;
}

// Cor (Bootstrap) do texto do nível: crítico = vermelho, em alerta = amarelo, estável = verde
export function classeTextoNivel(nivel) {
  if (nivel === NIVEL_CRITICO) return 'text-danger';
  if (nivel === NIVEL_ALERTA) return 'text-warning';
  return 'text-success';
}

// Quanto pode sair do estoque sem que ele caia abaixo do nível crítico.
// Se já está crítico (ou no limite), não sobra nada para liberar.
export function maximoLiberavel(qtdMl) {
  return Math.max(0, (Number(qtdMl) || 0) - LIMITE_CRITICO);
}

// Busca a linha de estoque de um tipo sanguíneo em um hemocentro (ou null se não existir)
export async function buscarEstoque(idHemocentro, idTipoS) {
  const response = await axios.get(
    `${estoquesURL}?idHemocentro=${idHemocentro}&idTipoS=${idTipoS}`
  );

  const encontrado = response.data.find(
    (e) =>
      String(e.idHemocentro) === String(idHemocentro) &&
      String(e.idTipoS) === String(idTipoS)
  );

  return encontrado ?? null;
}

// Soma (delta positivo) ou subtrai (delta negativo) ml do estoque.
// O estoque não é criado por aqui: cada hemocentro já tem uma linha por tipo sanguíneo
// (os tipos são fixos). Se a linha não existir, não faz nada.
// Nunca deixa o estoque ficar negativo.
export async function ajustarEstoque(idHemocentro, idTipoS, delta) {
  const valor = Number(delta);
  if (!valor) return;

  const estoque = await buscarEstoque(idHemocentro, idTipoS);
  if (!estoque) return;

  const novaQtd = Math.max(0, Number(estoque.qtdMl) + valor);

  await axios.put(
    `${estoquesURL}/${estoque.id}`,
    JSON.stringify({ ...estoque, qtdMl: novaQtd }),
    { headers: { 'Content-Type': 'application/json' } }
  );
}