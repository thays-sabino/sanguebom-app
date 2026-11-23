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

function CadastroAdms() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/adms`;

    const [login, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenhaRepeticao, setMostrarSenhaRepeticao] = useState(false);
    const [senhaRepeticao, setSenhaRepeticao] = useState('');

    const [dados, setDados] = useState(null);
    const [usuario, setUsuario] = useState(null); // usuário (login) vinculado

    const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

    function preencher(adm) {
        setLogin(adm.login ?? '');
        setEmail(adm.email ?? '');
        setSenha(adm.senha ?? '');
        setSenhaRepeticao(adm.senhaRepeticao ?? '');
    }

    function inicializar() {
        if (idParam == null) {
            preencher({});      // cadastro novo: limpa tudo
        } else if (dados) {
            preencher(dados);   // edição: volta aos valores originais
        }
    }

    async function salvar() {
        if (
            !login ||
            !email ||
            (idParam == null && !senha)
        ) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== senhaRepeticao) return;

        if (idParam != null && !dados) return;

        // E-mail e senha ficam na tabela de usuários (é de lá que as listagens leem);
        // o administrador guarda apenas o idUsuario.
        const credenciais = { email, senha, senhaRepeticao };

        const dadosAdm = {
            login,
        };

        const cabecalho = { headers: { 'Content-Type': 'application/json' } };

        try {
            // 1) cria ou atualiza o usuário
            let idUsuario = usuario?.id;

            if (idUsuario != null) {
                await axios.put(
                    `${BASE_URL}/usuarios/${idUsuario}`,
                    JSON.stringify({ ...usuario, ...credenciais }),
                    cabecalho
                );
            } else {
                const resposta = await axios.post(
                    `${BASE_URL}/usuarios`,
                    JSON.stringify({ ...credenciais, perfil: 'adm', status: true }),
                    cabecalho
                );
                idUsuario = resposta.data.id;
            }

            // 2) cria ou atualiza o registro
            if (idParam == null) {
                await axios.post(
                    baseURL,
                    JSON.stringify({ ...dadosAdm, idUsuario }),
                    cabecalho
                );
                mensagemSucesso(`Administrador ${login} cadastrado com sucesso!`);
            } else {
                // Remove e-mail/senha que versões antigas gravavam dentro do registro
                const { email: emailAntigo, senha: senhaAntiga, senhaRepeticao: repeticaoAntiga, ...semLogin } = dados;

                await axios.put(
                    `${baseURL}/${idParam}`,
                    JSON.stringify({ ...semLogin, ...dadosAdm, idUsuario }),
                    cabecalho
                );
                mensagemSucesso(`Administrador ${login} atualizado com sucesso!`);
            }

            navigate(`/listagem-adms`);
        } catch (error) {
            mensagemErro(
                typeof error.response?.data === 'string' && error.response.data
                    ? error.response.data
                    : 'Erro ao salvar o administrador.'
            );
        }
    }

    async function buscar() {
        if (idParam == null) return;

        const response = await axios.get(`${baseURL}/${idParam}`);
        const registro = response.data;

        // E-mail e senha vêm da tabela de usuários
        let usuarioAtual = null;
        if (registro.idUsuario) {
            const resposta = await axios.get(
                `${BASE_URL}/usuarios/${registro.idUsuario}`
            );
            usuarioAtual = resposta.data;
        }
        setUsuario(usuarioAtual);

        // Registros antigos, sem usuário vinculado, ainda podem ter o e-mail dentro do próprio registro
        const completo = {
            ...registro,
            email: usuarioAtual?.email ?? registro.email ?? '',
            senha: usuarioAtual?.senha ?? registro.senha ?? '',
            senhaRepeticao: usuarioAtual?.senhaRepeticao ?? registro.senhaRepeticao ?? '',
        };

        setDados(completo);
        preencher(completo);
    }

    useEffect(() => {
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de administradores */}
            <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-adms')}>
                <ArrowBackIcon />
            </IconButton>
            <Card title='Cadastro de Administrador'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Login: *' htmlFor='inputLogin'>
                                <input
                                    type='text'
                                    id='inputLogin'
                                    value={login}
                                    className='form-control'
                                    name='login'
                                    onChange={(e) => setLogin(e.target.value)}
                                />
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

export default CadastroAdms;