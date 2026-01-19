import { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom';
import Nexus from '../../assets/nexus.png'


function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState('')
    const [erro, setErro] = useState('')

    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            const response = await fetch('https://backend-sistema-gerenciamento.onrender.com/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password, password
                }),
            });

            const data = await response.json()

            if (response.ok) {
                localStorage.setItem('token_nexus', data.token)

                navigate('/tabela');
            } else {
                setErro("Credênciais inválidas");
            }
        } catch (err) {
            setErro('Erro ao conectar com o servidor')
        } finally {
            setLoading(false)
        }
    };




    return (
        <>
            <main>
                <section class="section-nexus">
                    <img src={Nexus} alt="" />
                </section>

                <section class="section-form">
                    <p class="title-form">Login</p>
                    <form action="" onSubmit={handleLogin}>
                        <div class="form-element" id="username-form">
                            <label for="">Nome de Usuário / E-mail</label>
                            <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div class="form-element">
                            <label for="">Senha</label>
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                            <p>Esqueceu a sua senha?</p>
                            {erro && <p className="error-message" style={{color: '#ff4444', fontSize: '0.8rem', marginBottom: '10px'}}>{erro}</p>}
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? 'Carregando...' : 'Entrar'}</button>
                        <p>Não tem uma conta? <a href="">Cadastre-se</a></p>
                    </form>
                </section>
            </main>
        </>
    )
}

export default Login
