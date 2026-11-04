import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import { mensagemSucesso,mensagemErro, mensagemAlert } from '../components/toastr';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroDoadores() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/doadores`;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [cpf, setCpf] = useState('');
    const [dtNasc, setDtNasc] = useState('');
    const [sexo, setSexo] = useState('');
    const [celular, setCelular] = useState('');
    const [tipoS, setTipoS] = useState('');

    const [tipos, setTipos] = useState([]);

    const [dados, setDados] = useState(null);

    const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

    function preencher(doador) {
        setNome(doador.nome ?? '');
        setEmail(doador.email ?? '');
        setSenha(doador.senha ?? '');
        setSenhaRepeticao(doador.senhaRepeticao ?? '');
        setCpf(doador.cpf ?? '');
        setDtNasc(doador.dtNasc ?? '');
        setSexo(doador.sexo ?? '');
        setCelular(doador.celular ?? '');
        setTipoS(doador.tipoS ?? '');
    }

    function inicializar() {
        if (idParam == null) {
            preencher({});
        } else if (dados) {
            preencher(dados);
        }
    }

    async function salvar() {
        if (
            !nome ||
            !email ||
            !cpf ||
            !dtNasc ||
            !sexo ||
            !celular ||
            !tipoS ||
            (idParam == null && !senha)
        ) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (senha !== senhaRepeticao) return;

        if (idParam == null) {
            const data = {
                nome,
                email,
                senha,
                senhaRepeticao,
                cpf,
                dtNasc,
                sexo,
                celular,
                tipoS,
            };

            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso(`Doador ${nome} cadastrado com sucesso!`);
                    navigate(`/listagem-doadores`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao cadastrar o doador.'
                    );
                });
        } else {
            // O PUT substitui o registro inteiro, então mantém os campos que já existiam
            const data = {
                ...dados,
                nome,
                email,
                senha,
                senhaRepeticao,
                cpf,
                dtNasc,
                sexo,
                celular,
                tipoS,
            };

            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    mensagemSucesso(`Doador ${nome} atualizado com sucesso!`);
                    navigate(`/listagem-doadores`);
                })
                .catch(function (error) {
                    mensagemErro(
                        typeof error.response?.data === 'string' && error.response.data
                            ? error.response.data
                            : 'Erro ao atualizar o doador.'
                    );
                });
        }
    }

    async function buscar() {
        if (idParam == null) return;

        const response = await axios.get(`${baseURL}/${idParam}`);
        const doador = response.data;

        let senhaAtual = doador.senha ?? '';
        let repeticaoAtual = doador.senhaRepeticao ?? '';

        // Só no fake: a senha de um doador antigo fica em usuarios.
        // Com o backend real, apagar este bloco.
        if (!senhaAtual && doador.idUsuario) {
            const usuario = await axios.get(
                `${BASE_URL}/usuarios/${doador.idUsuario}`
            );
            senhaAtual = usuario.data.senha ?? '';
            repeticaoAtual = usuario.data.senhaRepeticao ?? '';
        }

        const completo = {
            ...doador,
            senha: senhaAtual,
            senhaRepeticao: repeticaoAtual,
        };

        setDados(completo);
        preencher(completo);
    }

    useEffect(() => {
        axios.get(`${BASE_URL}/tipoS`).then((response) => {
            setTipos(response.data);
        });
    }, []);

    useEffect(() => {
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container'>
            <Card title='Cadastro de Doador'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Nome: *' htmlFor='inputNome'>
                                <input
                                    type='text'
                                    id='inputNome'
                                    value={nome}
                                    className='form-control'
                                    name='nome'
                                    onChange={(e) => setNome(e.target.value)}
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
                            <FormGroup label='CPF: *' htmlFor='inputCpf'>
                                <input
                                    type='text'
                                    id='inputCpf'
                                    value={cpf}
                                    className='form-control'
                                    name='cpf'
                                    onChange={(e) => setCpf(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Data de Nascimento: *' htmlFor='inputDtNasc'>
                                <input
                                    type='text'
                                    id='inputDtNasc'
                                    value={dtNasc}
                                    placeholder='dd/mm/aaaa'
                                    className='form-control'
                                    name='dtNasc'
                                    onChange={(e) => setDtNasc(e.target.value)}
                                />
                            </FormGroup>
                            <FormGroup label='Sexo: *' htmlFor='inputSexo'>
                                <select
                                    id='inputSexo'
                                    value={sexo}
                                    className='form-control'
                                    name='sexo'
                                    onChange={(e) => setSexo(e.target.value)}
                                >
                                    <option value=''>Selecione</option>
                                    <option value='feminino'>Feminino</option>
                                    <option value='masculino'>Masculino</option>
                                </select>
                            </FormGroup>
                            <FormGroup label='Celular: *' htmlFor='inputCelular'>
                                <input
                                    type='text'
                                    id='inputCelular'
                                    value={celular}
                                    className='form-control'
                                    name='celular'
                                    onChange={(e) => setCelular(e.target.value)}
                                />
                            </FormGroup>
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

export default CadastroDoadores;