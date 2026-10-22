import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import Card from '../components/card';
import FormGroup from '../components/form-group';

import '../custom.css';

import axios from 'axios';

function CadastroTipoS() {
    const { idParam } = useParams();

    const navigate = useNavigate();

    const baseURL = '/db.json';

    const [id, setId] = useState('');
    const [tipo, setTipo] = useState('');

    const [dados, setDados] = useState(null);

    function inicializar() {
        if (idParam == null) {
            setId('');
            setTipo('');
        } else if (dados) {
            setId(dados.id);
            setTipo(dados.tipo);
        }
    }

    async function salvar() {
        let data = {
            id,
            tipo,
        };
        data = JSON.stringify(data);
        console.log('Salvaria:', data);
        navigate(`/listagem-tipoS`);
    }

    async function buscar() {
        if (idParam == null) return;

        await axios.get(baseURL).then((response) => {
            const encontrado = response.data.tipoS.find(
                (item) => item.id === Number(idParam)
            );
            if (encontrado) {
                setDados(encontrado);
                setId(encontrado.id);
                setTipo(encontrado.tipo);
            }
        });
    }

    useEffect(() => {
        buscar(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);

    return (
        <div className='container'>
            <Card title='Cadastro de Tipo Sanguíneo'>
                <div className='row'>
                    <div className='col-lg-12'>
                        <div className='bs-component'>
                            <FormGroup label='Tipo: *' htmlFor='inputTipo'>
                                <input
                                    type='text'
                                    id='inputTipo'
                                    value={tipo}
                                    className='form-control'
                                    name='tipo'
                                    onChange={(e) => setTipo(e.target.value)}
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

export default CadastroTipoS;
