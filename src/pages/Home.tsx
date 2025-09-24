import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Clock,
  Calendar,
  Shuffle,
  DollarSign,
  Gift,
  Shield,
  Users,
  Check,
  Youtube,
  Ticket,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-purple text-white">
        <header className="border-b border-white/10">
          <div className="container">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-2">
                <Ticket className="w-8 h-8 text-secondary-400" />
                <span className="text-2xl font-black text-white">RIFAMODERNA</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="nav-link">Início</Link>
                <Link to="/rifas" className="nav-link">Rifas Disponíveis</Link>
                <Link to="/about" className="nav-link">Sobre</Link>
                <Link to="/contact" className="nav-link">Contato</Link>
              </div>
              
              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    <span className="text-white/80 text-sm">
                      Olá, {user?.name?.split(' ')[0]}!
                    </span>
                    <Link to="/dashboard" className="btn btn-secondary btn-sm flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-white hover:text-secondary-400 font-medium">
                      Entrar
                    </Link>
                    <Link to="/register" className="btn btn-secondary btn-sm">
                      Cadastrar
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        </header>

        <div className="container py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                Sistema Completo<br />
                de <span className="text-secondary-400">Rifas Online</span><br />
                Seguro!
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-lg">
                Participe de rifas incríveis de forma simples e segura.
                Sistema completo com sorteio automático, pagamento via PIX
                e entrega garantida dos prêmios.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/rifas" className="btn btn-secondary btn-lg">
                  Ver Rifas Disponíveis
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Participar das Rifas
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary-400" />
                  <span>Sem taxas ocultas</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary-400" />
                  <span>Pagamento seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-secondary-400" />
                  <span>Suporte 24/7</span>
                </div>
              </div>
            </div>
            
            <div className="relative animate-float">
              <div className="phone-mockup">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="phone-notch"></div>
                    <div className="flex flex-col h-full bg-white">
                      <div className="bg-primary-600 p-4">
                        <h3 className="text-white font-bold text-center">Minha Rifa</h3>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="bg-gray-100 rounded-lg p-3 mb-3">
                          <div className="h-32 bg-gray-200 rounded mb-3"></div>
                          <div className="h-3 bg-gray-300 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        </div>
                        <div className="grid grid-cols-5 gap-2">
                          {[...Array(15)].map((_, i) => (
                            <div key={i} className="aspect-square bg-primary-100 rounded flex items-center justify-center text-xs font-bold text-primary-600">
                              {String(i + 1).padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-4 border-t">
                        <button className="w-full bg-secondary-500 text-gray-900 font-bold py-2 rounded-full text-sm">
                          Comprar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-gray-600 text-lg">
              Recursos completos para criar e gerenciar suas rifas com sucesso
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Pagamento via PIX</h3>
              <p className="text-gray-600 text-sm">
                Receba pagamentos instantâneos direto na sua conta
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shuffle className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sorteio Automático</h3>
              <p className="text-gray-600 text-sm">
                Sistema de sorteio transparente e auditável
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Gestão de Participantes</h3>
              <p className="text-gray-600 text-sm">
                Controle completo de todos os participantes
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-gray-600 text-sm">
                Plataforma segura com proteção de dados
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-purple">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title text-white">
                Como <span className="text-secondary-400">funciona</span>
              </h2>
              
              <p className="text-white/80 mb-8">
                Em apenas 3 passos simples você cria sua rifa e começa a vender
              </p>
              
              <div className="space-y-4">
                <div className="feature-item">
                  <div className="feature-number">1</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Crie sua rifa</h3>
                    <p className="feature-description">
                      Configure o prêmio, quantidade de números e valor
                    </p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-number">2</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Compartilhe o link</h3>
                    <p className="feature-description">
                      Divulgue sua rifa nas redes sociais e WhatsApp
                    </p>
                  </div>
                </div>
                
                <div className="feature-item">
                  <div className="feature-number">3</div>
                  <div className="feature-content">
                    <h3 className="feature-title">Faça o sorteio</h3>
                    <p className="feature-description">
                      Realize o sorteio automático e transparente
                    </p>
                  </div>
                </div>
              </div>
              
              <Link to="/register" className="btn btn-white btn-lg mt-8">
                Criar Minha Primeira Rifa
              </Link>
            </div>
            
            <div className="relative">
              <div className="phone-mockup">
                <div className="phone-frame">
                  <div className="phone-screen">
                    <div className="phone-notch"></div>
                    <div className="flex items-center justify-center h-full bg-gray-100">
                      <div className="text-center p-8">
                        <Gift className="w-20 h-20 text-primary-500 mx-auto mb-4" />
                        <p className="text-lg font-bold text-gray-900">Sorteio ao Vivo</p>
                        <p className="text-sm text-gray-600 mt-2">Transparente e auditável</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">
              Planos e <span className="text-gradient">Preços</span>
            </h2>
            <p className="text-gray-600 text-lg">
              Escolha o plano ideal para suas necessidades
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Básico</h3>
              <p className="text-gray-600 text-sm mb-4">Para começar</p>
              <div className="text-4xl font-bold text-gray-900 mb-1">Grátis</div>
              <p className="text-gray-500 text-sm mb-6">Taxa de 5% por venda</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Até 100 números</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>1 rifa por vez</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Sorteio manual</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-outline btn-md w-full">
                Começar Grátis
              </Link>
            </div>
            
            <div className="card p-8 text-center border-2 border-primary-500 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="badge badge-yellow px-4">Mais Popular</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Profissional</h3>
              <p className="text-gray-600 text-sm mb-4">Para vender mais</p>
              <div className="text-4xl font-bold text-gray-900 mb-1">R$ 29,90</div>
              <p className="text-gray-500 text-sm mb-6">por mês</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Números ilimitados</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Rifas ilimitadas</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Sorteio automático</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Sem taxas por venda</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-primary btn-md w-full">
                Assinar Agora
              </Link>
            </div>
            
            <div className="card p-8 text-center">
              <h3 className="text-xl font-bold mb-2">Empresarial</h3>
              <p className="text-gray-600 text-sm mb-4">Para grandes volumes</p>
              <div className="text-4xl font-bold text-gray-900 mb-1">R$ 99,90</div>
              <p className="text-gray-500 text-sm mb-6">por mês</p>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Tudo do Profissional</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>API de integração</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Suporte prioritário</span>
                </li>
                <li className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span>Relatórios avançados</span>
                </li>
              </ul>
              <Link to="/register" className="btn btn-outline btn-md w-full">
                Entrar em Contato
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="section-title">
              O que nossos clientes dizem
            </h2>
            <p className="text-gray-600 text-lg">
              Milhares de rifas criadas com sucesso
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-secondary-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Sistema excelente! Consegui arrecadar o valor necessário para minha formatura em apenas uma semana."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Ana Silva</p>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-secondary-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Muito fácil de usar! O sorteio automático dá total transparência ao processo. Recomendo!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Carlos Oliveira</p>
                  <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-secondary-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Uso mensalmente para ajudar instituições de caridade. A plataforma é confiável e segura."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Santos</p>
                  <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-gradient-purple text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            Comece a criar suas rifas hoje mesmo!
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão arrecadando com sucesso
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn btn-secondary btn-xl">
              Criar Conta Grátis
            </Link>
            <Link to="/contact" className="btn btn-outline btn-xl">
              Falar com Vendas
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ticket className="w-6 h-6 text-secondary-400" />
                <span className="text-xl font-bold">RIFAMODERNA</span>
              </div>
              <p className="text-gray-400 text-sm">
                Sistema completo para criar e gerenciar rifas online com segurança e transparência.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/features" className="hover:text-white">Recursos</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Preços</Link></li>
                <li><Link to="/demo" className="hover:text-white">Demonstração</Link></li>
                <li><Link to="/api" className="hover:text-white">API</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/help" className="hover:text-white">Central de Ajuda</Link></li>
                <li><Link to="/docs" className="hover:text-white">Documentação</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contato</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/terms" className="hover:text-white">Termos de Uso</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacidade</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
                <li><Link to="/lgpd" className="hover:text-white">LGPD</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 RifaModerna. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;