import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Card from '../components/card';
import FormGroup from '../components/form-group';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import '../custom.css';

import { mensagemSucesso, mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroUsuarios() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/usuarios`;

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenhaRepeticao, setMostrarSenhaRepeticao] = useState(false);
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [perfil, setPerfil] = useState('');
    const [status, setStatus] = useState(true);

    const [dados, setDados] = useState(null);

    const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

    function preencher(usuario) {
        setId(usuario.id ?? '');
        setEmail(usuario.email ?? '');
        setSenha(usuario.senha ?? '');
        setSenhaRepeticao(usuario.senhaRepeticao ?? '');
        setPerfil(usuario.perfil ?? '');
        setStatus(usuario.status ?? true);
    }

    function inicializar() {
        if (idParam == null) {
            preencher({});      // cadastro novo: limpa tudo
        } else if (dados) {
            preencher(dados);   // edição: volta aos valores originais
        }
    }

    async function salvar() {
        if (!email || !senha || !perfil) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }
        if (senha !== senhaRepeticao) return;

        const data = { email, senha, senhaRepeticao, perfil, status };

        if (idParam == null) {
            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function (response) {
                    mensagemSucesso(`Usuário ${response.data.id} cadastrado com sucesso!`);
                    navigate(`/listagem-usuarios`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao cadastrar o usuário.'
                    );
                });
        } else {
            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify({ id, ...data }), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso(`Usuário ${id} atualizado com sucesso!`);
                    navigate(`/listagem-usuarios`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao atualizar o usuário.'
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
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de usuários */}
            <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-usuarios')}>
                <ArrowBackIcon />
            </IconButton>
            <Card title='Cadastro de Usuário'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Status: *' htmlFor='inputStatus'>
                                <select
                                    id='inputStatus'
                                    value={status ? 'true' : 'false'}
                                    className='form-control'
                                    name='status'
                                    onChange={(e) => setStatus(e.target.value === 'true')}
                                >
                                    <option value='true'>Ativo</option>
                                    <option value='false'>Inativo</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Perfil: *' htmlFor='inputPerfil'>
                                <select
                                    id='inputPerfil'
                                    value={perfil}
                                    className='form-control'
                                    name='perfil'
                                    onChange={(e) => setPerfil(e.target.value)}
                                >
                                    <option value=''>Selecione</option>
                                    <option value='adm'>Administrador</option>
                                    <option value='doador'>Doador</option>
                                    <option value='hemocentro'>Hemocentro</option>
                                    <option value='instituicao'>Instituição</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='E-mail: *' htmlFor='inputEmail'>
                                <input
                                    type='email'
                                    id='inputEmail'
                                    value={email}
                                    className='form-control'
                                    name='email'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Senha: *' htmlFor='inputSenha'>
                                <div className='input-group'>
                                    <input
                                        type={mostrarSenha ? 'text' : 'password'}
                                        id='inputSenha'
                                        value={senha}
                                        className='form-control'
                                        name='senha'
                                        onChange={(e) => setSenha(e.target.value)}
                                    />
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={() => setMostrarSenha(!mostrarSenha)}
                                    >
                                        {mostrarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </button>
                                </div>
                            </FormGroup>
                            <FormGroup
                                label='Repita a Senha: *'
                                htmlFor='inputSenhaRepeticao'
                            >
                                <div className='input-group'>
                                    <input
                                        type={mostrarSenhaRepeticao ? 'text' : 'password'}
                                        id='inputSenhaRepeticao'
                                        value={senhaRepeticao}
                                        className='form-control'
                                        name='senhaRepeticao'
                                        onChange={(e) => setSenhaRepeticao(e.target.value)}
                                    />
                                    <button
                                        type='button'
                                        className='btn btn-outline-secondary'
                                        onClick={() => setMostrarSenhaRepeticao(!mostrarSenhaRepeticao)}
                                    >
                                        {mostrarSenhaRepeticao ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </button>
                                </div>
                                {senhasDiferentes && (
                                    <small className='text-danger'>
                                        As senhas não conferem.
                                    </small>
                                )}
                            </FormGroup>
                            <Stack spacing={1} padding={1} direction='row'>
                                <button
                                    onClick={salvar}
                                    type='button'
                                    className='btn btn-success'
                                    disabled={senhasDiferentes}
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

export default CadastroUsuarios;