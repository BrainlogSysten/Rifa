import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Shield, Users, Sparkles, ChevronRight, Clock, DollarSign, Car, Trophy, Scale, AlertTriangle, Smartphone, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/common/Logo';
import { api } from '../services/api';

const HomePage: React.FC = () => {
  const [featuredRaffle, setFeaturedRaffle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: 'em prêmios', value: 'R$ 20M+' },
    { label: 'participantes', value: '50k+' },
    { label: 'sorteios realizados', value: '1000+' },
  ];

  useEffect(() => {
    const fetchFeaturedRaffle = async () => {
      try {
        const response = await api.get('/raffles');
        if (response.data.raffles && response.data.raffles.length > 0) {
          setFeaturedRaffle(response.data.raffles[0]);
        }
      } catch (error) {
        console.error('Error fetching featured raffle:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRaffle();
  }, []);

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: '100% Legal e Regulamentado',
      description: 'Sorteios promocionais autorizados pelo SCPC - Ministério da Fazenda',
    },
    {
      icon: <Scale className="w-8 h-8" />,
      title: 'Exclusivo para Empresas',
      description: 'Plataforma disponível apenas para pessoas jurídicas (CNPJ) regulares',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Vinculado à Loteria Federal',
      description: 'Todos os sorteios vinculados aos resultados oficiais da Loteria Federal',
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center relative px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-500/10 border border-secondary-500/30 rounded-full mb-6"
              >
                <Sparkles className="w-4 h-4 text-secondary-400" />
                <span className="text-sm font-semibold text-secondary-400">AUTORIZADO PELO SCPC/SECAP - MINISTÉRIO DA FAZENDA</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl lg:text-7xl font-bold mb-6"
              >
                <span className="gradient-text">Sorteios Promocionais</span>
                <br />
                <span className="text-white">100% Legalizados</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-gray-300 mb-8 leading-relaxed"
              >
                Plataforma exclusiva para empresas (CNPJ) realizarem sorteios promocionais
                regulamentados conforme Lei 5.768/71. Cadastro antecipado de 40-120 dias.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <Link to="/register" className="btn-primary inline-flex items-center justify-center gap-2">
                  Cadastrar Empresa (CNPJ)
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/raffles" className="btn-secondary inline-flex items-center justify-center gap-2">
                  Ver Sorteios Autorizados
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-8"
              >
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="text-3xl font-bold text-secondary-400 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - Featured Raffle Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {loading ? (
                <div className="card p-8 animate-pulse">
                  <div className="w-full h-48 bg-gray-700 rounded-xl mb-6" />
                  <div className="h-6 bg-gray-700 rounded mb-2" />
                  <div className="h-4 bg-gray-700 rounded mb-6 w-2/3" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-16 bg-gray-700 rounded" />
                    <div className="h-16 bg-gray-700 rounded" />
                  </div>
                </div>
              ) : featuredRaffle ? (
                <div className="card p-6">
                  {/* Main Content */}
                  <div className="text-center">
                    {/* Product Image */}
                    <div className="w-full h-48 mx-auto mb-6 rounded-2xl overflow-hidden relative">
                      {featuredRaffle.coverImageUrl && featuredRaffle.coverImageUrl !== 'https://example.com/iphone.jpg' ? (
                        <img
                          src={featuredRaffle.coverImageUrl}
                          alt={featuredRaffle.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${featuredRaffle.coverImageUrl && featuredRaffle.coverImageUrl !== 'https://example.com/iphone.jpg' ? 'hidden' : 'flex'} w-full h-full bg-gradient-to-br from-secondary-400 to-primary-600 items-center justify-center`}>
                        <img
                          src="/images/placeholders/electronics1.jpg"
                          alt={featuredRaffle.title}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            // Final fallback to icon
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center">
                          <Smartphone className="w-16 h-16 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-2 text-white">{featuredRaffle.title}</h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      {featuredRaffle.description}
                    </p>

                    {/* Price and Date Info */}
                    <div className="flex justify-center items-center gap-6 mb-6">
                      <div className="flex items-center gap-2 bg-surface-700/50 rounded-lg px-3 py-2">
                        <DollarSign className="w-4 h-4 text-accent-400" />
                        <span className="text-sm text-white font-medium">
                          R$ {featuredRaffle.ticketPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-700/50 rounded-lg px-3 py-2">
                        <Clock className="w-4 h-4 text-secondary-400" />
                        <span className="text-sm text-white">
                          {new Date(featuredRaffle.drawDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="glass rounded-xl p-3">
                        <div className="text-xl font-bold text-secondary-400">
                          {featuredRaffle.ticketsSold}
                        </div>
                        <div className="text-xs text-gray-500">Números vendidos</div>
                      </div>
                      <div className="glass rounded-xl p-3">
                        <div className="text-xl font-bold text-accent-400">
                          {featuredRaffle.numberOfTickets - featuredRaffle.ticketsSold}
                        </div>
                        <div className="text-xs text-gray-500">Disponíveis</div>
                      </div>
                    </div>

                    <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden mb-4">
                      <div
                        className="h-full bg-gradient-to-r from-secondary-400 to-secondary-600 rounded-full transition-all duration-1000"
                        style={{
                          width: `${Math.min((featuredRaffle.ticketsSold / featuredRaffle.numberOfTickets) * 100, 100)}%`
                        }}
                      />
                    </div>

                    <Link
                      to={`/raffle/${featuredRaffle.id}`}
                      className="btn-primary inline-flex items-center gap-2 text-sm"
                    >
                      Participar Agora
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="card p-8 text-center">
                  <p className="text-gray-400">Nenhum sorteio em destaque disponível</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-surface-500/20">
        <div className="container mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-5xl font-bold text-center mb-16 gradient-text"
          >
            Por que escolher o Sort.IO?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card group hover:scale-105"
              >
                <div className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Process Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-4 gradient-text">
              Como funciona legalmente?
            </h2>
            <p className="text-xl text-gray-400">
              Processo transparente e regulamentado pelo Ministério da Fazenda
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-400">1</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cadastro CNPJ</h3>
              <p className="text-sm text-gray-400">
                Apenas empresas com CNPJ regular e situação tributária em dia podem se cadastrar
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-400">2</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Solicitação SCPC</h3>
              <p className="text-sm text-gray-400">
                Cadastre a promoção no SCPC com 40-120 dias de antecedência e aguarde autorização
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-400">3</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Vinculação Loteria</h3>
              <p className="text-sm text-gray-400">
                Sorteio vinculado aos resultados oficiais da Loteria Federal para total transparência
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="card p-6"
            >
              <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-primary-400">4</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Prestação de Contas</h3>
              <p className="text-sm text-gray-400">
                Após o sorteio, preste contas ao SCPC com resultado, ganhadores e comprovações
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 border border-green-500/30 rounded-full">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">
                Processo 100% legal e regulamentado pelo Ministério da Fazenda
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12"
          >
            <div className="mx-auto mb-6">
              <Logo size="large" showText={false} />
            </div>
            <h2 className="text-4xl font-bold mb-6 text-white">
              Cadastre sua empresa para realizar sorteios legalizados
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Somente pessoas jurídicas (CNPJ) podem criar promoções comerciais autorizadas
            </p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2">
              Cadastrar Empresa
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Legal Compliance Notice */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-surface-800/50">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6 border border-yellow-500/20 bg-yellow-500/5"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Conformidade Legal - Lei 5.768/71 e Decreto 70.951/72
                </h3>
                <p className="text-gray-300 text-sm mb-3">
                  O Sort.IO opera exclusivamente com promoções comerciais autorizadas. Apenas empresas (CNPJ) regularizadas
                  e autorizadas pelo SCPC/SECAP podem cadastrar sorteios promocionais vinculados à Loteria Federal.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/legal-terms"
                    className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
                  >
                    Saiba mais sobre a legislação →
                  </Link>
                  <span className="text-gray-500 text-sm">
                    Autorizações SCPC/SECAP • Vinculado à Loteria Federal • Proibido para menores de 18 anos
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;