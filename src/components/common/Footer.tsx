import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Scale,
  Award,
  FileText,
  Building2,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-900 border-t border-white/5">
      {/* Legal Disclaimer Banner */}
      <div className="bg-yellow-500/10 border-b border-yellow-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-3 flex-wrap text-center">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <p className="text-sm text-gray-200">
              <strong>IMPORTANTE:</strong> Sorteios promocionais regulamentados pelo SCPC/MF conforme Lei 5.768/71 e Decreto 70.951/72.
              Apenas empresas com CNPJ regular podem cadastrar promoções. Proibido para menores de 18 anos.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Logo size="medium" />
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Plataforma líder em sorteios promocionais autorizados no Brasil.
              Operamos com total transparência e conformidade legal.
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-green-400" />
              <span>100% Legal e Regulamentado</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Scale className="w-4 h-4 text-secondary-400" />
              Compliance Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legal-terms" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/scpc-authorization" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Autorizações SCPC
                </Link>
              </li>
              <li>
                <Link to="/regulation" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Regulamento Geral
                </Link>
              </li>
              <li>
                <a
                  href="https://www.gov.br/fazenda/pt-br/assuntos/apostas-e-jogos/promocao-comercial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-secondary-400 text-sm transition-colors flex items-center gap-1"
                >
                  Portal SCPC <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-secondary-400" />
              Sorteios
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/raffles" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Sorteios Ativos
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link to="/winners" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Ganhadores Anteriores
                </Link>
              </li>
              <li>
                <Link to="/transparency" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Portal Transparência
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-secondary-400 text-sm transition-colors">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Compliance */}
          <div>
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-secondary-400" />
              Informações Empresariais
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-gray-400">CNPJ: XX.XXX.XXX/0001-XX</p>
                  <p className="text-xs text-gray-500">Razão Social: Sort.IO Tecnologia Ltda</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <p className="text-gray-400">
                  São Paulo, SP - Brasil
                </p>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-500 mt-0.5" />
                <a href="mailto:compliance@sort.io" className="text-gray-400 hover:text-secondary-400 transition-colors">
                  compliance@sort.io
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
                <p className="text-gray-400">
                  0800 XXX XXXX
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400 font-medium">Autorizado SCPC</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <Award className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400 font-medium">Vinculado à Loteria Federal</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <Scale className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-400 font-medium">Lei 5.768/71</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Sort.IO - Plataforma de Sorteios Promocionais. Todos os direitos reservados.
            </p>
            <p className="text-xs text-gray-600 mt-2">
              Operação exclusiva para empresas (CNPJ) com regularidade fiscal.
              Prestação de contas obrigatória conforme regulamentação SCPC.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;