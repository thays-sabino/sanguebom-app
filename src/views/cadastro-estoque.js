import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroEstoques() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/estoques`;

    const [tipoS, setTipoS] = useState('');
    const [qtdMl, setQtdMl] = useState('');
    const [idHemocentro, setIdHemocentro] = useState('');

    const [tipos, setTipos] = useState([]);
    const [hemocentros, setHemocentros] = useState([]);

    const [dados, setDados] = useState(null);

    function preencher(estoque) {
        setTipoS(estoque.tipoS ?? '');
        setQtdMl(estoque.qtdMl ?? '');
        setIdHemocentro(estoque.idHemocentro ?? '');
    }

    function inicializar() {
        const estaVazio = !tipoS && !qtdMl && !idHemocentro; // Verifica se os campos estão vazios

        if(estaVazio){ // Se esta vazio volta para a pagina anterior
            navigate(-1);
            return;
        }
        
        if (idParam == null) {
            preencher({});
        } else if (dados) {
            preencher(dados);
        }
    }

    async function salvar() {
        if (!tipoS || qtdMl === '' || !idHemocentro) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        const data = { tipoS, qtdMl, idHemocentro };

        if (idParam == null) {
            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso('Estoque cadastrado com sucesso!');
                    navigate(`/listagem-estoques`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao cadastrar o estoque.'
                    );
                });
        } else {
            // O PUT substitui o registro inteiro, então mantém o id e o que já existia
            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify({ ...dados, ...data }), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso('Estoque atualizado com sucesso!');
                    navigate(`/listagem-estoques`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao atualizar o estoque.'
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
        <div className='container'>
            <Card title='Cadastro de Estoque'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Tipo Sanguíneo: *' htmlFor='inputTipoS'>
                                <select
                                    id='inputTipoS'
                                    value={tipoS}
                                    className='form-control'
                                    name='tipoS'
                                    onChange={(e) => setTipoS(e.target.value)}
                                >
                                    <option value=''>Selecione</option>
                                    {tipos.map((tipo) => (
                                        <option key={tipo.id} value={tipo.tipo}>
                                            {tipo.tipo}
                                        </option>
                                    ))}
                                </select>
                            </FormGroup>
                            <FormGroup label='Quantidade (ml): *' htmlFor='inputQtdMl'>
                                <input
                                    type='number'
                                    min='0'
                                    id='inputQtdMl'
                                    value={qtdMl}
                                    className='form-control'
                                    name='qtdMl'
                                    onChange={(e) => setQtdMl(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Hemocentro: *' htmlFor='inputHemocentro'>
                                <select
                                    id='inputHemocentro'
                                    value={idHemocentro}
                                    className='form-control'
                                    name='idHemocentro'
                                    onChange={(e) =>
                                        setIdHemocentro(
                                            e.target.value === '' ? '' : Number(e.target.value)
                                        )
                                    }
                                >
                                    <option value=''>Selecione</option>
                                    {hemocentros.map((hemocentro) => (
                                        <option key={hemocentro.id} value={hemocentro.id}>
                                            {hemocentro.nome}
                                        </option>
                                    ))}
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

export default CadastroEstoques;
