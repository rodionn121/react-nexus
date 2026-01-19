import { useState } from 'react'
import './registro.css'
import { Header } from '../../components/header/header.tsx'

function Registro() {

    return (
        <>
            <Header />
            <div className='page'>
                <main id="form_container">
                    <div id="form_header">
                        <h1 id="form_title">Cadastro</h1>
                    </div>

                    <form action="" id="form">
                        <div id="input_container">
                            <div class="input_group">
                                <label for="name" class="form-label">Nome Completo</label>
                                <div className='input-field'>
                                    <input type="text" name='name' id='name' class="form-control" placeholder='...' />
                                </div>
                            </div>



                            <div class="input_group">
                                <label for="number_cpf" class="form-label">CPF</label>
                                <div className='input-field'>
                                    <input type="text" name='number_cpf' id='number_cpf' class="form-control" placeholder='...' />
                                </div>
                            </div>

                            <div class="input_group">
                                <label for="birthdate" class="form-label">Nascimento</label>
                                <div className='input-field'>
                                    <input type="date" name='birthdate' id='birthdate' class="form-control" placeholder='...' />
                                </div>
                            </div>

                            <div class="input_group">
                                <label for="skin_color" class="form-label">Cor de pele</label>
                                <div className='input-field'>
                                    <input type="text" name='skin_color' id='skin_color' class="form-control" placeholder='...' />
                                </div>
                            </div>

                            <div class="input_group">
                                <label for="nature" class="form-label">Natureza</label>
                                <div className='input-field'>
                                    <input type="text" name='nature' id='nature' class="form-control" placeholder='...' />
                                </div>
                            </div>


                            <div class="input_group">
                                <label for="nature" class="form-label">Cidade de atuação</label>
                                <div className='input-field'>
                                    <input type="text" name='nature' id='nature' class="form-control" placeholder='...' />
                                </div>
                            </div>


                            <div class="input_group">
                                <label for="nature" class="form-label">Tatuagem</label>
                                <div className='input-field'>
                                    <input type="text" name='nature' id='nature' class="form-control" placeholder='...' />
                                </div>
                            </div>

                            <div class="input_group">
                                <label for="eye_color" class="form-label">Cor dos olhos</label>
                                <div className='input-field'>
                                    <input type="text" name='eye_color' id='eye_color' class="form-control" placeholder='...' />
                                </div>
                            </div>
                        </div>

                        <div className="radio-container">
                            <label className="form-label">Gênero</label>

                            <div id="gender_inputs">
                                <div className="radio-box">
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="female"
                                        className="form-control"
                                        value="female"
                                    />
                                    <label htmlFor="female" className="form-label">Feminino</label>
                                </div>

                                <div className="radio-box">
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        className="form-control"
                                        value="male"
                                    />
                                    <label htmlFor="male" className="form-label">Masculino</label>
                                </div>

                                <div className="radio-box">
                                    <input
                                        type="radio"
                                        name="gender"
                                        id="other"
                                        className="form-control"
                                        value="other"
                                    />
                                    <label htmlFor="other" className="form-label">Outro</label>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-default">Cadastrar</button>
                    </form>
                </main>
            </div>

        </>
    )
}

export default Registro
