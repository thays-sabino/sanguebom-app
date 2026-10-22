import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import axios from 'axios';
import { BASE_URL } from '../config/axios';

function CadastroUsuarios() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = `${BASE_URL}/usuarios`;

    const [id, setId] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
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
            preencher({});
        } else if (dados) {
            preencher(dados);
        }
    }

    async function salvar() {
        if (senha !== senhaRepeticao) return;

        const data = { email, senha, senhaRepeticao, perfil, status };

        if (idParam == null) {
            await axios
                .post(baseURL, JSON.stringify(data), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    navigate(`/listagem-usuarios`);
                })
                .catch(function (error) {
                    console.error(error);
                });
        } else {
            await axios
                .put(`${baseURL}/${idParam}`, JSON.stringify({ id, ...data }), {
                    headers: { 'Content-Type': 'application/json' },
                })
                .then(function () {
                    navigate(`/listagem-usuarios`);
                })
                .catch(function (error) {
                    console.error(error);
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
        <div className='container'>
            <Card title='Cadastro de Usuário'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
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
                                label='Repetir Senha: *'
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
