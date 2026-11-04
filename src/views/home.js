import React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../components/card';
import SubCard from '../components/sub-card';

import '../custom.css';

const passos = [
    {
        titulo: 'Passo 1',
        nome: 'Cadastre-se',
        texto: 'Crie seu perfil em menos de 2 minutos. Sem burocracia – apenas o essencial para começar.',
    },
    {
        titulo: 'Passo 2',
        nome: 'Acompanhe',
        texto: 'Saiba o impacto real da sua doação e quando você poderá doar novamente.',
    },
    {
        titulo: 'Passo 3',
        nome: 'Doe',
        texto: 'Compareça ao HemoMinas quando for acionado por campanhas de doação. O processo é rápido e seguro.',
    },
];

function Home() {
    const navigate = useNavigate();

    return (
        <div className='container'>
            {/* Apresentação */}
            <div className='text-center mb-5'>
                <h1 className='display-4'>
                    Uma vida começa com <br /><span className='text-danger'>você!</span>
                </h1><br />
                <p className='lead'>
                    Sangue Bom conecta doadores, hospitais e o Hemocentro, <br />tornando a
                    gestão de doação de sangue em Juiz de Fora simples, eficiente e
                    humana.
                </p><br />
                {/* O state "origem" avisa o formulário que o cadastro veio da Home */}
                <button
                    type='button'
                    className='btn btn-danger me-2 mr-2'
                    onClick={() =>
                        navigate('/cadastro-doadores', { state: { origem: 'home' } })
                    }
                >
                    Quero doar!
                </button>
                <button
                    type='button'
                    className='btn btn-outline-secondary'
                    onClick={() =>
                        navigate('/cadastro-instituicoes', { state: { origem: 'home' } })
                    }
                >
                    Hospital/Clínica
                </button>
            </div><br />

            {/* Passo a passo */}
            <div className='mb-5'>
                <Card title='Simples assim.'>
                    <div className='row'>
                        {passos.map((passo) => (
                            <div className='col-md-4 mb-3' key={passo.titulo}>
                                <SubCard title={passo.titulo}>
                                    <h5>{passo.nome}</h5>
                                    <p className='mb-0'>{passo.texto}</p>
                                </SubCard>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Home;