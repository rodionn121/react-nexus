import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './loginTw.css';
import Nexus from '../../assets/nexus.png';

function LoginTw() {
    const [email_user, setEmail] = useState('');
    const [password_user, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro('');

        try {
            const response = await fetch(
                'https://backend-nexus-md0p.onrender.com/token',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email_user,
                        senha: password_user
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token_nexus', data.access_token);
                navigate('/home');
            } else {
                setErro('Credenciais inválidas');
            }
        } catch {
            setErro('Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen w-screen grid grid-cols-2 grid-rows-6">
            <section className="row-span-5 col-span-2 flex flex-col justify-center items-center">
                <form
                    onSubmit={handleLogin}
                    className="w-80 flex flex-col justify-center items-center border border-neutral-800 rounded-sm px-10 py-4 gap-5"
                >
                    <div className="flex flex-col items-center gap-2">
                        <img className="w-12" src={Nexus} alt="Nexus" />
                        <p className="text-2xl">Login</p>
                    </div>

                    <input
                        className="bg-zinc-900 h-9 w-full pl-3 outline-0 rounded-sm border-2 border-zinc-800"
                        placeholder="Digite seu e-mail"
                        required
                        value={email_user}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="bg-zinc-900 h-9 w-full pl-3 outline-0 rounded-sm border-2 border-zinc-800"
                        placeholder="Digite sua senha"
                        required
                        value={password_user}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        className="bg-blue-500 h-8 text-slate-50 rounded-md w-full hover:bg-blue-400"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>

                    <p className="text-blue-700">Esqueci minha senha</p>

                    {erro && (
                        <p style={{ color: '#ff4444', fontSize: '0.8rem' }}>
                            {erro}
                        </p>
                    )}
                </form>

                <div className="border border-zinc-700 rounded-sm w-80 my-4 text-center py-4">
                    <p className='text-zinc-500 font-extralight'>
                        Entre em contato com os desenvolvedores para adquirir um login
                    </p>
                </div>
            </section>

            <section className="row-span-1 col-span-2">
                <ul className="flex flex-wrap gap-5 justify-center">
                    <li className="text-zinc-500">Português (Brazil)</li>
                    <li className="text-zinc-500">@2026 Nexus</li>
                </ul>
            </section>
        </main>
    );
}

export default LoginTw;
