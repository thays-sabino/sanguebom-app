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

function CadastroConvocacoes() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/convocacoes`;

    const [idTipoS, setIdTipoS] = useState('');
    const [urgencia, setUrgencia] = useState('');
    const [status, setStatus] = useState('Ativa');
    const [idHemocentro, setIdHemocentro] = useState('');

    const [tipos, setTipos] = useState([]);
    const [hemocentros, setHemocentros] = useState([]);

    const [dados, setDados] = useState(null);

    function preencher(convocacao) {
        setIdTipoS(convocacao.idTipoS != null ? String(convocacao.idTipoS) : '');
        setUrgencia(convocacao.urgencia ?? '');
        setStatus(convocacao.status ?? 'Ativa');
        setIdHemocentro(convocacao.idHemocentro != null ? String(convocacao.idHemocentro) : '');
    }

    function inicializar() {
        if (idParam == null) {
            preencher({});      // cadastro novo: limpa tudo
        } else if (dados) {
            preencher(dados);   // edição: volta aos valores originais
        }
    }

    async function salvar() {
        if (!idTipoS || !urgencia || !status || !idHemocentro) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        const data = {
            idTipoS: Number(idTipoS),
            urgencia,
            status,
            idHemocentro: Number(idHemocentro)
        };

        if (idParam == null) {
            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso('Convocação cadastrada com sucesso!');
                    navigate(`/listagem-convocacoes`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao cadastrar a convocação.'
                    );
                });
        } else {
            // O PUT substitui o registro inteiro, então mantém o id e o que já existia
            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify({ ...dados, ...data }), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso('Convocação atualizada com sucesso!');
                    navigate(`/listagem-convocacoes`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao atualizar a convocação.'
                    );
                });
        }
    }

    async function buscar() {
        if (idParam == null) return;

        await axios.get(`${baseURL}/${idParam}`).then((response) => {
            setDados(response.data);
            preencher(response.data);
        });
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/tipoS`).then((response) => {
            setTipos(response.data);
        });

        axios.get(`${BASE_URL}/hemocentros`).then((response) => {
            setHemocentros(response.data);
        });
    }, []);

    useEffect(() => {
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de convocações */}
            <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-convocacoes')}>
                <ArrowBackIcon />
            </IconButton>            <Card title='Cadastro de Convocação'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Hemocentro: *' htmlFor='inputHemocentro'>
                                <select
                                    id='inputHemocentro'
                                    value={String(idHemocentro)}
                                    className='form-control'
                                    name='idHemocentro'
                                    onChange={(e) =>
                                        setIdHemocentro(e.target.value)
                                    }
                                >
                                    <option value=''>Selecione</option>
                                    {hemocentros.map((hemocentro) => (
                                        <option key={hemocentro.id} value={String(hemocentro.id)}>
                                            {hemocentro.razaoSocial}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Tipo Sanguíneo: *' htmlFor='inputTipoS'>
                                <select
                                    id='inputTipoS'
                                    value={String(idTipoS)}
                                    className='form-control'
                                    name='idTipoS'
                                    onChange={(e) => setIdTipoS(e.target.value)}
                                >
                                    <option value=''>Selecione</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo.id} value={String(tipo.id)}>
                                            {tipo.tipo}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Urgência: *' htmlFor='inputUrgencia'>
                                <select
                                    id='inputUrgencia'
                                    value={urgencia}
                                    className='form-control'
                                    name='urgencia'
                                    onChange={(e) => setUrgencia(e.target.value)}
                                >
                                    <option value=''>Selecione</option>
                                    <option value='Alta'>Alta</option>
                                    <option value='Média'>Média</option>
                                    <option value='Baixa'>Baixa</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Status: *' htmlFor='inputStatus'>
                                <select
                                    id='inputStatus'
                                    value={status}
                                    className='form-control'
                                    name='status'
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value='Ativa'>Ativa</option>
                                    <option value='Finalizada'>Finalizada</option>
                                </select>
                            </FormGroup>
                            <Stack spacing={1} padding={1} direction='row'>
                                <button
                                    onClick={salvar}
                                    type='button'
                                    className='btn btn-success'
                                >
                                    Salvar
                                </button>
                                <button
                                    onClick={inicializar}
                                    type='button'
                                    className='btn btn-danger'
                                >
                                    Cancelar
                                </button>
                            </Stack>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default CadastroConvocacoes;
