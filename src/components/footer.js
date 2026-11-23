import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer
            style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '4rem 0'
            }}
        >
            <div className='container'>
                <div className='row align-items-start'>
                    {/**Logo branca */}
                    <div className='col-md-4 mb-4 mb-md-0 d-flex align-items-center'>
                        <img
                            src='/logo branca.png'
                            alt='Sangue Bom'
                            style={{ width: '200px', height: 'auto' }}
                        />
                    </div>

                    {/**Links */}
                    <div className='col-md-4 mb-4 mb-md-0'>
                        <h6 className='fw-bold mb-3' style={{ color: '#FFFFFF' }}>
                            LINKS
                        </h6>
                        <ul className='list-unstyled mb-0'>
                            <li className='mb-2'>
                                <Link
                                    to='/cadastro-doadores'
                                    className='text-white text-decoration-none footer-link'
                                >
                                    Doador
                                </Link>
                            </li>

                            <li className='mb-2'>
                                <Link
                                    to='/cadastro-instituicoes'
                                    className='text-white text-decoration-none footer-link'
                                >
                                    Hospital/Clínica
                                </Link>
                            </li>

                            <li className='mb-2'>
                                <Link
                                    to='/cadastro-hemocentro'
                                    className='text-white text-decoration-none footer-link'
                                >
                                    Hemocentro
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/**Hemocentro JF */}
                    <div className='col-md-4'>
                        <h6 className='fw-bold mb-3' style={{ color: '#FFFFFF' }}>
                            HEMOCENTRO JUIZ DE FORA
                        </h6>
                        <p className='mb-2' style={{ color: '#EAEAEA', fontSize: '0.95rem' }}>
                            Rua Barão de Cataguases, s/n - Santa Helena, Juiz de Fora - MG
                        </p>
                        <p className='mb-2' style={{ color: '#EAEAEA', fontSize: '0.95rem' }}>
                            (32) 3257-3100
                        </p>
                        <p className='mb-2' style={{ color: '#EAEAEA', fontSize: '0.95rem' }}>
                            jf.captacao@hemominas.mg.gov.br
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
