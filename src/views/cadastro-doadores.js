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
import {
    cpfCompleto,
    limitarCpf,
    limitarTelefone,
    mascararCpf,
    mascararTelefone,
    somenteNumeros,
    telefoneCompleto,
} from '../services/mascaras';

function CadastroDoadores() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/doadores`;

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarSenhaRepeticao, setMostrarSenhaRepeticao] = useState(false);
    const [senhaRepeticao, setSenhaRepeticao] = useState('');
    const [cpf, setCpf] = useState('');
    const [dtNasc, setDtNasc] = useState('');
    const [sexo, setSexo] = useState('');
    const [celular, setCelular] = useState('');
    const [idTipoS, setIdTipoS] = useState('');

    const [tipos, setTipos] = useState([]);

    const [dados, setDados] = useState(null);
    const [usuario, setUsuario] = useState(null); // usuário (login) vinculado

    const senhasDiferentes = senhaRepeticao !== '' && senha !== senhaRepeticao;

    const hoje = new Date();
    const dataMax = new Date(hoje.getFullYear() - 16, hoje.getMonth(), hoje.getDate())
        .toISOString()
        .split('T')[0];
    const dataMin = new Date(hoje.getFullYear() - 69, hoje.getMonth(), hoje.getDate())
        .toISOString()
        .split('T')[0];

    // Converte "01/01/2000" (db.json) -> "2000-01-01" (input type="date")
    function paraISO(dataBR) {
        if (!dataBR) return '';
        if (dataBR.includes('-')) return dataBR; // caso já esteja em ISO
        const [dia, mes, ano] = dataBR.split('/');
        if (!dia || !mes || !ano) return '';
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    // Converte "2000-01-01" (input type="date") -> "01/01/2000" (db.json)
    function paraBR(dataISO) {
        if (!dataISO) return '';
        if (dataISO.includes('/')) return dataISO; // caso já esteja em BR
        const [ano, mes, dia] = dataISO.split('-');
        if (!ano || !mes || !dia) return '';
        return `${dia}/${mes}/${ano}`;
    }

    function preencher(doador) {
        setNome(doador.nome ?? '');
        setEmail(doador.email ?? '');
        setSenha(doador.senha ?? '');
        setSenhaRepeticao(doador.senhaRepeticao ?? '');
        setCpf(somenteNumeros(doador.cpf));
        setDtNasc(paraISO(doador.dtNasc ?? ''));
        setSexo(doador.sexo ?? '');
        setCelular(somenteNumeros(doador.celular));
        setIdTipoS(doador.idTipoS != null ? String(doador.idTipoS) : '');
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
            !nome ||
            !email ||
            !cpf ||
            !dtNasc ||
            !sexo ||
            !celular ||
            !idTipoS ||
            (idParam == null && !senha)
        ) {
            mensagemAlert('Preencha todos os campos obrigatórios.');
            return;
        }

        if (!cpfCompleto(cpf)) {
            mensagemAlert('CPF incompleto. Confira os números informados.');
            return;
        }

        if (!telefoneCompleto(celular)) {
            mensagemAlert('Celular incompleto. Confira os números informados.');
            return;
        }

        if (senha !== senhaRepeticao) return;

        if (idParam != null && !dados) return;

        // E-mail e senha ficam na tabela de usuários (é de lá que as listagens leem);
        // o doador guarda apenas o idUsuario.
        const login = { email, senha, senhaRepeticao };

        const dadosDoador = {
            nome,
            cpf,
            dtNasc: paraBR(dtNasc),
            sexo,
            celular,
            idTipoS: Number(idTipoS),
        };

        const cabecalho = { headers: { 'Content-Type': 'application/json' } };

        try {
            // 1) cria ou atualiza o usuário
            let idUsuario = usuario?.id;

            if (idUsuario != null) {
                await axios.put(
                    `${BASE_URL}/usuarios/${idUsuario}`,
                    JSON.stringify({ ...usuario, ...login }),
                    cabecalho
                );
            } else {
                const resposta = await axios.post(
                    `${BASE_URL}/usuarios`,
                    JSON.stringify({ ...login, perfil: 'doador', status: true }),
                    cabecalho
                );
                idUsuario = resposta.data.id;
            }

            // 2) cria ou atualiza o registro
            if (idParam == null) {
                await axios.post(
                    baseURL,
                    JSON.stringify({ ...dadosDoador, idUsuario }),
                    cabecalho
                );
                mensagemSucesso(`Doador ${nome} cadastrado com sucesso!`);
            } else {
                // Remove e-mail/senha que versões antigas gravavam dentro do registro
                const { email: emailAntigo, senha: senhaAntiga, senhaRepeticao: repeticaoAntiga, ...semLogin } = dados;

                await axios.put(
                    `${baseURL}/${idParam}`,
                    JSON.stringify({ ...semLogin, ...dadosDoador, idUsuario }),
                    cabecalho
                );
                mensagemSucesso(`Doador ${nome} atualizado com sucesso!`);
            }

            navigate(`/listagem-doadores`);
        } catch (error) {
            mensagemErro(
                typeof error.response?.data === 'string' && error.response.data
                    ? error.response.data
                    : 'Erro ao salvar o doador.'
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
        axios.get(`${BASE_URL}/tipoS`).then((response) => {
            setTipos(response.data);
        });
    }, []);

    useEffect(() => {
        buscar();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container tema-principal'>
            {/* Botão de voltar para a listagem de doadores */}
            <IconButton aria-label='Voltar' onClick={() => navigate('/listagem-doadores')}>
                <ArrowBackIcon />
            </IconButton>
            <Card title='Cadastro de Doador'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>

                            <div className='row'>
                                <div className='col-md-6'>
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
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup label='CPF: *' htmlFor='inputCpf'>
                                        <input
                                            type='text'
                                            id='inputCpf'
                                            value={mascararCpf(cpf)}
                                            placeholder='000.000.000-00'
                                            className='form-control'
                                            name='cpf'
                                            onChange={(e) => setCpf(limitarCpf(e.target.value))}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-4'>
                                    <FormGroup label='Data de Nascimento: *' htmlFor='inputDtNasc'>
                                        <input
                                            type='date'
                                            id='inputDtNasc'
                                            value={dtNasc}
                                            min={dataMin}
                                            max={dataMax}
                                            className='form-control'
                                            name='dtNasc'
                                            onChange={(e) => setDtNasc(e.target.value)}
                                            onClick={(e) => e.target.showPicker?.()}
                                        />
                                    </FormGroup>
                                </div>
                                <div className='col-md-4'>
                                    <FormGroup label='Sexo: *' htmlFor='inputSexo'>
                                        <select
                                            id='inputSexo'
                                            value={sexo}
                                            className='form-control'
                                            name='sexo'
                                            onChange={(e) => setSexo(e.target.value)}
                                        >
                                            <option value=''>Selecione</option>
                                            <option value='Feminino'>Feminino</option>
                                            <option value='Masculino'>Masculino</option>
                                        </select>
                                    </FormGroup>
                                </div>
                                <div className='col-md-4'>
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
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col-md-6'>
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
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup label='Celular: *' htmlFor='inputCelular'>
                                        <input
                                            type='text'
                                            id='inputCelular'
                                            value={mascararTelefone(celular)}
                                            placeholder='(00) 9 0000-0000'
                                            className='form-control'
                                            name='celular'
                                            onChange={(e) => setCelular(limitarTelefone(e.target.value))}
                                        />
                                    </FormGroup>
                                </div>
                            </div>

                            <hr className='my-4' />
                            <div className='row'>
                                <div className='col-md-6'>
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
                                </div>
                                <div className='col-md-6'>
                                    <FormGroup label='Repita a Senha: *' htmlFor='inputSenhaRepeticao'>
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
                                </div>
                            </div>
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