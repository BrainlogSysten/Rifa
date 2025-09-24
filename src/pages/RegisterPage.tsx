import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Upload,
  FileText,
  Shield,
  AlertCircle,
  Phone,
  MapPin,
  User,
  CreditCard,
  Scale,
  Info,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/common/Logo';

interface FormDataCNPJ {
  // Etapa 1 - Dados básicos
  companyName: string;
  tradeName: string;
  cnpj: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;

  // Etapa 2 - Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;

  // Etapa 3 - Responsável Legal
  legalRepName: string;
  legalRepCPF: string;
  legalRepEmail: string;
  legalRepPhone: string;

  // Etapa 4 - Documentação e Conformidade
  socialStatute: File | null;
  electionMinutes: File | null;
  cnpjCard: File | null;
  addressProof: File | null;

  acceptTerms: boolean;
  acceptSCPCTerms: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { registerCNPJ } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formDataCNPJ, setFormDataCNPJ] = useState<FormDataCNPJ>({
    companyName: '',
    tradeName: '',
    cnpj: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    legalRepName: '',
    legalRepCPF: '',
    legalRepEmail: '',
    legalRepPhone: '',
    socialStatute: null,
    electionMinutes: null,
    cnpjCard: null,
    addressProof: null,
    acceptTerms: false,
    acceptSCPCTerms: false,
  });

  const totalStepsCNPJ = 4;

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})/, '$1-$2');
    }
    return value;
  };

  const formatCPF = (value: string) => {
    // CPF do responsável legal - apenas para identificação interna
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return value;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cnpj') formattedValue = formatCNPJ(value);
    if (name === 'legalRepCPF') formattedValue = formatCPF(value);
    if (name === 'phone' || name === 'legalRepPhone') formattedValue = formatPhone(value);
    if (name === 'cep') formattedValue = formatCEP(value);

    setFormDataCNPJ(prev => ({ ...prev, [name]: formattedValue }));
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormDataCNPJ(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const validateCNPJStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formDataCNPJ.companyName || !formDataCNPJ.cnpj || !formDataCNPJ.email ||
            !formDataCNPJ.phone || !formDataCNPJ.password || !formDataCNPJ.confirmPassword) {
          setError('Por favor, preencha todos os campos obrigatórios');
          return false;
        }
        if (formDataCNPJ.cnpj.replace(/\D/g, '').length !== 14) {
          setError('CNPJ deve ter 14 dígitos');
          return false;
        }
        if (formDataCNPJ.password !== formDataCNPJ.confirmPassword) {
          setError('As senhas não coincidem');
          return false;
        }
        if (formDataCNPJ.password.length < 8) {
          setError('A senha deve ter pelo menos 8 caracteres');
          return false;
        }
        break;
      case 2:
        if (!formDataCNPJ.cep || !formDataCNPJ.street || !formDataCNPJ.number ||
            !formDataCNPJ.neighborhood || !formDataCNPJ.city || !formDataCNPJ.state) {
          setError('Por favor, preencha todos os campos de endereço');
          return false;
        }
        break;
      case 3:
        if (!formDataCNPJ.legalRepName || !formDataCNPJ.legalRepCPF ||
            !formDataCNPJ.legalRepEmail || !formDataCNPJ.legalRepPhone) {
          setError('Por favor, preencha todos os dados do responsável legal');
          return false;
        }
        if (formDataCNPJ.legalRepCPF.replace(/\D/g, '').length !== 11) {
          setError('CPF do responsável legal deve ter 11 dígitos');
          return false;
        }
        break;
      case 4:
        if (!formDataCNPJ.socialStatute || !formDataCNPJ.electionMinutes ||
            !formDataCNPJ.cnpjCard || !formDataCNPJ.addressProof) {
          setError('Por favor, envie todos os documentos obrigatórios');
          return false;
        }
        if (!formDataCNPJ.acceptTerms || !formDataCNPJ.acceptSCPCTerms) {
          setError('Você deve aceitar todos os termos para continuar');
          return false;
        }
        break;
    }
    setError('');
    return true;
  };

  const handleNextStep = () => {
    if (validateCNPJStep(currentStep)) {
      if (currentStep < totalStepsCNPJ) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSubmitCNPJ = async () => {
    if (!validateCNPJStep(4)) return;

    setLoading(true);
    try {
      await registerCNPJ({
        companyName: formDataCNPJ.companyName,
        tradeName: formDataCNPJ.tradeName,
        cnpj: formDataCNPJ.cnpj.replace(/\D/g, ''),
        responsibleName: formDataCNPJ.legalRepName,
        responsibleCPF: formDataCNPJ.legalRepCPF.replace(/\D/g, ''),
        email: formDataCNPJ.email,
        password: formDataCNPJ.password,
        confirmPassword: formDataCNPJ.confirmPassword,
        phone: formDataCNPJ.phone.replace(/\D/g, ''),
        postalCode: formDataCNPJ.cep.replace(/\D/g, ''),
        address: `${formDataCNPJ.street}, ${formDataCNPJ.number}${formDataCNPJ.complement ? ' - ' + formDataCNPJ.complement : ''}, ${formDataCNPJ.neighborhood}`,
        city: formDataCNPJ.city,
        state: formDataCNPJ.state,
      });

      navigate('/dashboard/pending-approval');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <div className="card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo size="large" showText={true} />
          </div>

          {/* Legal Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <Scale className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-400 mb-1">
                  Cadastro Exclusivo para Empresas (CNPJ)
                </h3>
                <p className="text-sm text-yellow-300/80">
                  Conforme Lei 5.768/71 e Decreto 70.951/72, apenas pessoas jurídicas podem
                  realizar sorteios promocionais. Todas as promoções devem ser autorizadas
                  pelo SCPC com 40-120 dias de antecedência e vinculadas à Loteria Federal.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Cadastro de Empresa
            </h1>
            <p className="text-gray-400">
              Etapa {currentStep} de {totalStepsCNPJ}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`flex-1 ${step !== 4 ? 'mr-2' : ''}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all ${
                      step <= currentStep ? 'bg-secondary-500' : 'bg-white/10'
                    }`}
                  />
                  <p className="text-xs mt-2 text-gray-400">
                    {step === 1 && 'Dados'}
                    {step === 2 && 'Endereço'}
                    {step === 3 && 'Responsável'}
                    {step === 4 && 'Documentos'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </motion.div>
          )}

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Data */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Razão Social *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formDataCNPJ.companyName}
                      onChange={handleInputChange}
                      placeholder="Empresa Ltda"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome Fantasia
                    </label>
                    <input
                      type="text"
                      name="tradeName"
                      value={formDataCNPJ.tradeName}
                      onChange={handleInputChange}
                      placeholder="Nome comercial"
                      className="input-modern w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    CNPJ *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="cnpj"
                      value={formDataCNPJ.cnpj}
                      onChange={handleInputChange}
                      placeholder="00.000.000/0000-00"
                      className="input-modern pl-12 w-full"
                      maxLength={18}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-mail *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formDataCNPJ.email}
                        onChange={handleInputChange}
                        placeholder="empresa@email.com"
                        className="input-modern pl-12 w-full"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formDataCNPJ.phone}
                        onChange={handleInputChange}
                        placeholder="(11) 99999-9999"
                        className="input-modern pl-12 w-full"
                        maxLength={15}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formDataCNPJ.password}
                        onChange={handleInputChange}
                        placeholder="Mínimo 8 caracteres"
                        className="input-modern pl-12 pr-12 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirmar Senha *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formDataCNPJ.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Repita a senha"
                        className="input-modern pl-12 pr-12 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Address */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="cep"
                      value={formDataCNPJ.cep}
                      onChange={handleInputChange}
                      placeholder="00000-000"
                      className="input-modern w-full"
                      maxLength={9}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rua/Avenida *
                    </label>
                    <input
                      type="text"
                      name="street"
                      value={formDataCNPJ.street}
                      onChange={handleInputChange}
                      placeholder="Nome da rua"
                      className="input-modern w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={formDataCNPJ.number}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="input-modern w-full"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      name="complement"
                      value={formDataCNPJ.complement}
                      onChange={handleInputChange}
                      placeholder="Sala, andar, etc"
                      className="input-modern w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      name="neighborhood"
                      value={formDataCNPJ.neighborhood}
                      onChange={handleInputChange}
                      placeholder="Bairro"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formDataCNPJ.city}
                      onChange={handleInputChange}
                      placeholder="Cidade"
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estado *
                    </label>
                    <select
                      name="state"
                      value={formDataCNPJ.state}
                      onChange={(e) => setFormDataCNPJ(prev => ({ ...prev, state: e.target.value }))}
                      className="input-modern w-full"
                    >
                      <option value="">Selecione</option>
                      <option value="SP">SP</option>
                      <option value="RJ">RJ</option>
                      <option value="MG">MG</option>
                      <option value="ES">ES</option>
                      <option value="PR">PR</option>
                      <option value="SC">SC</option>
                      <option value="RS">RS</option>
                      {/* Adicionar outros estados */}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Legal Representative */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-400" />
                    <p className="text-sm text-blue-300">
                      O responsável legal deve ter poderes para representar a empresa
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo do Responsável *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="legalRepName"
                      value={formDataCNPJ.legalRepName}
                      onChange={handleInputChange}
                      placeholder="Nome completo"
                      className="input-modern pl-12 w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CPF do Responsável Legal * <span className="text-xs text-gray-400">(apenas para identificação)</span>
                    </label>
                    <input
                      type="text"
                      name="legalRepCPF"
                      value={formDataCNPJ.legalRepCPF}
                      onChange={handleInputChange}
                      placeholder="000.000.000-00"
                      className="input-modern w-full"
                      maxLength={14}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Telefone do Responsável *
                    </label>
                    <input
                      type="tel"
                      name="legalRepPhone"
                      value={formDataCNPJ.legalRepPhone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className="input-modern w-full"
                      maxLength={15}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    E-mail do Responsável *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="legalRepEmail"
                      value={formDataCNPJ.legalRepEmail}
                      onChange={handleInputChange}
                      placeholder="responsavel@email.com"
                      className="input-modern pl-12 w-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Documentation */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-yellow-300 font-semibold mb-1">
                        Documentos necessários para autorização SCPC
                      </p>
                      <p className="text-xs text-yellow-300/80">
                        Todos os documentos serão verificados antes da aprovação do cadastro
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contrato Social *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        name="socialStatute"
                        onChange={handleFileChange}
                        className="hidden"
                        id="socialStatute"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="socialStatute"
                        className="btn-secondary flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar Arquivo
                      </label>
                      {formDataCNPJ.socialStatute && (
                        <span className="text-sm text-green-400">
                          {formDataCNPJ.socialStatute.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ata de Eleição *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        name="electionMinutes"
                        onChange={handleFileChange}
                        className="hidden"
                        id="electionMinutes"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="electionMinutes"
                        className="btn-secondary flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar Arquivo
                      </label>
                      {formDataCNPJ.electionMinutes && (
                        <span className="text-sm text-green-400">
                          {formDataCNPJ.electionMinutes.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Cartão CNPJ *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        name="cnpjCard"
                        onChange={handleFileChange}
                        className="hidden"
                        id="cnpjCard"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="cnpjCard"
                        className="btn-secondary flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar Arquivo
                      </label>
                      {formDataCNPJ.cnpjCard && (
                        <span className="text-sm text-green-400">
                          {formDataCNPJ.cnpjCard.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Comprovante de Endereço *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        name="addressProof"
                        onChange={handleFileChange}
                        className="hidden"
                        id="addressProof"
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      <label
                        htmlFor="addressProof"
                        className="btn-secondary flex items-center gap-2 cursor-pointer"
                      >
                        <Upload className="w-4 h-4" />
                        Selecionar Arquivo
                      </label>
                      {formDataCNPJ.addressProof && (
                        <span className="text-sm text-green-400">
                          {formDataCNPJ.addressProof.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDataCNPJ.acceptTerms}
                      onChange={(e) => setFormDataCNPJ(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="text-gray-300">
                        Li e aceito os{' '}
                        <Link to="/legal-terms" className="text-primary-400 hover:text-primary-300">
                          Termos de Uso
                        </Link>
                        {' '}e a{' '}
                        <Link to="/privacy-policy" className="text-primary-400 hover:text-primary-300">
                          Política de Privacidade
                        </Link>
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formDataCNPJ.acceptSCPCTerms}
                      onChange={(e) => setFormDataCNPJ(prev => ({ ...prev, acceptSCPCTerms: e.target.checked }))}
                      className="mt-1"
                    />
                    <div className="text-sm">
                      <p className="text-gray-300">
                        Declaro estar ciente de que todos os sorteios promocionais devem ser
                        cadastrados no SCPC com 40 a 120 dias de antecedência e vinculados
                        à Loteria Federal, conforme
                        Lei 5.768/71 e Decreto 70.951/72
                      </p>
                    </div>
                  </label>
                </div>

                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-400 mb-1">
                        Prazo de análise: 3-5 dias úteis
                      </p>
                      <p className="text-xs text-green-300/80">
                        Após a aprovação, você poderá cadastrar suas primeiras promoções
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="btn-secondary flex items-center gap-2"
                disabled={loading}
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
            )}

            {currentStep < totalStepsCNPJ ? (
              <button
                onClick={handleNextStep}
                className="btn-primary flex items-center gap-2 flex-1"
                disabled={loading}
              >
                Próximo
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitCNPJ}
                className="btn-primary flex items-center justify-center gap-2 flex-1"
                disabled={loading}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Finalizar Cadastro
                  </>
                )}
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Já possui uma conta empresarial?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-semibold"
              >
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;