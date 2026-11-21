import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/footer';

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
        <div className='tema-principal'>
            {/* Apresentação */}
            <div className='container text-center mb-5'>
                <br />
                <h1 className='display-4 fonte-anton'>
                    Uma vida começa com <br />
                    <span className='texto-vermelho'>você!</span>
                </h1><br />
                
                <p className='lead' style={{color: '#555555'}}>
                    Sangue Bom conecta doadores, hospitais e o Hemocentro, <br />tornando a
                    gestão de doação de sangue em Juiz de Fora simples, eficiente e
                    humana.
                </p><br />

                {/* O state "origem" avisa o formulário que o cadastro veio da Home */}
                <button
                    type='button'
                    className='btn btn-danger btn-vermelho me-2 mr-2'
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
            <div style={{backgroundColor: '#F4F4F4', padding: '4rem 0'}}>
                <div className='container'>
                    <div className='mb-5'>
                        <small
                            className='fw-semibold d-block mb-1'
                            style={{color:'#777777', letterSpacing: '1px', fontSize: '0.75rem'}}
                        >
                            PASSO A PASSO
                        </small>
                        <h2 className='fonte-anton' style={{ fontSize: '2.5rem', color: '#111111'}}>
                            Simples assim.
                        </h2>
                    </div>
                    <div className='row g-4'>
                        {passos.map((passo) => (
                            <div className='col-md-4 mb-3' key={passo.titulo}>
                                <h5
                                    className='texto-vermelho fw-bold pb-2 mb-3'
                                    style={{borderBottom: '1px solid #DCDCDC'}}
                                >
                                    {passo.titulo}
                                </h5>
                                <h5 className='fw-bold mb-2' style={{color: '#111111'}}>
                                    {passo.nome}
                                </h5>
                                <p className='mb-0' style={{color: '#555555', lineHeight: '1.6'}}>
                                    {passo.texto}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>                
            </div>
            <Footer/>
        </div>
    );
}

export default Home;
