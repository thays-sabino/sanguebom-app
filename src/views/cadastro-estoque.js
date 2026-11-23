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

function CadastroEstoques() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/estoques`;

    const [idTipoS, setIdTipoS] = useState('');
    const [qtdMl, setQtdMl] = useState('');
    const [idHemocentro, setIdHemocentro] = useState('');

    const [tipos, setTipos] = useState([]);
    const [hemocentros, setHemocentros] = useState([]);

    const [dados, setDados] = useState(null);

    function preencher(estoque) {
        setIdTipoS(estoque.idTipoS != null ? String(estoque.idTipoS) : '');
        setQtdMl(estoque.qtdMl ?? '');
        setIdHemocentro(estoque.idHemocentro != null ? String(estoque.idHemocentro) : '');
    }

    function inicializar() {
        // Volta ao último valor salvo
        if (dados) {
            preencher(dados);
        }
    }

    // O estoque não é cadastrado nem excluído: cada hemocentro tem uma linha por tipo
    // sanguíneo (os tipos são fixos), e aqui só se altera a quantidade.
    async function salvar() {
        if (qtdMl === '') {
            mensagemAlert('Informe a quantidade em ml.');
            return;
        }

        if (!dados) return;

        // O PUT substitui o registro inteiro, então mantém o id, o hemocentro e o tipo
        await axios
            .put(`${baseURL}/${idParam}`, JSON.stringify({ ...dados, qtdMl: Number(qtdMl) }), {
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
        // Não existe cadastro de estoque novo: sem id, volta para a listagem
        if (idParam == null) {
            navigate('/listagem-estoques');
            return;
        }
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de estoques */}
            <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-estoques')}>
                <ArrowBackIcon />
            </IconButton>
            <Card title='Editar Estoque'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Hemocentro:' htmlFor='inputHemocentro'>
                                <select
                                    id='inputHemocentro'
                                    value={String(idHemocentro)}
                                    className='form-control'
                                    name='idHemocentro'
                                    disabled
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
                            <FormGroup label='Tipo Sanguíneo:' htmlFor='inputTipoS'>
                                <select
                                    id='inputTipoS'
                                    value={String(idTipoS)}
                                    className='form-control'
                                    name='idTipoS'
                                    disabled
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