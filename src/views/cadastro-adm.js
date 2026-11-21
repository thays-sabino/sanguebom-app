import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

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
    const [senhaRepeticao, setSenhaRepeticao] = useState('');

    const [dados, setDados] = useState(null);

    const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

    function preencher(adm) {
        setLogin(adm.login ?? '');
        setEmail(adm.email ?? '');
        setSenha(adm.senha ?? '');
        setSenhaRepeticao(adm.senhaRepeticao ?? '');
    }

    function inicializar() {
        // Volta para a página anterior na edição
        if (idParam != null){
            navigate(-1);
            return;
        }
        
        const estaVazio = !login && !email && !senha &&!senhaRepeticao; // Verifica se os campos estão vazios

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
        if (!login || !email || (idParam == null && !senha)) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== senhaRepeticao) return;

        if (idParam == null) {
            const data = { login, email, senha, senhaRepeticao };

            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso(`Administrador ${login} cadastrado com sucesso!`);
                    navigate(`/listagem-adms`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao cadastrar o administrador.'
                    );
                });
        } else {
            // O PUT substitui o registro inteiro, então mantém os campos que já existiam
            const data = { ...dados, login, email, senha, senhaRepeticao };

            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso(`Administrador ${login} atualizado com sucesso!`);
                    navigate(`/listagem-adms`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao atualizar o administrador.'
                    );
                });
        }
    }

    async function buscar() {
        if (idParam == null) return;

        const response = await axios.get(`${baseURL}/${idParam}`);
        const adm = response.data;

        let emailAtual = adm.email ?? '';
        let senhaAtual = adm.senha ?? '';
        let repeticaoAtual = adm.senhaRepeticao ?? '';

        // Só no fake: a senha de um administrador antigo fica em usuarios.
        // Com o backend real, apagar este bloco.
        if ((!emailAtual || !senhaAtual) && adm.idUsuario) {
            const usuario = await axios.get(`${BASE_URL}/usuarios/${adm.idUsuario}`);
            emailAtual = emailAtual || (usuario.data.email ?? '');
            senhaAtual = senhaAtual || (usuario.data.senha ?? '');
            repeticaoAtual = repeticaoAtual || (usuario.data.senhaRepeticao ?? '');
        }

        const completo = {
            ...adm,
            email: emailAtual,
            senha: senhaAtual,
            senhaRepeticao: repeticaoAtual,
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
                                <input
                                    type='password'
                                    id='inputSenha'
                                    value={senha}
                                    className='form-control'
                                    name='senha'
                                    onChange={(e) => setSenha(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup
                                label='Repita a Senha: *'
                                htmlFor='inputSenhaRepeticao'
                            >
                                <input
                                    type='password'
                                    id='inputSenhaRepeticao'
                                    value={senhaRepeticao}
                                    className='form-control'
                                    name='senhaRepeticao'
                                    onChange={(e) => setSenhaRepeticao(e.target.value)}
                                />
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
