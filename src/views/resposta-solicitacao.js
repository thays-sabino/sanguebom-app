import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';
import {
    buscarEstoque,
    ajustarEstoque,
    maximoLiberavel,
    nivelEstoque,
    LIMITE_CRITICO,
} from '../services/estoque';

const ACEITA = 'Aceita';
const PARCIAL = 'Parcial';
const RECUSADA = 'Recusada';

// Data de hoje no formato do db.json (dd/mm/aaaa)
function hojeBR() {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${hoje.getFullYear()}`;
}

// A rota recebe o id da solicitação que o hemocentro vai responder
function RespostaSolicitacao() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const solicitacaoURL = `${BASE_URL}/solicitacoes/${idParam}`;
    const respostasURL = `${BASE_URL}/respostaSolicitacao`;

    const [solicitacao, setSolicitacao] = useState(null);
    const [respostaExistente, setRespostaExistente] = useState(null);
    const [tipos, setTipos] = useState([]);
    const [hemocentros, setHemocentros] = useState([]);
    const [instituicoes, setInstituicoes] = useState([]);
    const [estoques, setEstoques] = useState([]);

    const [decisao, setDecisao] = useState('');
    const [qtdLiberada, setQtdLiberada] = useState('');

    // Se já existe resposta, a tela fica só para consulta
    const travada = respostaExistente != null;

    function nomeDe(lista, id, campo) {
        const item = lista.find((i) => String(i.id) === String(id));
        return item ? item[campo] : '';
    }

    // Estoque do tipo pedido no hemocentro que recebeu a solicitação
    const estoque = solicitacao
        ? estoques.find(
            (e) =>
                String(e.idHemocentro) === String(solicitacao.idHemocentro) &&
                String(e.idTipoS) === String(solicitacao.idTipoS)
        )
        : null;
    const disponivel = estoque ? Number(estoque.qtdMl) : 0;

    // Regra do hemocentro: a liberação não pode deixar o estoque abaixo do nível crítico
    const maximo = maximoLiberavel(disponivel);
    const aceitaTotal = solicitacao
        ? Number(solicitacao.qtdSolicitada) <= maximo
        : false;

    // Cancelar só limpa a resposta que estava sendo preenchida
    function limpar() {
        setDecisao('');
        setQtdLiberada('');
    }

    function mudarDecisao(valor) {
        setDecisao(valor);

        if (valor === ACEITA) {
            setQtdLiberada(String(solicitacao.qtdSolicitada));
        } else if (valor === PARCIAL) {
            setQtdLiberada('');
        } else {
            setQtdLiberada('0');
        }
    }

    async function salvar() {
        if (!decisao) {
            mensagemAlert('Escolha a resposta do hemocentro.');
            return;
        }

        // Confere o estoque atual no servidor (ele pode ter mudado desde que a tela abriu)
        let disponivel = 0;
        try {
            const atual = await buscarEstoque(
                solicitacao.idHemocentro,
                solicitacao.idTipoS
            );
            disponivel = atual ? Number(atual.qtdMl) : 0;
        } catch (error) {
            mensagemErro('Não foi possível conferir o estoque. Tente novamente.');
            return;
        }

        const solicitada = Number(solicitacao.qtdSolicitada);
        let liberada = 0;

        // O que pode sair sem deixar o estoque do tipo abaixo do nível crítico
        const maximoAtual = maximoLiberavel(disponivel);

        if (decisao === ACEITA) {
            liberada = solicitada;
            if (liberada > maximoAtual) {
                mensagemAlert(
                    maximoAtual > 0
                        ? `Não é possível aceitar totalmente: o estoque ficaria crítico. Libere no máximo ${maximoAtual} ml (aceitação parcial).`
                        : `Estoque em nível crítico (${disponivel} ml, mínimo ${LIMITE_CRITICO} ml). Não há quantidade a liberar.`
                );
                return;
            }
        } else if (decisao === PARCIAL) {
            liberada = Number(qtdLiberada);
            if (!qtdLiberada || liberada <= 0 || liberada >= solicitada) {
                mensagemAlert(
                    'Na aceitação parcial, informe uma quantidade maior que 0 e menor que a solicitada.'
                );
                return;
            }
            if (liberada > maximoAtual) {
                mensagemAlert(
                    maximoAtual > 0
                        ? `Quantidade acima do permitido. Para manter o estoque fora do nível crítico, libere no máximo ${maximoAtual} ml.`
                        : `Estoque em nível crítico (${disponivel} ml, mínimo ${LIMITE_CRITICO} ml). Não há quantidade a liberar.`
                );
                return;
            }
        }

        const resposta = {
            idSolicitacao: Number(idParam),
            qtdLiberada: liberada,
            dtLiberacao: hojeBR(),
            status: decisao,
        };

        try {
            await axios.post(respostasURL, JSON.stringify(resposta), {
                headers: { 'Content-Type': 'application/json' },
            });

            // O PUT substitui o registro inteiro, então mantém os campos que já existiam
            await axios.put(
                solicitacaoURL,
                JSON.stringify({ ...solicitacao, status: decisao }),
                { headers: { 'Content-Type': 'application/json' } }
            );

            // Desconta do estoque do hemocentro os ml liberados (recusa não mexe no estoque)
            if (liberada > 0) {
                await ajustarEstoque(
                    solicitacao.idHemocentro,
                    solicitacao.idTipoS,
                    -liberada
                );
            }

            mensagemSucesso('Resposta registrada com sucesso!');
            navigate(`/listagem-solicitacoes`);
        } catch (error) {
            mensagemErro(
                typeof error.response?.data === 'string' && error.response.data
                    ? error.response.data
                    : 'Erro ao registrar a resposta.'
            );
        }
    }

    async function carregar() {
        try {
            const [sol, tp, hem, inst, est, resp] = await Promise.all([
                axios.get(solicitacaoURL),
                axios.get(`${BASE_URL}/tipoS`),
                axios.get(`${BASE_URL}/hemocentros`),
                axios.get(`${BASE_URL}/instituicoes`),
                axios.get(`${BASE_URL}/estoques`),
                axios.get(`${respostasURL}?idSolicitacao=${idParam}`),
            ]);

            setSolicitacao(sol.data);
            setTipos(tp.data);
            setHemocentros(hem.data);
            setInstituicoes(inst.data);
            setEstoques(est.data);

            if (resp.data.length > 0) {
                const existente = resp.data[0];
                setRespostaExistente(existente);
                setDecisao(existente.status);
                setQtdLiberada(String(existente.qtdLiberada));
            }
        } catch (error) {
            mensagemErro('Erro ao carregar a solicitação.');
            navigate(`/listagem-solicitacoes`);
        }
    }

    useEffect(() => {
        carregar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    if (!solicitacao) {
        return (
            <div className='container tema-principal'>
                <Card title='Resposta à Solicitação'>
                    <p>Carregando...</p>
                </Card>
            </div>
        );
    }

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de solicitações */}
            <IconButton
                aria-label='Voltar'
                onClick={() => navigate('/listagem-solicitacoes')}
            >
                <ArrowBackIcon />
            </IconButton>
            <Card title='Resposta à Solicitação'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <FormGroup label='Instituição:' htmlFor='inputInstituicao'>
                                        <input
                                            type='text'
                                            id='inputInstituicao'
                                            value={nomeDe(instituicoes, solicitacao.idInstituicao, 'razaoSocial')}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup label='Hemocentro:' htmlFor='inputHemocentro'>
                                        <input
                                            type='text'
                                            id='inputHemocentro'
                                            value={nomeDe(hemocentros, solicitacao.idHemocentro, 'razaoSocial')}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-3'>
                                    <FormGroup label='Tipo Sanguíneo:' htmlFor='inputTipoS'>
                                        <input
                                            type='text'
                                            id='inputTipoS'
                                            value={nomeDe(tipos, solicitacao.idTipoS, 'tipo')}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-md-3'>
                                    <FormGroup label='Urgência:' htmlFor='inputUrgencia'>
                                        <input
                                            type='text'
                                            id='inputUrgencia'
                                            value={solicitacao.urgencia}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-md-3'>
                                    <FormGroup label='Solicitado (ml):' htmlFor='inputSolicitado'>
                                        <input
                                            type='text'
                                            id='inputSolicitado'
                                            value={solicitacao.qtdSolicitada}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-md-3'>
                                    <FormGroup label='Estoque atual (ml):' htmlFor='inputDisponivel'>
                                        <input
                                            type='text'
                                            id='inputDisponivel'
                                            value={disponivel}
                                            className='form-control'
                                            disabled
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            {!travada && (
                                <div
                                    className={`alert ${maximo <= 0
                                        ? 'alert-danger'
                                        : aceitaTotal
                                            ? 'alert-success'
                                            : 'alert-warning'
                                        }`}
                                    role='alert'
                                >
                                    <strong>Nível atual do estoque: {nivelEstoque(disponivel)}.</strong>{' '}
                                    {maximo <= 0
                                        ? `Não há quantidade a liberar sem deixar o estoque abaixo do mínimo de ${LIMITE_CRITICO} ml. Só é possível recusar.`
                                        : aceitaTotal
                                            ? `É possível liberar até ${maximo} ml sem deixar o estoque crítico.`
                                            : `A quantidade solicitada (${solicitacao.qtdSolicitada} ml) deixaria o estoque crítico. Só é possível aceitar parcialmente, até ${maximo} ml.`}
                                </div>
                            )}

                            <hr className='my-4' />
                            <h5 className='secao-titulo'>Resposta do Hemocentro</h5>

                            <div className='row'>
                                <div className='col-md-6'>
                                    <FormGroup label='Resposta: *' htmlFor='inputDecisao'>
                                        <select
                                            id='inputDecisao'
                                            value={decisao}
                                            className='form-control'
                                            name='decisao'
                                            disabled={travada}
                                            onChange={(e) => mudarDecisao(e.target.value)}
                                        >
                                            <option value=''>Selecione</option>
                                            <option value={ACEITA} disabled={!travada && !aceitaTotal}>
                                                Aceitar totalmente
                                            </option>
                                            <option value={PARCIAL} disabled={!travada && maximo <= 0}>
                                                Aceitar parcialmente
                                            </option>
                                            <option value={RECUSADA}>Recusar</option>
                                        </select>
                                    </FormGroup>
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup label='Quantidade liberada (ml):' htmlFor='inputQtdLiberada'>
                                        <input
                                            type='number'
                                            min='0'
                                            id='inputQtdLiberada'
                                            value={qtdLiberada}
                                            placeholder={
                                                decisao === PARCIAL
                                                    ? `Informe até ${maximo} ml`
                                                    : ''
                                            }
                                            className='form-control'
                                            name='qtdLiberada'
                                            disabled={travada || decisao !== PARCIAL}
                                            onChange={(e) => setQtdLiberada(e.target.value)}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            {travada && (
                                <p className='text-muted'>
                                    Resposta registrada em {respostaExistente.dtLiberacao}. Ela
                                    não pode mais ser alterada.
                                </p>
                            )}

                            {/* Resposta já registrada: tela só de consulta, sem botões */}
                            {!travada && (
                                <Stack spacing={1} padding={1} direction='row'>
                                    <button
                                        onClick={salvar}
                                        type='button'
                                        className='btn btn-success'
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        onClick={limpar}
                                        type='button'
                                        className='btn btn-danger'
                                    >
                                        Cancelar
                                    </button>
                                </Stack>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default RespostaSolicitacao;