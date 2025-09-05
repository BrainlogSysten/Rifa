import { Link } from 'react-router-dom'
import { ArrowRight, Ticket, Trophy, Users, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-500 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Crie Rifas Online de Forma
              <span className="block text-yellow-300">Simples e Segura</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
              A plataforma mais moderna para criar e gerenciar rifas online.
              Aumente suas vendas e alcance mais pessoas!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-primary-600 text-white rounded-lg hover:bg-primary-800 transition-colors border-2 border-white/20"
              >
                Já tenho conta
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Por que escolher o RifaModerna?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos a melhor plataforma para você criar e gerenciar suas rifas com sucesso
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fácil de Criar</h3>
              <p className="text-gray-600">
                Crie sua rifa em minutos com nossa interface intuitiva e moderna
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sorteios Transparentes</h3>
              <p className="text-gray-600">
                Sistema de sorteio justo e transparente para todos os participantes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Alcance Mais Pessoas</h3>
              <p className="text-gray-600">
                Compartilhe facilmente suas rifas e alcance mais participantes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">100% Seguro</h3>
              <p className="text-gray-600">
                Pagamentos seguros e proteção total dos dados dos participantes
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já estão criando rifas de sucesso
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Criar Minha Primeira Rifa
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}